import type { AdmissionFormState } from "../types/admission";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export type AdmissionRegistrationResponse = {
  student_id: number;
  student_code: string;
  admission_id: number;
  admission_number: string;
  student_name: string;
  academic_year: string;
  class_name: string;
  section_name: string;
};

export type BulkAdmissionError = {
  row_number: number;
  column: string;
  value?: string | null;
  message: string;
  suggestion?: string | null;
};

export type BulkAdmissionPreviewRow = {
  row_number: number;
  status: "valid" | "invalid" | "duplicate";
  admission_date?: string | null;
  academic_year?: string | null;
  class_admitted?: string | null;
  section?: string | null;
  admission_type?: string | null;
  registration_number?: string | null;
  student_name?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  parent_phone?: string | null;
  errors: BulkAdmissionError[];
};

export type BulkAdmissionValidationResponse = {
  total_rows: number;
  valid_rows: number;
  invalid_rows: number;
  duplicate_rows: number;
  rows: BulkAdmissionPreviewRow[];
  errors: BulkAdmissionError[];
  academic_years_to_create: string[];
  classes_to_create: string[];
  sections_to_create: string[];
};

export type BulkAdmissionImportSummary = {
  rows_processed: number;
  imported: number;
  invalid_rows: number;
  duplicate_rows: number;
  failed_rows: number;
  academic_years_created: string[];
  classes_created: string[];
  sections_created: string[];
};

export type BulkAdmissionImportResponse = {
  summary: BulkAdmissionImportSummary;
  imported_records: AdmissionRegistrationResponse[];
  validation: BulkAdmissionValidationResponse;
};

function emptyToNull(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export async function createAdmission(values: AdmissionFormState): Promise<AdmissionRegistrationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/admissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      admission_date: values.admissionDate,
      academic_year: values.academicYear,
      class_admitted: values.classAdmitted,
      section: values.section,
      admission_type: values.admissionType,
      registration_number: emptyToNull(values.registrationNumber),
      previous_school: emptyToNull(values.previousSchoolName),
      previous_class: emptyToNull(values.previousClass),
      previous_admission_number: emptyToNull(values.previousAdmissionNumber),
      previous_tc_number: emptyToNull(values.previousTransferCertificateNumber),
      student_name: values.fullName.trim(),
      date_of_birth: values.dateOfBirth,
      gender: values.gender,
      father_name: emptyToNull(values.fatherName),
      mother_name: emptyToNull(values.motherName),
      guardian_name: emptyToNull(values.guardianName),
      parent_phone: emptyToNull(values.parentPhone),
      parent_email: emptyToNull(values.email),
      parent_address: emptyToNull(values.parentAddress || values.residentialAddress),
    }),
  });

  if (!response.ok) {
    const message = response.status === 422 ? "Please review the admission details and try again." : "Admission could not be saved.";
    throw new Error(message);
  }

  return (await response.json()) as AdmissionRegistrationResponse;
}

async function parseApiError(response: Response, fallback: string) {
  try {
    const payload = (await response.json()) as { detail?: string };
    return payload.detail || fallback;
  } catch {
    return fallback;
  }
}

export function bulkAdmissionTemplateUrl(format: "xlsx" | "csv" = "xlsx") {
  return `${API_BASE_URL}/api/v1/admissions/bulk/template?format=${format}`;
}

export async function validateBulkAdmissions(file: File): Promise<BulkAdmissionValidationResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/v1/admissions/bulk/validate`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response, "Bulk admission file could not be validated."));
  }

  return (await response.json()) as BulkAdmissionValidationResponse;
}

export async function importBulkAdmissions(file: File): Promise<BulkAdmissionImportResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/v1/admissions/bulk/import`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response, "Bulk admission import could not be completed."));
  }

  return (await response.json()) as BulkAdmissionImportResponse;
}
