import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { studentsByClass } from "../../data/dashboardDemoData";

export default function StudentsByClassChart() {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-slate-950">Students by Class</h3>
        <p className="text-sm text-slate-500">Demo distribution for dashboard preview.</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={studentsByClass} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="className" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: "#eff6ff" }}
              contentStyle={{
                borderRadius: 6,
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 18px rgba(15, 23, 42, 0.08)",
              }}
            />
            <Bar dataKey="students" name="Students" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
