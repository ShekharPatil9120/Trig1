import { useState } from "react";
import { AlertCircle, ArrowLeft, CheckCircle2, ChevronRight, FileSpreadsheet, FileText, ShieldAlert, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdmissionDetailsForm from "../components/admissions/AdmissionDetailsForm";
import AdmissionReview from "../components/admissions/AdmissionReview";
import AdmissionSuccess from "../components/admissions/AdmissionSuccess";
import BulkAdmissionUpload from "../components/admissions/BulkAdmissionUpload";
import DocumentUploadForm from "../components/admissions/DocumentUploadForm";
import ParentDetailsForm from "../components/admissions/ParentDetailsForm";
import PreviousEducationForm from "../components/admissions/PreviousEducationForm";
import StudentDetailsForm from "../components/admissions/StudentDetailsForm";
import { Button } from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import { documentOptions } from "../data/admissionOptions";
import { createAdmission, type AdmissionRegistrationResponse } from "../services/admissionsApi";
import type { AdmissionFormState, FormErrors, SectionKey } from "../types/admission";

const defaultDocuments = documentOptions.map((document) => ({
  id: document.id,
  label: document.label,
  required: document.required,
  file: null,
  error: undefined,
}));

const initialState: AdmissionFormState = {
  admissionNumber: "Pending auto-numbering",
  registrationNumber: "",
  admissionDate: "",
  academicYear: "2026-27",
  classAdmitted: "",
  section: "",
  admissionType: "",
  previousSchoolName: "",
  previousClass: "",
  previousAdmissionNumber: "",
  previousTransferCertificateNumber: "",
  photo: null,
  photoPreview: null,
  fullName: "",
  nameAsPerDocument: "",
  dateOfBirth: "",
  gender: "",
  bloodGroup: "",
  nationality: "India",
  motherTongue: "",
  residentialAddress: "",
  city: "",
  state: "",
  pinCode: "",
  fatherName: "",
  fatherOccupation: "",
  motherName: "",
  motherOccupation: "",
  guardianName: "",
  parentPhone: "",
  alternatePhone: "",
  email: "",
  parentAddress: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  previousSchoolAddress: "",
  previousAcademicYear: "",
  previousRegistrationNumber: "",
  previousTransferCertificateDate: "",
  documents: defaultDocuments,
};

const sectionMeta: Array<{ id: SectionKey; label: string; helper: string }> = [
  { id: "details", label: "Admission Details", helper: "Office intake" },
  { id: "student", label: "Student Details", helper: "Profile information" },
  { id: "guardian", label: "Parent / Guardian", helper: "Contact details" },
  { id: "education", label: "Previous Education", helper: "Transfer history" },
  { id: "documents", label: "Documents", helper: "Uploads" },
];

function formatPhone(value: string) {
  return value.replace(/\D/g, "");
}

function isValidPhone(value: string) {
  return /^\d{10}$/.test(value);
}

function isValidEmail(value: string) {
  return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPinCode(value: string) {
  return !value || /^\d{6}$/.test(value);
}

function isSupportedFile(file: File) {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  return allowed.includes(file.type) || /\.(jpg|jpeg|png|webp|gif|pdf|doc|docx)$/i.test(file.name);
}

function isSupportedImage(file: File) {
  return ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type) || /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name);
}

function validateDocuments(values: AdmissionFormState): FormErrors {
  const errors: FormErrors = {};

  values.documents.forEach((documentItem) => {
    if (!documentItem.file) {
      return;
    }

    if (!isSupportedFile(documentItem.file)) {
      errors[`document-${documentItem.id}`] = "Unsupported file type. Use JPG, PNG, PDF, DOC or DOCX.";
      return;
    }

    if (documentItem.file.size > 5 * 1024 * 1024) {
      errors[`document-${documentItem.id}`] = "File size must be 5 MB or less.";
      return;
    }
  });

  return errors;
}

function validateForm(values: AdmissionFormState): FormErrors {
  const errors: FormErrors = {};

  if (!values.admissionDate) {
    errors.admissionDate = "Admission date is required.";
  }

  if (!values.academicYear) {
    errors.academicYear = "Academic year is required.";
  }

  if (!values.classAdmitted) {
    errors.classAdmitted = "Class admitted is required.";
  }

  if (!values.section) {
    errors.section = "Section is required.";
  }

  if (!values.admissionType) {
    errors.admissionType = "Admission type is required.";
  }

  if (!values.fullName.trim()) {
    errors.fullName = "Student full name is required.";
  }

  if (!values.dateOfBirth) {
    errors.dateOfBirth = "Date of birth is required.";
  } else {
    const dob = new Date(values.dateOfBirth);
    const today = new Date();
    if (dob > today) {
      errors.dateOfBirth = "Date of birth cannot be in the future.";
    }
  }

  if (!values.gender) {
    errors.gender = "Gender is required.";
  }

  if (!values.nationality.trim()) {
    errors.nationality = "Nationality is required.";
  }

  if (!values.motherTongue.trim()) {
    errors.motherTongue = "Mother tongue is required.";
  }

  if (!values.residentialAddress.trim()) {
    errors.residentialAddress = "Residential address is required.";
  }

  if (!values.city.trim()) {
    errors.city = "City or village is required.";
  }

  if (!values.state.trim()) {
    errors.state = "State is required.";
  }

  if (values.pinCode && !isValidPinCode(values.pinCode)) {
    errors.pinCode = "PIN code must be a valid 6-digit Indian postal code.";
  }

  const phoneValue = formatPhone(values.parentPhone);
  if (phoneValue && !isValidPhone(phoneValue)) {
    errors.parentPhone = "Parent or guardian phone number must be a valid 10-digit number.";
  }

  if (values.alternatePhone && !isValidPhone(formatPhone(values.alternatePhone))) {
    errors.alternatePhone = "Alternate phone number must be a valid 10-digit number.";
  }

  if (values.email && !isValidEmail(values.email)) {
    errors.email = "Email address must be valid.";
  }

  if (values.emergencyContactPhone && !isValidPhone(formatPhone(values.emergencyContactPhone))) {
    errors.emergencyContactPhone = "Emergency contact phone number must be a valid 10-digit number.";
  }

  if (values.admissionType === "Transfer Admission") {
    if (!values.previousSchoolName.trim()) {
      errors.previousSchoolName = "Previous school name is required for transfer admissions.";
    }
    if (!values.previousClass.trim()) {
      errors.previousClass = "Previous class is required for transfer admissions.";
    }
    if (!values.previousAcademicYear) {
      errors.previousAcademicYear = "Previous academic year is required for transfer admissions.";
    }
    if (!values.previousTransferCertificateNumber.trim()) {
      errors.previousTransferCertificateNumber = "Previous transfer certificate number is required for transfer admissions.";
    }
    if (!values.previousTransferCertificateDate) {
      errors.previousTransferCertificateDate = "Transfer certificate date is required for transfer admissions.";
    }
  }

  if (values.photo && values.photo.size > 2 * 1024 * 1024) {
    errors.photo = "Photo must be 2 MB or less.";
  }

  if (values.photo && !isSupportedImage(values.photo)) {
    errors.photo = "Unsupported image type. Use JPG, PNG or WEBP.";
  }

  Object.assign(errors, validateDocuments(values));
  return errors;
}

export default function NewAdmissionPage() {
  const navigate = useNavigate();
  const [admissionMode, setAdmissionMode] = useState<"single" | "bulk">("single");
  const [values, setValues] = useState<AdmissionFormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [activeSection, setActiveSection] = useState<SectionKey>("details");
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionNotice, setSubmissionNotice] = useState<string | null>(null);
  const [submittedAdmission, setSubmittedAdmission] = useState<AdmissionRegistrationResponse | null>(null);

  const updateField = (field: keyof AdmissionFormState, nextValue: string) => {
    setValues((current) => ({
      ...current,
      [field]: nextValue,
    }));
    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  };

  const handlePhotoChange = (file: File | null) => {
    if (!file) {
      setValues((current) => ({ ...current, photo: null, photoPreview: null }));
      setErrors((current) => ({ ...current, photo: undefined }));
      return;
    }

    if (!isSupportedImage(file)) {
      setErrors((current) => ({ ...current, photo: "Unsupported image type. Use JPG, PNG or WEBP." }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors((current) => ({ ...current, photo: "Photo must be 2 MB or less." }));
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setValues((current) => ({
      ...current,
      photo: file,
      photoPreview: previewUrl,
    }));
    setErrors((current) => ({ ...current, photo: undefined }));
  };

  const handleDocumentChange = (documentId: string, file: File | null) => {
    setValues((current) => ({
      ...current,
      documents: current.documents.map((documentItem) => {
        if (documentItem.id !== documentId) {
          return documentItem;
        }

        return {
          ...documentItem,
          file,
          error: undefined,
        };
      }),
    }));

    setErrors((current) => {
      const nextErrors = { ...current, [`document-${documentId}`]: undefined };

      if (file && !isSupportedFile(file)) {
        nextErrors[`document-${documentId}`] = "Unsupported file type. Use JPG, PNG, PDF, DOC or DOCX.";
      }

      if (file && file.size > 5 * 1024 * 1024) {
        nextErrors[`document-${documentId}`] = "File size must be 5 MB or less.";
      }

      return nextErrors;
    });
  };

  const handleSubmit = () => {
    const nextErrors = validateForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmissionNotice("Please correct the highlighted fields before confirming the admission.");
      setSubmittedAdmission(null);
      setIsReviewMode(false);
      const firstErrorField = Object.keys(nextErrors)[0];
      const fieldSectionMap: Record<string, SectionKey> = {
        admissionDate: "details",
        academicYear: "details",
        classAdmitted: "details",
        section: "details",
        admissionType: "details",
        fullName: "student",
        dateOfBirth: "student",
        gender: "student",
        nationality: "student",
        motherTongue: "student",
        residentialAddress: "student",
        city: "student",
        state: "student",
        pinCode: "student",
        photo: "student",
        parentPhone: "guardian",
        alternatePhone: "guardian",
        email: "guardian",
        emergencyContactPhone: "guardian",
        previousSchoolName: "education",
        previousClass: "education",
        previousAcademicYear: "education",
        previousTransferCertificateNumber: "education",
        previousTransferCertificateDate: "education",
      };

      if (firstErrorField?.startsWith("document-")) {
        setActiveSection("documents");
      } else {
        setActiveSection(firstErrorField ? fieldSectionMap[firstErrorField] ?? "details" : "details");
      }
      return;
    }

    setIsSubmitting(true);
    setSubmissionNotice(null);

    createAdmission(values)
      .then((registration) => {
        setSubmittedAdmission(registration);
        setIsReviewMode(false);
        setSubmissionNotice("Admission saved successfully. The student is now searchable in the student register.");
      })
      .catch((error: unknown) => {
        setSubmittedAdmission(null);
        setSubmissionNotice(error instanceof Error ? error.message : "Admission could not be saved.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const resetForm = () => {
    setValues(initialState);
    setErrors({});
    setIsReviewMode(false);
    setActiveSection("details");
    setSubmissionNotice(null);
    setSubmittedAdmission(null);
  };

  const switchAdmissionMode = (mode: "single" | "bulk") => {
    setAdmissionMode(mode);
    setIsReviewMode(false);
    setSubmissionNotice(null);
    setSubmittedAdmission(null);
  };

  const sectionContent = (
    <div className="space-y-6">
      <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {sectionMeta.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                activeSection === section.id
                  ? "border-blue-700 bg-blue-700 text-white"
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-200 hover:text-blue-700"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {activeSection === "details" ? (
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <AdmissionDetailsForm values={values} errors={errors} onChange={updateField} />
        </div>
      ) : null}

      {activeSection === "student" ? (
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <StudentDetailsForm values={values} errors={errors} onChange={updateField} onPhotoChange={handlePhotoChange} />
        </div>
      ) : null}

      {activeSection === "guardian" ? (
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <ParentDetailsForm values={values} errors={errors} onChange={updateField} />
        </div>
      ) : null}

      {activeSection === "education" ? (
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <PreviousEducationForm values={values} errors={errors} onChange={updateField} />
        </div>
      ) : null}

      {activeSection === "documents" ? (
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <DocumentUploadForm values={values} errors={errors} onChange={handleDocumentChange} />
        </div>
      ) : null}

      <div className="flex flex-col justify-between gap-3 border-t border-slate-200 pt-5 sm:flex-row">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <ShieldAlert className="h-4 w-4 text-amber-600" aria-hidden="true" />
          Confirming the review saves the student to PostgreSQL.
        </div>
        <Button icon={ChevronRight} onClick={() => setIsReviewMode(true)}>
          Review Admission
        </Button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-2 text-sm text-slate-500">
          <span>Home</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span>Admissions</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span className="font-medium text-slate-700">New Admission</span>
        </div>

        <PageHeader
          eyebrow="Admissions office"
          title="New Admission"
          description="Create a new student intake record with required administrative details, transfer context and supporting documents."
        />
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => switchAdmissionMode("single")}
            className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition ${
              admissionMode === "single"
                ? "border-blue-700 bg-blue-700 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700"
            }`}
          >
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            Single Admission
          </button>
          <button
            type="button"
            onClick={() => switchAdmissionMode("bulk")}
            className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition ${
              admissionMode === "bulk"
                ? "border-blue-700 bg-blue-700 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700"
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
            Bulk Admission (Excel/CSV Upload)
          </button>
        </div>
      </div>

      {admissionMode === "bulk" ? (
        <BulkAdmissionUpload />
      ) : submittedAdmission ? (
        <AdmissionSuccess
          values={values}
          registration={submittedAdmission}
          onStartNew={resetForm}
          onDashboard={() => navigate("/dashboard")}
        />
      ) : isReviewMode ? (
        <AdmissionReview
          values={values}
          onBackToForm={() => setIsReviewMode(false)}
          onEditSection={(section) => {
            setIsReviewMode(false);
            setActiveSection(section);
          }}
          onConfirm={handleSubmit}
          isSubmitting={isSubmitting}
        />
      ) : (
        sectionContent
      )}

      {submissionNotice ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>{submissionNotice}</p>
          </div>
        </div>
      ) : null}

      {admissionMode === "single" && !isReviewMode && !submittedAdmission ? (
        <div className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <FileText className="h-4 w-4 text-blue-700" aria-hidden="true" />
            <span>Pre-submission check: verify all required fields and uploaded files.</span>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
            <Button icon={UserPlus} onClick={() => setIsReviewMode(true)}>
              Review Admission
            </Button>
          </div>
        </div>
      ) : null}

      {submittedAdmission ? (
        <div className="flex flex-col gap-3 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            <span>Admission saved successfully.</span>
          </div>
          <Button variant="secondary" onClick={resetForm}>
            Start Another Admission
          </Button>
        </div>
      ) : null}
    </div>
  );
}
