import { Database, SearchX } from "lucide-react";

type StudentEmptyStateProps = {
  hasFilters: boolean;
};

export default function StudentEmptyState({ hasFilters }: StudentEmptyStateProps) {
  const Icon = hasFilters ? SearchX : Database;
  return (
    <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-slate-500">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-base font-semibold text-slate-950">
        {hasFilters ? "No matching student records" : "No student records found"}
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600">
        {hasFilters
          ? "Try a different search term or clear the filters to review the complete register."
          : "The register is connected to the backend API. Admissions completed in the current demo form are not saved to PostgreSQL yet."}
      </p>
    </div>
  );
}
