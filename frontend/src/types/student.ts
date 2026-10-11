export type StudentStatus = "active" | "transferred" | "left_school" | "completed" | "archived" | string;

export type StudentRegisterItem = {
  id: number;
  admission_number: string | null;
  student_id: string | null;
  name: string;
  class_id: number | null;
  class_name: string | null;
  section_id: number | null;
  section_name: string | null;
  gender: string | null;
  date_of_birth: string | null;
  parent_guardian_name: string | null;
  parent_guardian_phone: string | null;
  admission_date: string | null;
  academic_year_id: number | null;
  academic_year_name: string | null;
  status: StudentStatus;
};

export type StudentRegisterOption = {
  id: number;
  name: string;
};

export type StudentRegisterOptions = {
  academic_years: StudentRegisterOption[];
  classes: StudentRegisterOption[];
  sections: StudentRegisterOption[];
  genders: string[];
  statuses: string[];
};

export type StudentFilters = {
  search: string;
  academicYearId: string;
  classId: string;
  sectionId: string;
  gender: string;
  status: string;
  admissionDateFrom: string;
  admissionDateTo: string;
};

export type StudentRegisterResponse = {
  items: StudentRegisterItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  options: StudentRegisterOptions;
};
