import { Link } from "react-router-dom";
import { quickActions } from "../../data/dashboardDemoData";

export default function QuickActions() {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-slate-950">Quick Actions</h3>
        <p className="text-sm text-slate-500">Shortcuts route to planned modules for now.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            to={action.to}
            className="group rounded-md border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/40"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-700 group-hover:bg-blue-100 group-hover:text-blue-700">
              <action.icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h4 className="mt-4 text-sm font-semibold text-slate-950">{action.label}</h4>
            <p className="mt-1 text-sm leading-5 text-slate-500">{action.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
