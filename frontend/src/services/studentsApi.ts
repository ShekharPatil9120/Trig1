import type { StudentFilters, StudentRegisterResponse } from "../types/student";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

type ListStudentsParams = {
  filters: StudentFilters;
  page: number;
  pageSize: number;
  sortBy?: "recent_admission";
  signal?: AbortSignal;
};

export async function listStudents({ filters, page, pageSize, sortBy, signal }: ListStudentsParams): Promise<StudentRegisterResponse> {
  const params = new URLSearchParams();
  const trimmedSearch = filters.search.trim();

  if (trimmedSearch) params.set("search", trimmedSearch);
  if (filters.academicYearId) params.set("academic_year_id", filters.academicYearId);
  if (filters.classId) params.set("class_id", filters.classId);
  if (filters.sectionId) params.set("section_id", filters.sectionId);
  if (filters.gender) params.set("gender", filters.gender);
  if (filters.status) params.set("status", filters.status);
  if (filters.admissionDateFrom) params.set("admission_date_from", filters.admissionDateFrom);
  if (filters.admissionDateTo) params.set("admission_date_to", filters.admissionDateTo);
  if (sortBy) params.set("sort_by", sortBy);
  params.set("page", String(page));
  params.set("page_size", String(pageSize));

  const response = await fetch(`${API_BASE_URL}/api/v1/students?${params.toString()}`, { signal });
  if (!response.ok) {
    const message = response.status === 422 ? "One or more student register filters are invalid." : "Student records could not be loaded.";
    throw new Error(message);
  }

  const data = (await response.json()) as StudentRegisterResponse;
  if (!Array.isArray(data.items) || typeof data.total !== "number") {
    throw new Error("The student register API returned an unexpected response.");
  }

  return data;
}
