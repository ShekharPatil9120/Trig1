import type { AdmissionFormState, FormErrors } from "../../types/admission";

type Props = {
  values: AdmissionFormState;
  errors: FormErrors;
  onChange: (field: keyof AdmissionFormState, value: string) => void;
};

const inputClass =
  "mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export default function PreviousEducationForm({ values, errors, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Section 4</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">Previous Education</h3>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Previous School Name</label>
          <input
            aria-label="Previous School Name"
            value={values.previousSchoolName}
            onChange={(event) => onChange("previousSchoolName", event.target.value)}
            className={inputClass}
          />
          {errors.previousSchoolName ? <p className="mt-1 text-xs text-red-600">{errors.previousSchoolName}</p> : null}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Previous Class</label>
          <input aria-label="Previous Class" value={values.previousClass} onChange={(event) => onChange("previousClass", event.target.value)} className={inputClass} />
          {errors.previousClass ? <p className="mt-1 text-xs text-red-600">{errors.previousClass}</p> : null}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Previous Admission Number</label>
          <input
            aria-label="Previous Admission Number"
            value={values.previousAdmissionNumber}
            onChange={(event) => onChange("previousAdmissionNumber", event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Previous Transfer Certificate Number</label>
          <input
            aria-label="Previous Transfer Certificate Number"
            value={values.previousTransferCertificateNumber}
            onChange={(event) => onChange("previousTransferCertificateNumber", event.target.value)}
            className={inputClass}
          />
          {errors.previousTransferCertificateNumber ? (
            <p className="mt-1 text-xs text-red-600">{errors.previousTransferCertificateNumber}</p>
          ) : null}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Previous Academic Year</label>
          <input
            aria-label="Previous Academic Year"
            value={values.previousAcademicYear}
            onChange={(event) => onChange("previousAcademicYear", event.target.value)}
            className={inputClass}
          />
          {errors.previousAcademicYear ? <p className="mt-1 text-xs text-red-600">{errors.previousAcademicYear}</p> : null}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Transfer Certificate Date</label>
          <input
            aria-label="Transfer Certificate Date"
            type="date"
            value={values.previousTransferCertificateDate}
            onChange={(event) => onChange("previousTransferCertificateDate", event.target.value)}
            className={inputClass}
          />
          {errors.previousTransferCertificateDate ? (
            <p className="mt-1 text-xs text-red-600">{errors.previousTransferCertificateDate}</p>
          ) : null}
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Previous School Address</label>
          <textarea
            aria-label="Previous School Address"
            rows={3}
            value={values.previousSchoolAddress}
            onChange={(event) => onChange("previousSchoolAddress", event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Previous Registration Number</label>
          <input
            aria-label="Previous Registration Number"
            value={values.previousRegistrationNumber}
            onChange={(event) => onChange("previousRegistrationNumber", event.target.value)}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}
