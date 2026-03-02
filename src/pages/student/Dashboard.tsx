import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { PieChart, Megaphone, Cake, TrendingUp, Calendar, FileText } from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/student/dashboard/${user?.related_id}`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setIsLoading(false);
      });
  }, [user]);

  if (isLoading) return <div className="animate-pulse">Loading...</div>;

  if (!data || !data.student) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-neutral-200">
        <h2 className="text-xl font-bold text-neutral-900">Student Profile Not Found</h2>
        <p className="text-neutral-500 mt-2">Your user account is not linked to a student record. Please contact the administrator.</p>
      </div>
    );
  }

  const isBirthday = data.student.dob && new Date(data.student.dob).getMonth() === new Date().getMonth() && new Date(data.student.dob).getDate() === new Date().getDate();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Hello, {data.student.name}</h1>
          <p className="text-neutral-500">Roll No: {data.student.roll_no} | Year: {data.student.year}</p>
        </div>
        {isBirthday && (
          <div className="bg-pink-100 text-pink-600 px-4 py-2 rounded-full flex items-center gap-2 font-bold animate-bounce">
            <Cake className="w-5 h-5" />
            Happy Birthday! 🎂
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Attendance</p>
                <PieChart className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex items-end gap-2">
                <p className="text-4xl font-bold text-neutral-900">{data.attendancePercentage}%</p>
                <p className={`text-sm font-medium mb-1 ${parseFloat(data.attendancePercentage) >= 75 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {parseFloat(data.attendancePercentage) >= 75 ? 'On Track' : 'Low Attendance'}
                </p>
              </div>
              <div className="mt-4 h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${parseFloat(data.attendancePercentage) >= 75 ? 'bg-emerald-500' : 'bg-red-500'}`}
                  style={{ width: `${data.attendancePercentage}%` }}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Current CGPA</p>
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex items-end gap-2">
                <p className="text-4xl font-bold text-neutral-900">{data.student.cgpa || "0.00"}</p>
                <p className="text-sm text-neutral-500 mb-1">/ 10.0</p>
              </div>
              <p className="mt-4 text-xs text-neutral-500 italic">Last updated: 2 days ago</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
            <h3 className="text-lg font-bold text-neutral-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-indigo-50 transition-colors group">
                <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-neutral-600">Upload OD</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-indigo-50 transition-colors group">
                <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Calendar className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-neutral-600">View Timetable</span>
              </button>
              {/* Add more actions */}
            </div>
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <h3 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-indigo-600" />
            Latest Announcements
          </h3>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-4 bg-neutral-50 rounded-xl border-l-4 border-indigo-600">
                <p className="text-sm font-bold text-neutral-900">Semester Exam Schedule Out</p>
                <p className="text-xs text-neutral-600 mt-1 line-clamp-2">The schedule for the upcoming semester examinations has been published on the official portal...</p>
                <p className="text-[10px] text-neutral-400 mt-2">Posted 1 day ago</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
