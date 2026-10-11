import { Eye, RefreshCw, RotateCcw, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listStudents } from "../../services/studentsApi";
import type { StudentRegisterItem, StudentRegisterResponse } from "../../types/student";
import { emptyStudentFilters, hasActiveStudentFilters } from "../students/StudentFilters";
import { formatStatus } from "../students/StudentStatusBadge";

const pageSize = 8;

const statusClasses: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  transferred: "bg-amber-50 text-amber-700 ring-amber-100",
  left_school: "bg-rose-50 text-rose-700 ring-rose-100",
  completed: "bg-blue-50 text-blue-700 ring-blue-100",
  archived: "bg-slate-100 text-slate-700 ring-slate-200",
};

export default function RecentAdmissionsTable() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [data, setData] = useState<StudentRegisterResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedQuery(query), 300);
    return () => window.clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    listStudents({
      filters: { ...emptyStudentFilters, search: debouncedQuery, status },
      page: 1,
      pageSize,
      sortBy: "recent_admission",
      signal: controller.signal,
    })
      .then(setData)
      .catch((caughtError: Error) => {
        if (caughtError.name !== "AbortError") {
          setData(null);
          setError(caughtError.message || "Recent admissions could not be loaded.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [debouncedQuery, status, reloadKey]);

  const admissions = data?.items ?? [];
  const hasFilters = useMemo(() => hasActiveStudentFilters({ ...emptyStudentFilters, search: query, status }), [query, status]);
  const statusOptions = data?.options.statuses ?? [];
  const emptyMessage = hasFilters ? "No admissions match your search or selected filter." : "No admissions found.";

  const clearFilters = () => {
    setQuery("");
    setDebouncedQuery("");
    setStatus("");
  };

  return (
    <section className="rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-950">Recent Admissions</h3>
          <p className="text-sm text-slate-500">Latest saved student admissions from PostgreSQL.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex min-h-10 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3">
            <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <span className="sr-only">Search admissions</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search admissions"
              className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:w-52"
            />
          </label>
          <label className="sr-only" htmlFor="status-filter">
            Filter admissions by status
          </label>
          <select
            id="status-filter"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="min-h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none"
          >
            <option value="">All statuses</option>
            {statusOptions.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {formatStatus(statusOption)}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasFilters}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Clear admission filters"
              title="Clear filters"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:text-blue-700"
              aria-label="Refresh admissions"
              title="Refresh admissions"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-sm text-slate-600">Loading admissions...</div>
      ) : error ? (
        <div className="flex min-h-48 flex-col items-center justify-center px-5 py-10 text-center">
          <h4 className="text-base font-semibold text-slate-950">Recent admissions unavailable</h4>
          <p className="mt-1 max-w-md text-sm text-slate-500">{error}</p>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Retry
          </button>
        </div>
      ) : admissions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-[780px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Admission Number</th>
                <th className="px-5 py-3 font-semibold">Student Name</th>
                <th className="px-5 py-3 font-semibold">Class</th>
                <th className="px-5 py-3 font-semibold">Admission Date</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {admissions.map((admission) => (
                <tr key={admission.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-medium text-slate-900">{formatValue(admission.admission_number)}</td>
                  <td className="px-5 py-4 text-slate-700">{admission.name}</td>
                  <td className="px-5 py-4 text-slate-700">{formatClassName(admission)}</td>
                  <td className="px-5 py-4 text-slate-700">{formatDate(admission.admission_date)}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusClasses[normalizeStatus(admission.status)] ?? "bg-white text-slate-700 ring-slate-200"}`}>
                      {formatStatus(admission.status)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      to={`/students/${admission.id}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:border-blue-200 hover:text-blue-700"
                      aria-label={`View ${admission.name}`}
                      title="View record"
                    >
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex min-h-48 flex-col items-center justify-center px-5 py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-slate-500">
            <Search className="h-6 w-6" aria-hidden="true" />
          </div>
          <h4 className="mt-4 text-base font-semibold text-slate-950">{emptyMessage}</h4>
        </div>
      )}
    </section>
  );
}

function normalizeStatus(status: string | null | undefined) {
  return String(status || "active").toLowerCase();
}

function formatValue(value: string | null | undefined) {
  return value?.trim() ? value : "-";
}

function formatClassName(admission: StudentRegisterItem) {
  return [admission.class_name, admission.section_name].filter(Boolean).join(" ") || "-";
}

function formatDate(value: string | null | undefined) {
  if (!value) return "-";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}
