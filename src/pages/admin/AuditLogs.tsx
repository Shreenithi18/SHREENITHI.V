import { useEffect, useState } from "react";
import { History, User, Activity, Clock } from "lucide-react";

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mocking logs for now
    setTimeout(() => {
      setLogs([
        { id: 1, user: "Admin", action: "Added new faculty: Dr. Smith", timestamp: "2024-03-15 10:30 AM" },
        { id: 2, user: "Faculty (F001)", action: "Marked attendance for CSE A - Hour 1", timestamp: "2024-03-15 09:15 AM" },
        { id: 3, user: "Admin", action: "Approved OD request for John Doe", timestamp: "2024-03-14 04:45 PM" },
        { id: 4, user: "Tutor (F002)", action: "Verified OD request for Jane Doe", timestamp: "2024-03-14 02:30 PM" },
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Audit Logs</h1>
        <p className="text-neutral-500">Track all administrative and faculty actions</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-neutral-100">
          {isLoading ? (
            [1, 2, 3].map(i => <div key={i} className="h-20 animate-pulse bg-neutral-50/50" />)
          ) : logs.map((log) => (
            <div key={log.id} className="p-6 flex items-start gap-4 hover:bg-neutral-50 transition-colors">
              <div className="bg-neutral-100 p-2 rounded-lg text-neutral-500">
                <Activity className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold text-neutral-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-neutral-400" />
                    {log.user}
                  </p>
                  <span className="text-xs text-neutral-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {log.timestamp}
                  </span>
                </div>
                <p className="text-sm text-neutral-600">{log.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
