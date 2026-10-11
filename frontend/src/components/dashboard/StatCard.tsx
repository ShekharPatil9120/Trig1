import type { DashboardStat, StatTone } from "../../types/dashboard";

type StatCardProps = {
  stat: DashboardStat;
};

const toneClasses: Record<StatTone, string> = {
  blue: "bg-blue-50 text-blue-700 ring-blue-100",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
};

export default function StatCard({ stat }: StatCardProps) {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-500">{stat.label}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{stat.value}</p>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ring-1 ${toneClasses[stat.tone]}`}>
          <stat.icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-500">{stat.helper}</p>
    </section>
  );
}
