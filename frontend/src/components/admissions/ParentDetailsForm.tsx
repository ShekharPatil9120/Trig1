import type { AdmissionFormState, FormErrors } from "../../types/admission";

type Props = {
  values: AdmissionFormState;
  errors: FormErrors;
  onChange: (field: keyof AdmissionFormState, value: string) => void;
};

const inputClass =
  "mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export default function ParentDetailsForm({ values, errors, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Section 3</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">Parent / Guardian Details</h3>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Father Name</label>
          <input aria-label="Father Name" value={values.fatherName} onChange={(event) => onChange("fatherName", event.target.value)} className={inputClass} />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Father Occupation</label>
          <input
            aria-label="Father Occupation"
            value={values.fatherOccupation}
            onChange={(event) => onChange("fatherOccupation", event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Mother Name</label>
          <input aria-label="Mother Name" value={values.motherName} onChange={(event) => onChange("motherName", event.target.value)} className={inputClass} />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Mother Occupation</label>
          <input
            aria-label="Mother Occupation"
            value={values.motherOccupation}
            onChange={(event) => onChange("motherOccupation", event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Guardian Name</label>
          <input
            aria-label="Guardian Name"
            value={values.guardianName}
            onChange={(event) => onChange("guardianName", event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Parent / Guardian Phone</label>
          <input
            aria-label="Parent / Guardian Phone"
            value={values.parentPhone}
            onChange={(event) => onChange("parentPhone", event.target.value)}
            className={inputClass}
            inputMode="numeric"
          />
          {errors.parentPhone ? <p className="mt-1 text-xs text-red-600">{errors.parentPhone}</p> : null}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Alternate Phone</label>
          <input
            aria-label="Alternate Phone"
            value={values.alternatePhone}
            onChange={(event) => onChange("alternatePhone", event.target.value)}
            className={inputClass}
            inputMode="numeric"
          />
          {errors.alternatePhone ? <p className="mt-1 text-xs text-red-600">{errors.alternatePhone}</p> : null}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input aria-label="Email" type="email" value={values.email} onChange={(event) => onChange("email", event.target.value)} className={inputClass} />
          {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email}</p> : null}
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Parent / Guardian Address</label>
          <textarea
            aria-label="Parent / Guardian Address"
            rows={3}
            value={values.parentAddress}
            onChange={(event) => onChange("parentAddress", event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Emergency Contact Name</label>
          <input
            aria-label="Emergency Contact Name"
            value={values.emergencyContactName}
            onChange={(event) => onChange("emergencyContactName", event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Emergency Contact Phone</label>
          <input
            aria-label="Emergency Contact Phone"
            value={values.emergencyContactPhone}
            onChange={(event) => onChange("emergencyContactPhone", event.target.value)}
            className={inputClass}
            inputMode="numeric"
          />
          {errors.emergencyContactPhone ? <p className="mt-1 text-xs text-red-600">{errors.emergencyContactPhone}</p> : null}
        </div>
      </div>
    </div>
  );
}
