import {
  Award,
  BookUser,
  ChevronLeft,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Menu,
  School,
  Settings,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

type SidebarProps = {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  onOpenMobile: () => void;
};

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Students", to: "/students", icon: Users },
  { label: "New Admission", to: "/admissions/new", icon: UserPlus },
  { label: "Student Register", to: "/students", icon: BookUser },
  { label: "Certificates", to: "/certificates", icon: Award },
  { label: "School Setup", to: "/school-setup", icon: School },
  { label: "Settings", to: "/settings", icon: Settings },
];

export function MobileMenuButton({ onOpenMobile }: Pick<SidebarProps, "onOpenMobile">) {
  return (
    <button
      type="button"
      onClick={onOpenMobile}
      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
      aria-label="Open navigation"
    >
      <Menu className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}

export default function Sidebar({
  isCollapsed,
  isMobileOpen,
  onToggleCollapse,
  onCloseMobile,
}: SidebarProps) {
  const asideClasses = `fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:shadow-none ${
    isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
  } ${isCollapsed ? "lg:w-20" : "lg:w-72"}`;

  return (
    <>
      {isMobileOpen ? (
        <button
          type="button"
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden"
          onClick={onCloseMobile}
        />
      ) : null}

      <aside className={asideClasses}>
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-700 text-white">
            <GraduationCap className="h-6 w-6" aria-hidden="true" />
          </div>
          {!isCollapsed ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-950">Greenfield School</p>
              <p className="truncate text-xs text-slate-500">Student Records</p>
            </div>
          ) : null}
          <button
            type="button"
            onClick={onCloseMobile}
            className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-800"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                } ${isCollapsed ? "lg:justify-center" : ""}`
              }
            >
              <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {!isCollapsed ? <span className="truncate">{item.label}</span> : null}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-3">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden min-h-10 w-full items-center justify-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-600 hover:bg-slate-50 lg:flex"
          >
            <ChevronLeft className={`h-4 w-4 transition ${isCollapsed ? "rotate-180" : ""}`} aria-hidden="true" />
            {!isCollapsed ? <span>Collapse</span> : null}
          </button>
          {!isCollapsed ? (
            <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <ClipboardList className="h-4 w-4 text-blue-700" aria-hidden="true" />
                Task 1
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-500">Dashboard UI only. No backend data is connected.</p>
            </div>
          ) : null}
        </div>
      </aside>
    </>
  );
}
