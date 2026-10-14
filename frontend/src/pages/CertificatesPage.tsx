import { Download, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import { generateCertificate, listCertificateTypes } from "../services/certificatesApi";
import { listStudents } from "../services/studentsApi";
import type { StudentFilters, StudentRegisterItem } from "../types/student";

const emptyFilters: StudentFilters = {
  search: "",
  academicYearId: "",
  classId: "",
  sectionId: "",
  gender: "",
  status: "",
  admissionDateFrom: "",
  admissionDateTo: "",
};

export default function CertificatesPage() {
  const [certificateTypes, setCertificateTypes] = useState<{ id: string; name: string }[]>([]);
  const [certificateType, setCertificateType] = useState("");
  const [typesLoading, setTypesLoading] = useState(true);
  const [typesError, setTypesError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [students, setStudents] = useState<StudentRegisterItem[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentRegisterItem | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    listCertificateTypes()
      .then((types) => {
        if (!active) return;
        setCertificateTypes(types);
        setCertificateType(types[0]?.id ?? "");
      })
      .catch((error: Error) => active && setTypesError(error.message))
      .finally(() => active && setTypesLoading(false));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => window.clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch.length < 2) {
      setStudents([]);
      setStudentsError(null);
      setStudentsLoading(false);
      return;
    }

    const controller = new AbortController();
    setStudentsLoading(true);
    setStudentsError(null);
    listStudents({
      filters: { ...emptyFilters, search: debouncedSearch },
      page: 1,
      pageSize: 10,
      signal: controller.signal,
    })
      .then((response) => setStudents(response.items))
      .catch((error: Error) => {
        if (error.name !== "AbortError") setStudentsError(error.message || "Student records could not be searched.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setStudentsLoading(false);
      });
    return () => controller.abort();
  }, [debouncedSearch]);

  const chooseStudent = (student: StudentRegisterItem) => {
    setSelectedStudent(student);
    setSearch(`${student.name}${student.registration_number ? ` — ${student.registration_number}` : ""}`);
    setGenerationError(null);
  };

  const handleGenerate = async () => {
    if (!selectedStudent || !certificateType) return;
    setGenerating(true);
    setGenerationError(null);
    try {
      const { blob, filename } = await generateCertificate(certificateType, selectedStudent.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : "Certificate generation failed.");
    } finally {
      setGenerating(false);
    }
  };

  const suggestionsOpen = search.trim().length >= 2 && selectedStudent === null;

  return (
    <div className="mx-auto max-w-5xl">
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <nav className="mb-3 text-sm font-medium text-slate-500" aria-label="Breadcrumb">
          Home / <span className="text-slate-900">Certificates</span>
        </nav>
        <PageHeader title="Generate Certificate" description="Select a certificate type and student to generate a PDF from school records." />

        <div className="mt-7 grid gap-6">
          <div>
            <label htmlFor="certificate-type" className="mb-2 block text-sm font-semibold text-slate-800">Choose Certificate Type</label>
            {typesLoading ? <p className="text-sm text-slate-500">Loading certificate types...</p> : (
              <select
                id="certificate-type"
                value={certificateType}
                onChange={(event) => setCertificateType(event.target.value)}
                disabled={Boolean(typesError) || certificateTypes.length === 0}
                className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:max-w-xl"
              >
                {certificateTypes.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}
              </select>
            )}
            {typesError ? <p className="mt-2 text-sm text-red-700" role="alert">{typesError}</p> : null}
          </div>

          <div>
            <label htmlFor="certificate-student" className="mb-2 block text-sm font-semibold text-slate-800">Enter Student Name</label>
            <div className="relative sm:max-w-xl">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                id="certificate-student"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setSelectedStudent(null);
                  setGenerationError(null);
                }}
                autoComplete="off"
                placeholder="Search by student name or registration number"
                aria-expanded={suggestionsOpen}
                aria-controls="certificate-student-results"
                className="h-11 w-full rounded-md border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              {suggestionsOpen ? (
                <div id="certificate-student-results" role="listbox" aria-label="Matching students" className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                  {studentsLoading ? <p className="px-3 py-3 text-sm text-slate-500">Searching students...</p> : null}
                  {studentsError ? <p className="px-3 py-3 text-sm text-red-700" role="alert">{studentsError}</p> : null}
                  {!studentsLoading && !studentsError && students.length === 0 ? <p className="px-3 py-3 text-sm text-slate-500">No matching students found.</p> : null}
                  {students.map((student) => (
                    <button
                      type="button"
                      role="option"
                      aria-selected={false}
                      key={student.id}
                      onClick={() => chooseStudent(student)}
                      className="flex w-full flex-col items-start px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                    >
                      <span className="text-sm font-semibold text-slate-900">{student.name}</span>
                      <span className="text-xs text-slate-500">
                        {[student.registration_number, student.admission_number, student.class_name && `${student.class_name}${student.section_name ? ` / ${student.section_name}` : ""}`].filter(Boolean).join(" · ")}
                      </span>
                    </button>
                  ))}
                </div>
              ) : search.trim().length > 0 && search.trim().length < 2 ? (
                <p className="mt-2 text-xs text-slate-500">Enter at least 2 characters to search.</p>
              ) : null}
            </div>
          </div>

          {selectedStudent ? (
            <section className="rounded-md border border-blue-100 bg-blue-50/60 p-4 sm:max-w-xl" aria-label="Selected student">
              <h2 className="text-sm font-semibold text-slate-900">Selected Student</h2>
              <p className="mt-1 text-base font-semibold text-blue-900">{selectedStudent.name}</p>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <StudentDetail label="Registration Number" value={selectedStudent.registration_number} />
                <StudentDetail label="Admission Number" value={selectedStudent.admission_number} />
                <StudentDetail label="Class / Section" value={[selectedStudent.class_name, selectedStudent.section_name].filter(Boolean).join(" / ")} />
                <StudentDetail label="Academic Year" value={selectedStudent.academic_year_name} />
              </dl>
            </section>
          ) : null}

          {generationError ? <p role="alert" className="text-sm text-red-700">{generationError}</p> : null}
          <div>
            <Button
              type="button"
              icon={Download}
              onClick={() => void handleGenerate()}
              disabled={!selectedStudent || !certificateType || typesLoading || generating}
            >
              {generating ? "Generating Certificate..." : "Generate Certificate"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function StudentDetail({ label, value }: { label: string; value: string | null | undefined }) {
  return <div><dt className="text-xs text-slate-500">{label}</dt><dd className="font-medium text-slate-800">{value?.trim() || "—"}</dd></div>;
}
