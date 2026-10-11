import type { StudentFilters, StudentRegisterOptions } from "../../types/student";
import type { ReactNode } from "react";
import { formatStatus } from "./StudentStatusBadge";

type StudentFiltersProps = {
  filters: StudentFilters;
  options: StudentRegisterOptions;
  onChange: (filters: StudentFilters) => void;
};

const fallbackStatuses = ["active", "transferred", "left_school", "completed", "archived"];

export const emptyStudentFilters: StudentFilters = {
  search: "",
  academicYearId: "",
  classId: "",
  sectionId: "",
  gender: "",
  status: "",
  admissionDateFrom: "",
  admissionDateTo: "",
};

export function hasActiveStudentFilters(filters: StudentFilters) {
  return Object.values(filters).some(Boolean);
}

export default function StudentFilters({ filters, options, onChange }: StudentFiltersProps) {
  const update = (key: keyof StudentFilters, value: string) => {
    onChange({ ...filters, [key]: value });
  };
  const statuses = options.statuses.length ? options.statuses : fallbackStatuses;
  const genders = options.genders.length ? options.genders : ["Female", "Male", "Other"];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
      <Select label="Academic Year" value={filters.academicYearId} onChange={(value) => update("academicYearId", value)}>
        {options.academic_years.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </Select>
      <Select label="Class" value={filters.classId} onChange={(value) => update("classId", value)}>
        {options.classes.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </Select>
      <Select label="Section" value={filters.sectionId} onChange={(value) => update("sectionId", value)}>
        {options.sections.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </Select>
      <Select label="Gender" value={filters.gender} onChange={(value) => update("gender", value)}>
        {genders.map((gender) => (
          <option key={gender} value={gender}>
            {gender}
          </option>
        ))}
      </Select>
      <Select label="Status" value={filters.status} onChange={(value) => update("status", value)}>
        {statuses.map((status) => (
          <option key={status} value={status}>
            {formatStatus(status)}
          </option>
        ))}
      </Select>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Admission From</span>
        <input
          type="date"
          value={filters.admissionDateFrom}
          onChange={(event) => update("admissionDateFrom", event.target.value)}
          className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </label>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Admission To</span>
        <input
          type="date"
          value={filters.admissionDateTo}
          onChange={(event) => update("admissionDateTo", event.target.value)}
          className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </label>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <option value="">All</option>
        {children}
      </select>
    </label>
  );
}
