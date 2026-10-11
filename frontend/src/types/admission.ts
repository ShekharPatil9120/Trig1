export type AdmissionType = "New Admission" | "Transfer Admission";

export type Gender = "Male" | "Female" | "Other" | "Prefer not to say";

export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-"
  | "Unknown";

export type AdmissionDocument = {
  id: string;
  label: string;
  required: boolean;
  file: File | null;
  error?: string;
};

export type AdmissionFormState = {
  admissionNumber: string;
  registrationNumber: string;
  admissionDate: string;
  academicYear: string;
  classAdmitted: string;
  section: string;
  admissionType: AdmissionType | "";
  previousSchoolName: string;
  previousClass: string;
  previousAdmissionNumber: string;
  previousTransferCertificateNumber: string;
  photo: File | null;
  photoPreview: string | null;
  fullName: string;
  nameAsPerDocument: string;
  dateOfBirth: string;
  gender: Gender | "";
  bloodGroup: BloodGroup | "";
  nationality: string;
  motherTongue: string;
  residentialAddress: string;
  city: string;
  state: string;
  pinCode: string;
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  guardianName: string;
  parentPhone: string;
  alternatePhone: string;
  email: string;
  parentAddress: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  previousSchoolAddress: string;
  previousAcademicYear: string;
  previousRegistrationNumber: string;
  previousTransferCertificateDate: string;
  documents: AdmissionDocument[];
};

export type FormErrors = Partial<Record<string, string>>;

export type SectionKey = "details" | "student" | "guardian" | "education" | "documents";
