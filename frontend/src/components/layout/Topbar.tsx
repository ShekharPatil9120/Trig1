import { Bell, Search } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { academicYear } from "../../data/dashboardDemoData";
import { academicYearOptions } from "../../data/admissionOptions";
import { MobileMenuButton } from "./Sidebar";
import SchoolLogo, { schoolName } from "./SchoolLogo";

type TopbarProps = {
  onOpenMobile: () => void;
};

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/students": "Students",
  "/admissions/new": "New Admission",
  "/student-register": "Student Register",
  "/certificates": "Certificates",
  "/school-setup": "School Setup",
  "/settings": "Settings",
  "/search": "Search Student",
};

export default function Topbar({ onOpenMobile }: TopbarProps) {
  const location = useLocation();
  const pageTitle = titles[location.pathname] ?? "Dashboard";
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(academicYear);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6">
        <MobileMenuButton onOpenMobile={onOpenMobile} />

        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-slate-950">{pageTitle}</h2>
          <p className="truncate text-xs text-slate-500">Home / {pageTitle}</p>
        </div>

        <div className="ml-auto hidden min-w-72 max-w-md flex-1 items-center rounded-md border border-slate-200 bg-slate-50 px-3 lg:flex">
          <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search student by name or admission no."
            className="h-10 w-full border-0 bg-transparent px-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        <button
          type="button"
          className="hidden h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 sm:inline-flex"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
        </button>

        <label className="hidden items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 md:inline-flex">
          <span className="text-xs text-slate-500">AY</span>
          <select
            value={selectedAcademicYear}
            onChange={(event) => setSelectedAcademicYear(event.target.value)}
            className="h-10 border-0 bg-transparent text-sm font-semibold text-slate-700 outline-none"
            aria-label="Academic year"
          >
            {academicYearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>

        <div className="flex min-h-10 items-center gap-3 rounded-md border border-slate-200 bg-white px-2 py-1">
          <SchoolLogo className="h-8 w-8 border border-slate-200" />
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-semibold text-slate-900">{schoolName}</p>
            <p className="truncate text-xs text-slate-500">Office Desk</p>
          </div>
        </div>
      </div>
    </header>
  );
}
