import { Search, X } from "lucide-react";

type StudentSearchProps = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
};

export default function StudentSearch({ value, onChange, onClear }: StudentSearchProps) {
  return (
    <label className="relative block min-w-0 flex-1">
      <span className="sr-only">Search students</span>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search student name, registration number or admission number"
        className="h-11 w-full rounded-md border border-slate-300 bg-white pl-10 pr-10 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
      {value ? (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}
    </label>
  );
}
