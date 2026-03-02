import { ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import StudentManagement from "./pages/admin/Students";
import FacultyManagement from "./pages/admin/Faculty";
import TutorAssignment from "./pages/admin/Tutors";
import AnnouncementManagement from "./pages/admin/Announcements";
import AuditLogs from "./pages/admin/AuditLogs";
import MarkAnalysis from "./pages/admin/MarkAnalysis";
import TransportManagement from "./pages/admin/TransportManagement";
import AdminODVerification from "./pages/admin/ODVerification";
import FacultyDashboard from "./pages/faculty/Dashboard";
import AttendanceMarking from "./pages/faculty/Attendance";
import TutorSection from "./pages/faculty/TutorSection";
import ClassNotes from "./pages/faculty/ClassNotes";
import StudentDashboard from "./pages/student/Dashboard";
import ODSubmission from "./pages/student/ODSubmission";
import ProgressCheck from "./pages/student/Progress";
import DocumentUpload from "./pages/student/DocumentUpload";
import HostelAttendance from "./pages/warden/HostelAttendance";
import BusAttendance from "./pages/driver/BusAttendance";
import BusManager from "./pages/manager/BusManager";
import Layout from "./components/Layout";

function ProtectedRoute({ children, role }: { children: ReactNode, role?: string }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) {
    if (user.role === "admin") return <Navigate to="/admin" />;
    if (user.role === "faculty") return <Navigate to="/faculty" />;
    if (user.role === "student") return <Navigate to="/student" />;
    if (user.role.startsWith("warden")) return <Navigate to="/warden" />;
    if (user.role === "bus_manager") return <Navigate to="/manager" />;
    if (user.role === "bus_driver") return <Navigate to="/driver" />;
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function RootRedirect() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role === "admin") return <Navigate to="/admin" />;
  if (user.role === "faculty") return <Navigate to="/faculty" />;
  if (user.role === "student") return <Navigate to="/student" />;
  if (user.role.startsWith("warden")) return <Navigate to="/warden" />;
  if (user.role === "bus_manager") return <Navigate to="/manager" />;
  if (user.role === "bus_driver") return <Navigate to="/driver" />;
  return <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/admin/*" element={
            <ProtectedRoute role="admin">
              <Layout>
                <Routes>
                  <Route path="/" element={<AdminDashboard />} />
                  <Route path="/students" element={<StudentManagement />} />
                  <Route path="/faculty" element={<FacultyManagement />} />
                  <Route path="/tutors" element={<TutorAssignment />} />
                  <Route path="/announcements" element={<AnnouncementManagement />} />
                  <Route path="/od-verification" element={<AdminODVerification />} />
                  <Route path="/analysis" element={<MarkAnalysis />} />
                  <Route path="/transport" element={<TransportManagement />} />
                  <Route path="/logs" element={<AuditLogs />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/faculty/*" element={
            <ProtectedRoute role="faculty">
              <Layout>
                <Routes>
                  <Route path="/" element={<FacultyDashboard />} />
                  <Route path="/attendance" element={<AttendanceMarking />} />
                  <Route path="/notes" element={<ClassNotes />} />
                  <Route path="/tutor" element={<TutorSection />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/student/*" element={
            <ProtectedRoute role="student">
              <Layout>
                <Routes>
                  <Route path="/" element={<StudentDashboard />} />
                  <Route path="/od" element={<ODSubmission />} />
                  <Route path="/documents" element={<DocumentUpload />} />
                  <Route path="/progress" element={<ProgressCheck />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/warden/*" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<HostelAttendance />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/driver/*" element={
            <ProtectedRoute role="bus_driver">
              <Layout>
                <Routes>
                  <Route path="/" element={<BusAttendance />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/manager/*" element={
            <ProtectedRoute role="bus_manager">
              <Layout>
                <Routes>
                  <Route path="/" element={<BusManager />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/" element={<RootRedirect />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
