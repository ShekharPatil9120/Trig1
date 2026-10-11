import {
  Award,
  BookOpenCheck,
  Building2,
  GraduationCap,
  Search,
  Send,
  UserPlus,
  Users,
} from "lucide-react";
import type {
  DashboardStat,
  QuickAction,
  StudentsByClass,
  StudentsByGender,
} from "../types/dashboard";

export const academicYear = "2026-27";

export const demoNotice =
  "Summary cards and charts are preview values. Recent Admissions is connected to PostgreSQL student records.";

export const dashboardStats: DashboardStat[] = [
  {
    label: "Total Active Students",
    value: "1,248",
    helper: "Demo count across all classes",
    tone: "blue",
    icon: Users,
  },
  {
    label: "New Admissions",
    value: "86",
    helper: "Demo admissions for this year",
    tone: "green",
    icon: UserPlus,
  },
  {
    label: "Transferred Students",
    value: "19",
    helper: "Demo transfer certificates issued",
    tone: "amber",
    icon: Send,
  },
  {
    label: "Classes and Sections",
    value: "42",
    helper: "Demo classes and active sections",
    tone: "slate",
    icon: BookOpenCheck,
  },
];

export const studentsByClass: StudentsByClass[] = [
  { className: "Class 1", students: 92 },
  { className: "Class 2", students: 104 },
  { className: "Class 3", students: 118 },
  { className: "Class 4", students: 126 },
  { className: "Class 5", students: 134 },
  { className: "Class 6", students: 151 },
  { className: "Class 7", students: 142 },
  { className: "Class 8", students: 138 },
];

export const studentsByGender: StudentsByGender[] = [
  { gender: "Girls", value: 612, fill: "#2563eb" },
  { gender: "Boys", value: 628, fill: "#0f766e" },
  { gender: "Not Specified", value: 8, fill: "#94a3b8" },
];

export const quickActions: QuickAction[] = [
  {
    label: "Register New Student",
    description: "Start a new admission record.",
    to: "/admissions/new",
    icon: GraduationCap,
  },
  {
    label: "Search Student",
    description: "Find an existing student profile.",
    to: "/search",
    icon: Search,
  },
  {
    label: "Generate Certificate",
    description: "Prepare certificate requests.",
    to: "/certificates",
    icon: Award,
  },
  {
    label: "Manage School Information",
    description: "Update school setup details.",
    to: "/school-setup",
    icon: Building2,
  },
];
