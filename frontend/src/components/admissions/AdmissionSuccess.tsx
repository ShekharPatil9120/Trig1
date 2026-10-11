import { CheckCircle2, Home, RotateCcw } from "lucide-react";
import { Button } from "../ui/Button";
import type { AdmissionRegistrationResponse } from "../../services/admissionsApi";
import type { AdmissionFormState } from "../../types/admission";

type Props = {
  values: AdmissionFormState;
  registration: AdmissionRegistrationResponse;
  onStartNew: () => void;
  onDashboard: () => void;
};

export default function AdmissionSuccess({ values, registration, onStartNew, onDashboard }: Props) {
  return (
    <div className="rounded-md border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-1 rounded-full bg-emerald-600 p-2 text-white">
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">Saved admission</p>
            <h3 className="mt-1 text-xl font-semibold text-emerald-950">Admission successfully registered</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-900">
              The student record was saved to PostgreSQL and is available in the student register.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-md border border-emerald-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500">Admission number</p>
          <p className="mt-2 text-base font-semibold text-slate-900">{registration.admission_number}</p>
        </div>

        <div className="rounded-md border border-emerald-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500">Student ID</p>
          <p className="mt-2 text-base font-semibold text-slate-900">{registration.student_code}</p>
        </div>

        <div className="rounded-md border border-emerald-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500">Student</p>
          <p className="mt-2 text-base font-semibold text-slate-900">{values.fullName || "Pending"}</p>
        </div>

        <div className="rounded-md border border-emerald-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500">Admission type</p>
          <p className="mt-2 text-base font-semibold text-slate-900">{values.admissionType || "Pending"}</p>
        </div>

        <div className="rounded-md border border-emerald-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500">Class and year</p>
          <p className="mt-2 text-base font-semibold text-slate-900">
            {values.classAdmitted || "Pending"} {values.section ? `- ${values.section}` : ""} / {values.academicYear || "Pending"}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" icon={Home} onClick={onDashboard}>
          Go to Dashboard
        </Button>
        <Button icon={RotateCcw} onClick={onStartNew}>
          Start Another Admission
        </Button>
      </div>
    </div>
  );
}
