import type { StudentStatus } from "../../types/student";

const statusStyles: Record<string, string> = {
  active: "border-emerald-200 bg-emerald-50 text-emerald-800",
  transferred: "border-amber-200 bg-amber-50 text-amber-800",
  left_school: "border-rose-200 bg-rose-50 text-rose-800",
  completed: "border-blue-200 bg-blue-50 text-blue-800",
  archived: "border-slate-200 bg-slate-100 text-slate-700",
};

export function formatStatus(status: StudentStatus | null | undefined) {
  if (!status) return "Active";
  return status
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default function StudentStatusBadge({ status }: { status: StudentStatus }) {
  const normalized = String(status || "active").toLowerCase();
  return (
    <span
      className={`inline-flex min-w-20 items-center justify-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
        statusStyles[normalized] ?? "border-slate-200 bg-white text-slate-700"
      }`}
    >
      {formatStatus(normalized)}
    </span>
  );
}
