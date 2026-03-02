import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Calendar, Clock, ClipboardCheck, BookOpen, Bell } from "lucide-react";

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mocking some data for now
    setTimeout(() => {
      setStats({
        todayClasses: 4,
        nextClass: { subject: "Data Structures", time: "11:30 AM", section: "CSE B" },
        notifications: [
          { id: 1, text: "New OD request from John Doe", type: "od" },
          { id: 2, text: "Attendance for Hour 1 marked", type: "attendance" }
        ]
      });
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) return <div className="animate-pulse">Loading...</div>;

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Welcome, {user?.details?.name || user?.username}</h1>
        <p className="text-neutral-500">Faculty Dashboard</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Next Class Card */}
          <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-indigo-100 font-medium mb-2">Next Class Up</p>
              <h2 className="text-3xl font-bold mb-4">{stats.nextClass.subject}</h2>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-200" />
                  <span className="font-medium">{stats.nextClass.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-200" />
                  <span className="font-medium">{stats.nextClass.section}</span>
                </div>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4">
              <BookOpen className="w-64 h-64" />
            </div>
          </div>

          {/* Today's Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500">Classes Today</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.todayClasses}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm flex items-center gap-4">
              <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500">Attendance Marked</p>
                <p className="text-2xl font-bold text-neutral-900">2 / 4</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <h3 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            Notifications
          </h3>
          <div className="space-y-4">
            {stats.notifications.map((n: any) => (
              <div key={n.id} className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <p className="text-sm text-neutral-900">{n.text}</p>
                <p className="text-xs text-neutral-500 mt-1">Just now</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Users(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
