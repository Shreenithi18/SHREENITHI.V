import { useEffect, useState } from "react";
import { Users, UserSquare2, ClipboardCheck, Megaphone, TrendingUp, Calendar } from "lucide-react";

interface Stats {
  totalStudents: number;
  totalFaculty: number;
  tutorsCount: number;
  activeAnnouncements: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div className="animate-pulse space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-neutral-200 rounded-2xl" />)}
    </div>
  </div>;

  const cards = [
    { title: "Total Students", value: stats?.totalStudents, icon: Users, color: "bg-blue-500" },
    { title: "Total Faculty", value: stats?.totalFaculty, icon: UserSquare2, color: "bg-emerald-500" },
    { title: "Tutors Count", value: stats?.tutorsCount, icon: ClipboardCheck, color: "bg-amber-500" },
    { title: "Active Announcements", value: stats?.activeAnnouncements, icon: Megaphone, color: "bg-indigo-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
        <p className="text-neutral-500">Overview of the college management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.title} className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex items-center gap-4">
            <div className={`${card.color} p-3 rounded-xl text-white`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">{card.title}</p>
              <p className="text-2xl font-bold text-neutral-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Recent Activity
            </h2>
            <button className="text-sm text-indigo-600 font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-neutral-50 rounded-xl transition-colors">
                <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-900">New student added to CSE A</p>
                  <p className="text-xs text-neutral-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Upcoming Events
            </h2>
            <button className="text-sm text-indigo-600 font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-neutral-50 rounded-xl transition-colors">
                <div className="bg-neutral-100 p-2 rounded-lg text-center min-w-[50px]">
                  <p className="text-xs font-bold text-neutral-900">15</p>
                  <p className="text-[10px] text-neutral-500 uppercase">Mar</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-900">Annual Tech Symposium</p>
                  <p className="text-xs text-neutral-500">Main Auditorium, 10:00 AM</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
