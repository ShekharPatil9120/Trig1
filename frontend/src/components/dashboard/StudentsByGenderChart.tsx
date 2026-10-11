import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { studentsByGender } from "../../data/dashboardDemoData";

export default function StudentsByGenderChart() {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-slate-950">Students by Gender</h3>
        <p className="text-sm text-slate-500">Demo values for visual planning.</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={studentsByGender}
              dataKey="value"
              nameKey="gender"
              innerRadius="58%"
              outerRadius="78%"
              paddingAngle={3}
            >
              {studentsByGender.map((entry) => (
                <Cell key={entry.gender} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 6,
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 18px rgba(15, 23, 42, 0.08)",
              }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 13, color: "#475569" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
