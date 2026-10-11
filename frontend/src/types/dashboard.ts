import type { LucideIcon } from "lucide-react";

export type StatTone = "blue" | "green" | "amber" | "slate";

export type DashboardStat = {
  label: string;
  value: string;
  helper: string;
  tone: StatTone;
  icon: LucideIcon;
};

export type StudentsByClass = {
  className: string;
  students: number;
};

export type StudentsByGender = {
  gender: string;
  value: number;
  fill: string;
};

export type QuickAction = {
  label: string;
  description: string;
  to: string;
  icon: LucideIcon;
};
