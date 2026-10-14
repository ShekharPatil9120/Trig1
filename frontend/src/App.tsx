import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import CertificatesPage from "./pages/CertificatesPage";
import NewAdmissionPage from "./pages/NewAdmissionPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import StudentProfilePlaceholderPage from "./pages/StudentProfilePlaceholderPage";
import StudentsPage from "./pages/StudentsPage";

const placeholderRoutes = [
  { path: "school-setup", title: "School Setup", description: "School profile, classes, sections and academic-year setup will be added later." },
  { path: "settings", title: "Settings", description: "Application settings are not configured in this dashboard foundation." },
  { path: "search", title: "Search Student", description: "Search is shown in the interface for planning only and is not connected to real records yet." },
];

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="admissions/new" element={<NewAdmissionPage />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="certificates" element={<CertificatesPage />} />
        <Route path="student-register" element={<Navigate to="/students" replace />} />
        <Route path="students/:id" element={<StudentProfilePlaceholderPage />} />
        {placeholderRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<PlaceholderPage title={route.title} description={route.description} />}
          />
        ))}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
