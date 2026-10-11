import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";

function renderApp(initialPath = "/dashboard") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>,
  );
}

async function openReview(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getAllByRole("button", { name: /review admission/i })[0]);
}

async function confirmReview(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: /confirm admission/i }));
}

async function fillAdmissionDetails(user: ReturnType<typeof userEvent.setup>, admissionType = "New Admission") {
  await user.type(screen.getByLabelText(/admission date/i), "2026-10-11");
  await user.selectOptions(screen.getByLabelText(/class admitted/i), "Class 1");
  await user.selectOptions(screen.getByLabelText(/^section$/i), "A");
  await user.selectOptions(screen.getByLabelText(/admission type/i), admissionType);
}

async function fillStudentDetails(user: ReturnType<typeof userEvent.setup>, name = "Ananya Rao") {
  await user.click(screen.getByRole("button", { name: /student details/i }));
  await user.type(screen.getByLabelText(/^full name$/i), name);
  await user.type(screen.getByLabelText(/date of birth/i), "2018-04-12");
  await user.selectOptions(screen.getByLabelText(/gender/i), "Female");
  await user.type(screen.getByLabelText(/mother tongue/i), "Kannada");
  await user.type(screen.getByLabelText(/residential address/i), "24 Lake Road");
  await user.type(screen.getByLabelText(/city/i), "Bengaluru");
  await user.type(screen.getByLabelText(/^state$/i), "Karnataka");
}

async function fillMinimumAdmission(user: ReturnType<typeof userEvent.setup>, admissionType = "New Admission") {
  await fillAdmissionDetails(user, admissionType);
  await fillStudentDetails(user);
}

function studentResponse(overrides = {}) {
  return {
    items: [
      {
        id: 1,
        admission_number: "ADM-001",
        student_id: "STU-001",
        name: "Ananya Rao",
        class_id: 1,
        class_name: "Class 1",
        section_id: 1,
        section_name: "A",
        gender: "Female",
        date_of_birth: "2018-04-12",
        parent_guardian_name: "Meera Rao",
        parent_guardian_phone: "9876543210",
        admission_date: "2026-10-11",
        academic_year_id: 1,
        academic_year_name: "2026-27",
        status: "active",
      },
      {
        id: 2,
        admission_number: "ADM-002",
        student_id: "STU-002",
        name: "Kabir Nair",
        class_id: 2,
        class_name: "Class 2",
        section_id: 2,
        section_name: "B",
        gender: "Male",
        date_of_birth: "2017-03-02",
        parent_guardian_name: "Dev Nair",
        parent_guardian_phone: "9876500000",
        admission_date: "2026-10-12",
        academic_year_id: 1,
        academic_year_name: "2026-27",
        status: "transferred",
      },
    ],
    total: 2,
    page: 1,
    page_size: 10,
    total_pages: 1,
    options: {
      academic_years: [{ id: 1, name: "2026-27" }],
      classes: [
        { id: 1, name: "Class 1" },
        { id: 2, name: "Class 2" },
      ],
      sections: [
        { id: 1, name: "A" },
        { id: 2, name: "B" },
      ],
      genders: ["Female", "Male"],
      statuses: ["active", "transferred"],
    },
    ...overrides,
  };
}

function mockStudentFetch(response = studentResponse()) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => response,
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function mockAdmissionCreate(response = {}) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    status: 201,
    json: async () => ({
      student_id: 10,
      student_code: "STU-2026-0010",
      admission_id: 20,
      admission_number: "ADM/2026/0010",
      student_name: "Ananya Rao",
      academic_year: "2026-27",
      class_name: "Class 1",
      section_name: "A",
      ...response,
    }),
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("dashboard", () => {
  it("renders dashboard cards, charts, demo notice, and navigation", async () => {
    const user = userEvent.setup();
    mockStudentFetch();
    renderApp();

    expect(screen.getByRole("heading", { name: /school overview/i })).toBeInTheDocument();
    expect(screen.getByText(/demo data notice/i)).toBeInTheDocument();
    expect(screen.getByText(/total active students/i)).toBeInTheDocument();
    expect(screen.getByText(/students by class/i)).toBeInTheDocument();
    expect(screen.getByText(/students by gender/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /recent admissions/i })).toBeInTheDocument();
    expect(await screen.findByText("Ananya Rao")).toBeInTheDocument();
    expect(screen.queryByText("Aarav Mehta")).not.toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: /register new student/i }));
    expect(await screen.findAllByRole("heading", { name: /new admission/i })).not.toHaveLength(0);
  });

  it("redirects unknown routes to the dashboard instead of rendering a blank page", () => {
    mockStudentFetch();
    renderApp("/not-a-real-module");

    expect(screen.getByRole("heading", { name: /school overview/i })).toBeInTheDocument();
  });

  it("filters recent admissions through the real student API", async () => {
    const user = userEvent.setup();
    const fetchMock = mockStudentFetch();
    renderApp();

    expect(await screen.findByText("Ananya Rao")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenLastCalledWith(expect.stringContaining("sort_by=recent_admission"), expect.any(Object));

    await user.type(screen.getByLabelText(/search admissions/i), " Kabir ");
    await waitFor(() => expect(fetchMock).toHaveBeenLastCalledWith(expect.stringContaining("search=Kabir"), expect.any(Object)));

    await user.selectOptions(screen.getByLabelText(/filter admissions by status/i), "transferred");
    await waitFor(() => expect(fetchMock).toHaveBeenLastCalledWith(expect.stringContaining("status=transferred"), expect.any(Object)));

    await user.click(screen.getByRole("button", { name: /clear admission filters/i }));
    await waitFor(() => {
      const lastUrl = String(fetchMock.mock.calls.at(-1)?.[0]);
      expect(lastUrl).not.toContain("search=");
      expect(lastUrl).not.toContain("status=");
      expect(lastUrl).toContain("sort_by=recent_admission");
    });
  });

  it("shows empty and error states without falling back to demo admissions", async () => {
    mockStudentFetch(studentResponse({ items: [], total: 0, total_pages: 0 }));
    renderApp();
    expect(await screen.findByText(/no admissions found/i)).toBeInTheDocument();
    expect(screen.queryByText("Aarav Mehta")).not.toBeInTheDocument();

    cleanup();
    vi.unstubAllGlobals();
    mockStudentFetch(studentResponse({ items: [], total: 0, total_pages: 0 }));
    const user = userEvent.setup();
    renderApp();
    await user.type(screen.getByLabelText(/search admissions/i), "missing");
    expect(await screen.findByText(/no admissions match your search or selected filter/i)).toBeInTheDocument();
    expect(screen.queryByText("Aarav Mehta")).not.toBeInTheDocument();

    cleanup();
    vi.unstubAllGlobals();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) }));
    renderApp();
    expect(await screen.findByText(/recent admissions unavailable/i)).toBeInTheDocument();
    expect(screen.queryByText("Aarav Mehta")).not.toBeInTheDocument();
  });
});

describe("student register", () => {
  it("renders records returned by the backend API", async () => {
    mockStudentFetch();
    renderApp("/students");

    expect(await screen.findByRole("heading", { name: /student database/i })).toBeInTheDocument();
    expect(screen.getByText("ADM-001")).toBeInTheDocument();
    expect(screen.getByText("Ananya Rao")).toBeInTheDocument();
    expect(screen.getByText("Meera Rao")).toBeInTheDocument();
    expect(screen.getByText("9876543210")).toBeInTheDocument();
    expect(screen.getByText(/page 1 of 1/i)).toBeInTheDocument();
  });

  it("sends search and filter values to the backend and clears them", async () => {
    const user = userEvent.setup();
    const fetchMock = mockStudentFetch();
    renderApp("/students");

    await screen.findByText("Ananya Rao");
    await user.type(screen.getByLabelText(/search students/i), " Kabir ");
    await waitFor(() => expect(fetchMock).toHaveBeenLastCalledWith(expect.stringContaining("search=Kabir"), expect.any(Object)));

    await user.selectOptions(screen.getByLabelText(/class/i), "2");
    await waitFor(() => expect(fetchMock).toHaveBeenLastCalledWith(expect.stringContaining("class_id=2"), expect.any(Object)));

    await user.selectOptions(screen.getByLabelText(/status/i), "transferred");
    await waitFor(() => expect(fetchMock).toHaveBeenLastCalledWith(expect.stringContaining("status=transferred"), expect.any(Object)));

    await user.click(screen.getByRole("button", { name: /clear filters/i }));
    await waitFor(() => {
      const lastUrl = String(fetchMock.mock.calls.at(-1)?.[0]);
      expect(lastUrl).not.toContain("search=");
      expect(lastUrl).not.toContain("class_id=");
      expect(lastUrl).not.toContain("status=");
    });
  });

  it("handles pagination, empty results, backend errors, and row navigation", async () => {
    const user = userEvent.setup();
    const fetchMock = mockStudentFetch(studentResponse({ total: 12, total_pages: 2 }));
    renderApp("/students");

    await screen.findByText("Ananya Rao");
    await user.click(screen.getByRole("button", { name: /next/i }));
    await waitFor(() => expect(fetchMock).toHaveBeenLastCalledWith(expect.stringContaining("page=2"), expect.any(Object)));

    await user.click(screen.getAllByRole("link", { name: /view/i })[0]);
    expect(await screen.findByRole("heading", { name: /student profile coming next/i })).toBeInTheDocument();

    vi.unstubAllGlobals();
    mockStudentFetch(studentResponse({ items: [], total: 0, total_pages: 0 }));
    renderApp("/students");
    expect(await screen.findByText(/no student records found/i)).toBeInTheDocument();

    vi.unstubAllGlobals();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) }));
    renderApp("/students");
    expect(await screen.findByText(/student register unavailable/i)).toBeInTheDocument();
  });
});

describe("new admission", () => {
  it("validates required admission fields before saving", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    renderApp("/admissions/new");

    await openReview(user);
    await confirmReview(user);

    expect(screen.getByText(/admission date is required/i)).toBeInTheDocument();
    expect(screen.getByText(/class admitted is required/i)).toBeInTheDocument();
    expect(screen.getByText(/section is required/i)).toBeInTheDocument();
    expect(screen.getByText(/admission type is required/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects future date of birth and preserves entered data", async () => {
    const user = userEvent.setup();
    renderApp("/admissions/new");

    await fillAdmissionDetails(user);
    await user.click(screen.getByRole("button", { name: /student details/i }));
    await user.type(screen.getByLabelText(/^full name$/i), "Future Student");
    await user.type(screen.getByLabelText(/date of birth/i), "2999-01-01");
    await user.selectOptions(screen.getByLabelText(/gender/i), "Other");
    await user.type(screen.getByLabelText(/mother tongue/i), "Hindi");
    await user.type(screen.getByLabelText(/residential address/i), "Test Street");
    await user.type(screen.getByLabelText(/city/i), "Delhi");
    await user.type(screen.getByLabelText(/^state$/i), "Delhi");

    await openReview(user);
    await confirmReview(user);

    expect(screen.getByText(/date of birth cannot be in the future/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^full name$/i)).toHaveValue("Future Student");
  });

  it("applies transfer-only validation without requiring transfer fields for new admissions", async () => {
    const user = userEvent.setup();
    renderApp("/admissions/new");

    await fillMinimumAdmission(user, "Transfer Admission");
    await openReview(user);
    await confirmReview(user);

    expect(screen.getByText(/previous school name is required/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /admission details/i }));
    await user.selectOptions(screen.getByLabelText(/admission type/i), "New Admission");
    const fetchMock = mockAdmissionCreate();
    await openReview(user);
    await confirmReview(user);

    expect(await screen.findByText(/admission successfully registered/i)).toBeInTheDocument();
    expect(screen.getByText("ADM/2026/0010")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/api/v1/admissions"), expect.objectContaining({ method: "POST" }));
  });

  it("shows invalid phone, email, PIN, and document file errors without clearing form data", async () => {
    const user = userEvent.setup();
    renderApp("/admissions/new");

    await fillMinimumAdmission(user);
    await user.type(screen.getByLabelText(/pin code/i), "123");
    await user.click(screen.getByRole("button", { name: /parent \/ guardian/i }));
    await user.type(screen.getByLabelText(/parent \/ guardian phone/i), "12345678901");
    await user.type(screen.getByLabelText(/^email$/i), "bad-email");
    await user.click(screen.getByRole("button", { name: /documents/i }));
    fireEvent.change(screen.getByLabelText(/birth certificate file/i), {
      target: { files: [new File(["bad"], "script.exe", { type: "application/x-msdownload" })] },
    });

    await openReview(user);
    await confirmReview(user);

    await user.click(screen.getByRole("button", { name: /documents/i }));
    expect(screen.getByText(/unsupported file type/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /student details/i }));
    expect(screen.getByLabelText(/^full name$/i)).toHaveValue("Ananya Rao");
    expect(screen.getByText(/pin code must be a valid 6-digit/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /parent \/ guardian/i }));
    expect(screen.getByText(/must be a valid 10-digit number/i)).toBeInTheDocument();
    expect(screen.getByText(/email address must be valid/i)).toBeInTheDocument();
  });

  it("updates review data after editing a section", async () => {
    const user = userEvent.setup();
    renderApp("/admissions/new");

    await fillMinimumAdmission(user, "New Admission");
    await openReview(user);

    expect(screen.getByText("Ananya Rao")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /edit student details/i }));
    await user.clear(screen.getByLabelText(/^full name$/i));
    await user.type(screen.getByLabelText(/^full name$/i), "Kabir Nair");
    await openReview(user);

    expect(screen.getByText("Kabir Nair")).toBeInTheDocument();
    expect(screen.queryByText("Ananya Rao")).not.toBeInTheDocument();
  });

  it("saves admission only after a successful backend response", async () => {
    const user = userEvent.setup();
    const fetchMock = mockAdmissionCreate({ student_name: "Ananya Rao" });
    renderApp("/admissions/new");

    await fillMinimumAdmission(user);
    await openReview(user);
    await confirmReview(user);

    expect(await screen.findByText(/admission successfully registered/i)).toBeInTheDocument();
    expect(screen.getByText(/student id/i)).toBeInTheDocument();
    expect(screen.getByText("STU-2026-0010")).toBeInTheDocument();
    expect(screen.getByText(/student is now searchable in the student register/i)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [, request] = fetchMock.mock.calls[0];
    expect(JSON.parse(String(request?.body))).toMatchObject({
      admission_date: "2026-10-11",
      academic_year: "2026-27",
      class_admitted: "Class 1",
      section: "A",
      admission_type: "New Admission",
      student_name: "Ananya Rao",
      date_of_birth: "2018-04-12",
      gender: "Female",
    });
  });

  it("does not show success when backend registration fails", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({}),
      }),
    );
    renderApp("/admissions/new");

    await fillMinimumAdmission(user);
    await openReview(user);
    await confirmReview(user);

    expect(screen.queryByText(/admission successfully registered/i)).not.toBeInTheDocument();
    expect(await screen.findByText(/admission could not be saved/i)).toBeInTheDocument();
  });

  it("allows photo and document replacement and removal", async () => {
    const user = userEvent.setup();
    renderApp("/admissions/new");

    await user.click(screen.getByRole("button", { name: /student details/i }));
    const photoInput = screen.getByLabelText(/student photo/i);
    await user.upload(photoInput, new File(["photo"], "student.png", { type: "image/png" }));
    expect(screen.getByText("student.png")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /remove photo/i }));
    expect(screen.queryByText("student.png")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /documents/i }));
    const birthCertificateInput = screen.getByLabelText(/birth certificate file/i);
    await user.upload(birthCertificateInput, new File(["doc"], "birth.pdf", { type: "application/pdf" }));
    expect(screen.getByText("birth.pdf")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /remove/i }));
    expect(screen.queryByText("birth.pdf")).not.toBeInTheDocument();
  });
});
