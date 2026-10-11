import { RefreshCw, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import { Button } from "../components/ui/Button";
import StudentEmptyState from "../components/students/StudentEmptyState";
import StudentFilters, { emptyStudentFilters, hasActiveStudentFilters } from "../components/students/StudentFilters";
import StudentPagination from "../components/students/StudentPagination";
import StudentSearch from "../components/students/StudentSearch";
import StudentTable from "../components/students/StudentTable";
import { listStudents } from "../services/studentsApi";
import type { StudentFilters as StudentFiltersType, StudentRegisterResponse } from "../types/student";

const pageSize = 10;

const emptyOptions = {
  academic_years: [],
  classes: [],
  sections: [],
  genders: [],
  statuses: [],
};

export default function StudentsPage() {
  const [filters, setFilters] = useState<StudentFiltersType>(emptyStudentFilters);
  const [debouncedFilters, setDebouncedFilters] = useState<StudentFiltersType>(emptyStudentFilters);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<StudentRegisterResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedFilters(filters), 300);
    return () => window.clearTimeout(timeout);
  }, [filters]);

  useEffect(() => {
    setPage(1);
  }, [debouncedFilters]);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    listStudents({ filters: debouncedFilters, page, pageSize, signal: controller.signal })
      .then((response) => {
        setData(response);
        if (response.total_pages > 0 && page > response.total_pages) {
          setPage(response.total_pages);
        }
      })
      .catch((caughtError: Error) => {
        if (caughtError.name !== "AbortError") {
          setError(caughtError.message || "Student records could not be loaded.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [debouncedFilters, page, reloadKey]);

  const hasFilters = useMemo(() => hasActiveStudentFilters(filters), [filters]);
  const options = data?.options ?? emptyOptions;
  const total = data?.total ?? 0;
  const totalPages = data?.total_pages ?? 0;

  const updateFilters = (nextFilters: StudentFiltersType) => setFilters(nextFilters);
  const clearFilters = () => setFilters(emptyStudentFilters);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <nav className="mb-3 text-sm font-medium text-slate-500" aria-label="Breadcrumb">
              Home / Students / <span className="text-slate-900">Student Register</span>
            </nav>
            <PageHeader title="Student Database" description="Search, manage and review student registration records." />
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
            <p className="text-slate-500">Total Records</p>
            <p className="mt-1 text-2xl font-semibold text-slate-950">{total}</p>
          </div>
        </div>
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <StudentSearch
            value={filters.search}
            onChange={(value) => updateFilters({ ...filters, search: value })}
            onClear={() => updateFilters({ ...filters, search: "" })}
          />
          <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">
            <Button type="button" icon={RotateCcw} variant="secondary" onClick={clearFilters} disabled={!hasFilters}>
              Clear Filters
            </Button>
            <Button type="button" icon={RefreshCw} variant="secondary" onClick={() => setReloadKey((key) => key + 1)}>
              Refresh
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <StudentFilters filters={filters} options={options} onChange={updateFilters} />
        </div>
      </section>

      <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-slate-600">Loading student records...</div>
        ) : error ? (
          <div className="p-8 text-center">
            <h2 className="text-base font-semibold text-slate-950">Student register unavailable</h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600">{error}</p>
            <Button type="button" className="mt-4" icon={RefreshCw} onClick={() => setReloadKey((key) => key + 1)}>
              Retry
            </Button>
          </div>
        ) : data && data.items.length ? (
          <>
            <StudentTable students={data.items} />
            <StudentPagination
              page={data.page}
              pageSize={data.page_size}
              total={data.total}
              totalPages={totalPages}
              onPageChange={(nextPage) => setPage(Math.min(Math.max(nextPage, 1), Math.max(totalPages, 1)))}
            />
          </>
        ) : (
          <div className="p-4">
            <StudentEmptyState hasFilters={hasFilters} />
          </div>
        )}
      </section>
    </div>
  );
}
