import { ArrowLeft, CheckCircle2, PencilLine } from "lucide-react";
import type { AdmissionFormState, SectionKey } from "../../types/admission";
import { Button } from "../ui/Button";

type Props = {
  values: AdmissionFormState;
  onBackToForm: () => void;
  onEditSection: (section: SectionKey) => void;
  onConfirm: () => void;
  isSubmitting: boolean;
};

type ReviewSection = {
  key: SectionKey;
  title: string;
  editLabel: string;
  rows: Array<{ label: string; value: string }>;
};

const emptyValue = "Not provided";

function show(value?: string | null) {
  return value?.trim() ? value : emptyValue;
}

function fileSizeLabel(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdmissionReview({ values, onBackToForm, onEditSection, onConfirm, isSubmitting }: Props) {
  const sections: ReviewSection[] = [
    {
      key: "details",
      title: "Admission Details",
      editLabel: "Edit Admission Details",
      rows: [
        { label: "Admission number", value: "Pending auto-numbering in backend task" },
        { label: "Registration number", value: show(values.registrationNumber) },
        { label: "Admission date", value: show(values.admissionDate) },
        { label: "Academic year", value: show(values.academicYear) },
        { label: "Class admitted", value: show(values.classAdmitted) },
        { label: "Section", value: show(values.section) },
        { label: "Admission type", value: show(values.admissionType) },
      ],
    },
    {
      key: "student",
      title: "Student Details",
      editLabel: "Edit Student Details",
      rows: [
        { label: "Full name", value: show(values.fullName) },
        { label: "Name as per document", value: show(values.nameAsPerDocument) },
        { label: "Date of birth", value: show(values.dateOfBirth) },
        { label: "Gender", value: show(values.gender) },
        { label: "Blood group", value: show(values.bloodGroup) },
        { label: "Nationality", value: show(values.nationality) },
        { label: "Mother tongue", value: show(values.motherTongue) },
        { label: "Address", value: show(values.residentialAddress) },
        { label: "City / village", value: show(values.city) },
        { label: "State", value: show(values.state) },
        { label: "PIN code", value: show(values.pinCode) },
        { label: "Photo", value: values.photo ? `${values.photo.name} (${fileSizeLabel(values.photo.size)})` : emptyValue },
      ],
    },
    {
      key: "guardian",
      title: "Parent / Guardian Details",
      editLabel: "Edit Parent Details",
      rows: [
        { label: "Father's name", value: show(values.fatherName) },
        { label: "Father's occupation", value: show(values.fatherOccupation) },
        { label: "Mother's name", value: show(values.motherName) },
        { label: "Mother's occupation", value: show(values.motherOccupation) },
        { label: "Guardian name", value: show(values.guardianName) },
        { label: "Phone", value: show(values.parentPhone) },
        { label: "Alternate phone", value: show(values.alternatePhone) },
        { label: "Email", value: show(values.email) },
        { label: "Address", value: show(values.parentAddress) },
        { label: "Emergency contact", value: show(values.emergencyContactName) },
        { label: "Emergency phone", value: show(values.emergencyContactPhone) },
      ],
    },
    {
      key: "education",
      title: "Previous Education",
      editLabel: "Edit Previous Education",
      rows: [
        { label: "Previous school", value: show(values.previousSchoolName) },
        { label: "Previous school address", value: show(values.previousSchoolAddress) },
        { label: "Previous class", value: show(values.previousClass) },
        { label: "Previous academic year", value: show(values.previousAcademicYear) },
        { label: "Previous registration number", value: show(values.previousRegistrationNumber) },
        { label: "Previous admission number", value: show(values.previousAdmissionNumber) },
        { label: "Transfer certificate number", value: show(values.previousTransferCertificateNumber) },
        { label: "Transfer certificate date", value: show(values.previousTransferCertificateDate) },
      ],
    },
  ];

  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Review</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900">Review Before Saving</h3>
          <p className="mt-2 text-sm text-slate-500">Confirming will save the admission to PostgreSQL.</p>
        </div>
        <Button variant="secondary" icon={ArrowLeft} onClick={onBackToForm}>
          Back to Form
        </Button>
      </div>

      <div className="mt-6 space-y-5">
        {sections.map((section) => (
          <section key={section.key} className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h4 className="text-sm font-semibold text-slate-950">{section.title}</h4>
              <button
                type="button"
                onClick={() => onEditSection(section.key)}
                className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700"
              >
                <PencilLine className="h-3.5 w-3.5" aria-hidden="true" />
                {section.editLabel}
              </button>
            </div>
            <dl className="mt-4 grid gap-3 md:grid-cols-2">
              {section.rows.map((row) => (
                <div key={`${section.key}-${row.label}`} className="rounded-md border border-slate-200 bg-white p-3">
                  <dt className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500">{row.label}</dt>
                  <dd className="mt-1 break-words text-sm font-semibold text-slate-900">{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}

        <section className="rounded-md border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h4 className="text-sm font-semibold text-slate-950">Selected Documents</h4>
            <button
              type="button"
              onClick={() => onEditSection("documents")}
              className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700"
            >
              <PencilLine className="h-3.5 w-3.5" aria-hidden="true" />
              Edit Documents
            </button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {values.documents.map((documentItem) => (
              <div key={documentItem.id} className="rounded-md border border-slate-200 bg-white p-3">
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500">{documentItem.label}</p>
                <p className="mt-1 break-words text-sm font-semibold text-slate-900">
                  {documentItem.file
                    ? `${documentItem.file.name} (${documentItem.file.type || "Unknown type"}, ${fileSizeLabel(documentItem.file.size)})`
                    : emptyValue}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onBackToForm}>
          Back to Form
        </Button>
        <Button icon={CheckCircle2} onClick={onConfirm} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Confirm Admission"}
        </Button>
      </div>
    </div>
  );
}
