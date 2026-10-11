import type { AdmissionFormState, FormErrors } from "../../types/admission";

type Props = {
  values: AdmissionFormState;
  errors: FormErrors;
  onChange: (field: keyof AdmissionFormState, value: string) => void;
};

const fieldClass =
  "mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function RequiredMark() {
  return <span className="ml-1 text-xs font-semibold text-red-600">Required</span>;
}

export default function AdmissionDetailsForm({ values, errors, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Section 1</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">Admission Details</h3>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Admission Number</label>
          <input
            aria-label="Admission Number"
            value={values.admissionNumber}
            disabled
            className={`${fieldClass} cursor-not-allowed bg-slate-100 text-slate-500`}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Registration Number</label>
          <input
            aria-label="Registration Number"
            value={values.registrationNumber}
            onChange={(event) => onChange("registrationNumber", event.target.value)}
            placeholder="e.g. REG-2026-001"
            className={fieldClass}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Admission Date
            <RequiredMark />
          </label>
          <input
            aria-label="Admission Date"
            type="date"
            value={values.admissionDate}
            onChange={(event) => onChange("admissionDate", event.target.value)}
            className={fieldClass}
          />
          {errors.admissionDate ? <p className="mt-1 text-xs text-red-600">{errors.admissionDate}</p> : null}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Academic Year
            <RequiredMark />
          </label>
          <select
            aria-label="Academic Year"
            value={values.academicYear}
            onChange={(event) => onChange("academicYear", event.target.value)}
            className={fieldClass}
          >
            <option value="">Select academic year</option>
            <option value="2026-27">2026-27</option>
            <option value="2025-26">2025-26</option>
            <option value="2024-25">2024-25</option>
            <option value="2023-24">2023-24</option>
          </select>
          {errors.academicYear ? <p className="mt-1 text-xs text-red-600">{errors.academicYear}</p> : null}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Class Admitted
            <RequiredMark />
          </label>
          <select
            aria-label="Class Admitted"
            value={values.classAdmitted}
            onChange={(event) => onChange("classAdmitted", event.target.value)}
            className={fieldClass}
          >
            <option value="">Select class</option>
            <option value="Nursery">Nursery</option>
            <option value="Prep">Prep</option>
            <option value="Class 1">Class 1</option>
            <option value="Class 2">Class 2</option>
            <option value="Class 3">Class 3</option>
            <option value="Class 4">Class 4</option>
            <option value="Class 5">Class 5</option>
            <option value="Class 6">Class 6</option>
            <option value="Class 7">Class 7</option>
            <option value="Class 8">Class 8</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 10">Class 10</option>
            <option value="Class 11">Class 11</option>
            <option value="Class 12">Class 12</option>
          </select>
          {errors.classAdmitted ? <p className="mt-1 text-xs text-red-600">{errors.classAdmitted}</p> : null}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Section
            <RequiredMark />
          </label>
          <select
            aria-label="Section"
            value={values.section}
            onChange={(event) => onChange("section", event.target.value)}
            className={fieldClass}
          >
            <option value="">Select section</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
          </select>
          {errors.section ? <p className="mt-1 text-xs text-red-600">{errors.section}</p> : null}
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-700">
            Admission Type
            <RequiredMark />
          </label>
          <select
            aria-label="Admission Type"
            value={values.admissionType}
            onChange={(event) => onChange("admissionType", event.target.value)}
            className={fieldClass}
          >
            <option value="">Select type</option>
            <option value="New Admission">New Admission</option>
            <option value="Transfer Admission">Transfer Admission</option>
          </select>
          {errors.admissionType ? <p className="mt-1 text-xs text-red-600">{errors.admissionType}</p> : null}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Previous School Name</label>
          <input
            aria-label="Previous School Name"
            value={values.previousSchoolName}
            onChange={(event) => onChange("previousSchoolName", event.target.value)}
            placeholder="Required for transfer admission"
            className={fieldClass}
          />
          {errors.previousSchoolName ? <p className="mt-1 text-xs text-red-600">{errors.previousSchoolName}</p> : null}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Previous Class</label>
          <input
            aria-label="Previous Class"
            value={values.previousClass}
            onChange={(event) => onChange("previousClass", event.target.value)}
            placeholder="Required for transfer admission"
            className={fieldClass}
          />
          {errors.previousClass ? <p className="mt-1 text-xs text-red-600">{errors.previousClass}</p> : null}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Previous Admission Number</label>
          <input
            aria-label="Previous Admission Number"
            value={values.previousAdmissionNumber}
            onChange={(event) => onChange("previousAdmissionNumber", event.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Previous Transfer Certificate Number</label>
          <input
            aria-label="Previous Transfer Certificate Number"
            value={values.previousTransferCertificateNumber}
            onChange={(event) => onChange("previousTransferCertificateNumber", event.target.value)}
            placeholder="Required for transfer admission"
            className={fieldClass}
          />
          {errors.previousTransferCertificateNumber ? (
            <p className="mt-1 text-xs text-red-600">{errors.previousTransferCertificateNumber}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
