const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export type CertificateType = { id: string; name: string };

export async function listCertificateTypes(): Promise<CertificateType[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/certificates/types`);
  if (!response.ok) throw new Error("Certificate types could not be loaded.");
  const types = (await response.json()) as CertificateType[];
  if (!Array.isArray(types)) throw new Error("The certificate types response was invalid.");
  return types;
}

export async function generateCertificate(
  certificateType: string,
  studentId: number,
): Promise<{ blob: Blob; filename: string }> {
  const params = new URLSearchParams({ certificate_type: certificateType });
  const response = await fetch(`${API_BASE_URL}/api/v1/certificates/generate/${studentId}?${params}`);
  if (!response.ok) {
    const message = response.status === 404
      ? "Student record was not found. Search again and select a current student record."
      : response.status === 422
        ? "Choose a supported certificate type."
        : "Certificate generation failed. Please try again.";
    throw new Error(message);
  }

  const blob = await response.blob();
  const disposition = response.headers.get("Content-Disposition");
  const filename = disposition?.match(/filename="?([^";]+)"?/i)?.[1] ?? `Certificate_Student_${studentId}.pdf`;
  return { blob, filename };
}
