import type { AdmissionFormState, FormErrors } from "../../types/admission";

type Props = {
  values: AdmissionFormState;
  errors: FormErrors;
  onChange: (field: keyof AdmissionFormState, value: string) => void;
  onPhotoChange: (file: File | null) => void;
};

const inputClass =
  "mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function RequiredMark() {
  return <span className="ml-1 text-xs font-semibold text-red-600">Required</span>;
}

export default function StudentDetailsForm({ values, errors, onChange, onPhotoChange }: Props) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Section 2</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">Student Details</h3>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-700">
            Full Name
            <RequiredMark />
          </label>
          <input
            aria-label="Full Name"
            value={values.fullName}
            onChange={(event) => onChange("fullName", event.target.value)}
            className={inputClass}
          />
          {errors.fullName ? <p className="mt-1 text-xs text-red-600">{errors.fullName}</p> : null}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Name as per document</label>
          <input
            aria-label="Name as per document"
            value={values.nameAsPerDocument}
            onChange={(event) => onChange("nameAsPerDocument", event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Date of Birth
            <RequiredMark />
          </label>
          <input
            aria-label="Date of Birth"
            type="date"
            value={values.dateOfBirth}
            onChange={(event) => onChange("dateOfBirth", event.target.value)}
            className={inputClass}
          />
          {errors.dateOfBirth ? <p className="mt-1 text-xs text-red-600">{errors.dateOfBirth}</p> : null}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Gender
            <RequiredMark />
          </label>
          <select
            aria-label="Gender"
            value={values.gender}
            onChange={(event) => onChange("gender", event.target.value)}
            className={inputClass}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
          {errors.gender ? <p className="mt-1 text-xs text-red-600">{errors.gender}</p> : null}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Blood Group</label>
          <select
            aria-label="Blood Group"
            value={values.bloodGroup}
            onChange={(event) => onChange("bloodGroup", event.target.value)}
            className={inputClass}
          >
            <option value="">Select blood group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Nationality
            <RequiredMark />
          </label>
          <input
            aria-label="Nationality"
            value={values.nationality}
            onChange={(event) => onChange("nationality", event.target.value)}
            className={inputClass}
          />
          {errors.nationality ? <p className="mt-1 text-xs text-red-600">{errors.nationality}</p> : null}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Mother Tongue
            <RequiredMark />
          </label>
          <input
            aria-label="Mother Tongue"
            value={values.motherTongue}
            onChange={(event) => onChange("motherTongue", event.target.value)}
            className={inputClass}
          />
          {errors.motherTongue ? <p className="mt-1 text-xs text-red-600">{errors.motherTongue}</p> : null}
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-700">
            Residential Address
            <RequiredMark />
          </label>
          <textarea
            aria-label="Residential Address"
            rows={3}
            value={values.residentialAddress}
            onChange={(event) => onChange("residentialAddress", event.target.value)}
            className={inputClass}
          />
          {errors.residentialAddress ? <p className="mt-1 text-xs text-red-600">{errors.residentialAddress}</p> : null}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            City / Village
            <RequiredMark />
          </label>
          <input aria-label="City / Village" value={values.city} onChange={(event) => onChange("city", event.target.value)} className={inputClass} />
          {errors.city ? <p className="mt-1 text-xs text-red-600">{errors.city}</p> : null}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            State
            <RequiredMark />
          </label>
          <input aria-label="State" value={values.state} onChange={(event) => onChange("state", event.target.value)} className={inputClass} />
          {errors.state ? <p className="mt-1 text-xs text-red-600">{errors.state}</p> : null}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">PIN Code</label>
          <input
            aria-label="PIN Code"
            value={values.pinCode}
            onChange={(event) => onChange("pinCode", event.target.value)}
            className={inputClass}
            inputMode="numeric"
          />
          {errors.pinCode ? <p className="mt-1 text-xs text-red-600">{errors.pinCode}</p> : null}
        </div>

        <div className="md:col-span-2 rounded-md border border-dashed border-slate-300 bg-slate-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="text-sm font-medium text-slate-700">Student Photo</label>
            {values.photo ? (
              <button
                type="button"
                onClick={() => onPhotoChange(null)}
                className="inline-flex min-h-9 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 hover:border-red-200 hover:text-red-600"
              >
                Remove Photo
              </button>
            ) : null}
          </div>
          <input
            aria-label="Student Photo"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={(event) => onPhotoChange(event.target.files?.[0] ?? null)}
            className="mt-2 block w-full text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-blue-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
          />
          {values.photoPreview ? (
            <div className="mt-3 flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-2 sm:flex-row sm:items-center">
              <img src={values.photoPreview} alt="Student preview" className="h-28 w-28 rounded-md object-cover" />
              <div className="text-sm text-slate-600">
                <p className="font-semibold text-slate-900">{values.photo?.name}</p>
                <p className="mt-1 text-xs">Use the file input above to replace this image.</p>
              </div>
            </div>
          ) : null}
          {errors.photo ? <p className="mt-2 text-xs text-red-600">{errors.photo}</p> : null}
        </div>
      </div>
    </div>
  );
}
