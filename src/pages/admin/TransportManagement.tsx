import { useEffect, useState } from "react";
import { Bus, Home, Users, TrendingUp, ShieldCheck } from "lucide-react";

export default function TransportManagement() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/transport-stats")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Transport & Hostel Management</h1>
        <p className="text-neutral-500">Overview of student accommodation and transport services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Hostel Residents</p>
              <p className="text-2xl font-bold text-neutral-900">{stats?.hostelStudents || 0}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <span className="text-sm text-neutral-600">Boys Hostel</span>
              <span className="font-bold text-neutral-900">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <span className="text-sm text-neutral-600">Girls Hostel</span>
              <span className="font-bold text-neutral-900">Active</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Bus Commuters</p>
              <p className="text-2xl font-bold text-neutral-900">{stats?.busStudents || 0}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <span className="text-sm text-neutral-600">Total Routes</span>
              <span className="font-bold text-neutral-900">1</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <span className="text-sm text-neutral-600">Active Drivers</span>
              <span className="font-bold text-neutral-900">1</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-neutral-200 text-center">
        <ShieldCheck className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-neutral-900">Management Portal</h3>
        <p className="text-neutral-500 max-w-md mx-auto mt-2">
          Admins can monitor attendance logs and manage assignments for wardens and drivers from this central hub.
        </p>
      </div>
    </div>
  );
}
