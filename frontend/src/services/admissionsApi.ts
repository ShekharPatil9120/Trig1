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
