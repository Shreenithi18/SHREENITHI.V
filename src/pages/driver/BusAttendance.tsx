import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Bus, CheckCircle2, XCircle, Calendar, Search, Sun, Moon } from "lucide-react";
import { cn } from "../../lib/utils";

export default function BusAttendance() {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [session, setSession] = useState<'morning' | 'evening'>('morning');
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(`/api/bus/students/${user?.id}`)
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        const initialAttendance: Record<number, string> = {};
        data.forEach((s: any) => initialAttendance[s.id] = 'present');
        setAttendance(initialAttendance);
        setIsLoading(false);
      });
  }, [user]);

  const toggleStatus = (id: number) => {
    setAttendance(prev => ({
      ...prev,
      [id]: prev[id] === 'present' ? 'absent' : 'present'
    }));
  };

  const handleSubmit = async () => {
    const student_ids = Object.entries(attendance).map(([id, status]) => ({
      id: parseInt(id),
      status
    }));

    const res = await fetch("/api/bus/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_ids,
        date,
        session,
        driver_id: user?.id,
        bus_id: students[0]?.bus_id
      }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Bus attendance marked successfully!");
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.roll_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Bus Attendance</h1>
          <p className="text-neutral-500">Mark attendance for route: {students[0]?.route_name || "Loading..."}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-neutral-100 p-1 rounded-lg">
            <button 
              onClick={() => setSession('morning')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                session === 'morning' ? "bg-white text-indigo-600 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
              )}
            >
              <Sun className="w-4 h-4" /> Morning
            </button>
            <button 
              onClick={() => setSession('evening')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                session === 'evening' ? "bg-white text-indigo-600 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
              )}
            >
              <Moon className="w-4 h-4" /> Evening
            </button>
          </div>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2 border border-neutral-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            onClick={handleSubmit}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Submit
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search student..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Student</th>
                <th className="px-6 py-4 font-semibold">Section</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                [1, 2, 3].map(i => <tr key={i} className="h-16 animate-pulse bg-neutral-50/50" />)
              ) : filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-neutral-900">{s.name}</p>
                    <p className="text-xs text-neutral-500">{s.roll_no}</p>
                  </td>
                  <td className="px-6 py-4 text-neutral-600">{s.section_name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => toggleStatus(s.id)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                          attendance[s.id] === 'present' 
                            ? "bg-emerald-100 text-emerald-700" 
                            : "bg-red-100 text-red-700"
                        )}
                      >
                        {attendance[s.id] === 'present' ? (
                          <><CheckCircle2 className="w-4 h-4" /> Present</>
                        ) : (
                          <><XCircle className="w-4 h-4" /> Absent</>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
