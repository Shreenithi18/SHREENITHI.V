import { ReactNode, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  Megaphone, 
  Calendar, 
  FileText, 
  LogOut,
  Menu,
  X,
  GraduationCap,
  ClipboardCheck,
  BookOpen,
  History,
  ShieldCheck,
  TrendingUp,
  FileUp,
  Bus
} from "lucide-react";
import { cn } from "../lib/utils";

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const adminLinks = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin", hidden: false },
    { name: "Students", icon: Users, path: "/admin/students", hidden: false },
    { name: "Faculty", icon: UserSquare2, path: "/admin/faculty", hidden: false },
    { name: "Tutors", icon: ClipboardCheck, path: "/admin/tutors", hidden: false },
    { name: "OD Verification", icon: ShieldCheck, path: "/admin/od-verification", hidden: false },
    { name: "Mark Analysis", icon: TrendingUp, path: "/admin/analysis", hidden: false },
    { name: "Transport/Hostel", icon: Bus, path: "/admin/transport", hidden: false },
    { name: "Announcements", icon: Megaphone, path: "/admin/announcements", hidden: false },
    { name: "Audit Logs", icon: History, path: "/admin/logs", hidden: false },
  ];

  const facultyLinks = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/faculty", hidden: false },
    { name: "Attendance", icon: ClipboardCheck, path: "/faculty/attendance", hidden: false },
    { name: "Class Notes", icon: BookOpen, path: "/faculty/notes", hidden: false },
    { name: "Timetable", icon: Calendar, path: "/faculty/timetable", hidden: false },
    { name: "Tutor Section", icon: BookOpen, path: "/faculty/tutor", hidden: !user?.details?.is_tutor },
  ];

  const studentLinks = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/student", hidden: false },
    { name: "Documents", icon: FileUp, path: "/student/documents", hidden: false },
    { name: "Progress", icon: BookOpen, path: "/student/progress", hidden: false },
    { name: "OD Request", icon: FileText, path: "/student/od", hidden: false },
  ];

  const wardenLinks = [
    { name: "Attendance", icon: ClipboardCheck, path: "/warden", hidden: false },
    { name: "Residents", icon: Users, path: "/warden/residents", hidden: false },
  ];

  const driverLinks = [
    { name: "Bus Attendance", icon: Bus, path: "/driver", hidden: false },
  ];

  const managerLinks = [
    { name: "Bus Management", icon: Bus, path: "/manager", hidden: false },
  ];

  const getLinks = () => {
    if (user?.role === "admin") return adminLinks;
    if (user?.role === "faculty") return facultyLinks;
    if (user?.role === "student") return studentLinks;
    if (user?.role?.startsWith("warden")) return wardenLinks;
    if (user?.role === "bus_driver") return driverLinks;
    if (user?.role === "bus_manager") return managerLinks;
    return [];
  };

  const links = getLinks();

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r border-neutral-200 transition-all duration-300 flex flex-col",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="p-6 flex items-center gap-3 border-bottom border-neutral-100">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl text-neutral-900">EduManage</span>}
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {links.filter(l => !l.hidden).map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-colors",
                location.pathname === link.path 
                  ? "bg-indigo-50 text-indigo-600" 
                  : "text-neutral-600 hover:bg-neutral-100"
              )}
            >
              <link.icon className="w-5 h-5 shrink-0" />
              {isSidebarOpen && <span className="font-medium">{link.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-neutral-900">{user?.username}</p>
              <p className="text-xs text-neutral-500 capitalize">{user?.role}</p>
            </div>
            <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center font-bold text-neutral-600">
              {user?.username[0].toUpperCase()}
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
