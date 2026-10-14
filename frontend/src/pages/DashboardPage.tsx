import { AlertCircle, BookOpen, Database, UserPlus } from "lucide-react";
import QuickActions from "../components/dashboard/QuickActions";
import RecentAdmissionsTable from "../components/dashboard/RecentAdmissionsTable";
import StatCard from "../components/dashboard/StatCard";
import StudentsByClassChart from "../components/dashboard/StudentsByClassChart";
import StudentsByGenderChart from "../components/dashboard/StudentsByGenderChart";
import { ButtonLink } from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import SchoolLogo, { schoolName } from "../components/layout/SchoolLogo";
import { academicYear, dashboardStats, demoNotice } from "../data/dashboardDemoData";

export default function DashboardPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <SchoolLogo className="h-14 w-14 border border-slate-200 sm:h-16 sm:w-16" />
            <div className="min-w-0">
              <p className="mb-1 text-sm font-semibold text-blue-800">{schoolName}</p>
              <PageHeader
                eyebrow={`Academic Year ${academicYear}`}
                title="School Overview"
                description="Manage student records, admissions and school certificates from one place."
              />
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
            <ButtonLink to="/admissions/new" icon={UserPlus}>
              New Admission
            </ButtonLink>
            <ButtonLink to="/students" icon={BookOpen} variant="secondary">
              View Student Register
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="rounded-md border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
        <div className="flex gap-3">
          <Database className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" aria-hidden="true" />
          <div>
            <p className="font-semibold">Demo data notice</p>
            <p className="mt-1 leading-6">{demoNotice}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <StudentsByClassChart />
        <StudentsByGenderChart />
      </section>

      <RecentAdmissionsTable />

      <QuickActions />

      <section className="rounded-md border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-slate-500">
          <AlertCircle className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-950">Empty state preview</h3>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          When real student records are unavailable, this area can show guidance for importing data or starting a new admission.
        </p>
      </section>
    </div>
  );
}
