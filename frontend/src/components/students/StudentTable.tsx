import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import type { StudentRegisterItem } from "../../types/student";
import StudentStatusBadge from "./StudentStatusBadge";

const placeholder = "-";

type StudentTableProps = {
  students: StudentRegisterItem[];
};

export default function StudentTable({ students }: StudentTableProps) {
  return (
    <div>
      <div className="overflow-x-auto">
      <table className="min-w-[1120px] divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Admission Number</th>
            <th className="px-4 py-3">Registration Number</th>
            <th className="px-4 py-3">Student Name</th>
            <th className="px-4 py-3">Student ID</th>
            <th className="px-4 py-3">Class</th>
            <th className="px-4 py-3">Section</th>
            <th className="px-4 py-3">Gender</th>
            <th className="px-4 py-3">Date of Birth</th>
            <th className="px-4 py-3">Parent/Guardian</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Admission Date</th>
            <th className="px-4 py-3">Academic Year</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-900">{show(student.admission_number)}</td>
              <td className="px-4 py-3 font-medium text-slate-900">{show(student.registration_number)}</td>
              <td className="px-4 py-3 font-semibold text-slate-950">{student.name}</td>
              <td className="px-4 py-3 text-slate-600">{show(student.student_id)}</td>
              <td className="px-4 py-3 text-slate-600">{show(student.class_name)}</td>
              <td className="px-4 py-3 text-slate-600">{show(student.section_name)}</td>
              <td className="px-4 py-3 text-slate-600">{show(student.gender)}</td>
              <td className="px-4 py-3 text-slate-600">{formatDate(student.date_of_birth)}</td>
              <td className="px-4 py-3 text-slate-600">{show(student.parent_guardian_name)}</td>
              <td className="px-4 py-3 text-slate-600">{show(student.parent_guardian_phone)}</td>
              <td className="px-4 py-3 text-slate-600">{formatDate(student.admission_date)}</td>
              <td className="px-4 py-3 text-slate-600">{show(student.academic_year_name)}</td>
              <td className="px-4 py-3">
                <StudentStatusBadge status={student.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                <Link
                  to={`/students/${student.id}`}
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  View
                </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

function show(value: string | null | undefined) {
  return value?.trim() ? value : placeholder;
}

function formatDate(value: string | null) {
  if (!value) return placeholder;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return placeholder;
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}
