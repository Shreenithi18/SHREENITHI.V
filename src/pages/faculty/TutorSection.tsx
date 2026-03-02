import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Users, FileText, CheckCircle2, XCircle, Clock, Eye } from "lucide-react";

export default function TutorSection() {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [odRequests, setOdRequests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"students" | "od">("students");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/tutor/students/${user?.related_id}`).then(res => res.json()),
      fetch(`/api/od-requests?faculty_id=${user?.related_id}&role=faculty`).then(res => res.json())
    ]).then(([s, od]) => {
      setStudents(s);
      setOdRequests(od);
      setIsLoading(false);
    });
  }, [user]);

  const handleODStatus = async (id: number, status: string) => {
    const res = await fetch("/api/od-requests/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const data = await res.json();
    if (data.success) {
      fetch(`/api/od-requests?faculty_id=${user?.related_id}&role=faculty`)
        .then(res => res.json())
        .then(setOdRequests);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Tutor Section</h1>
        <p className="text-neutral-500">Manage your assigned section's students and requests</p>
      </div>

      <div className="flex border-b border-neutral-200">
        <button 
          onClick={() => setActiveTab("students")}
          className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${activeTab === 'students' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}
        >
          My Students
        </button>
        <button 
          onClick={() => setActiveTab("od")}
          className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${activeTab === 'od' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}
        >
          OD Requests
        </button>
      </div>

      {activeTab === "students" ? (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Roll No</th>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">CGPA</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {isLoading ? (
                  [1, 2, 3].map(i => <tr key={i} className="h-16 animate-pulse bg-neutral-50/50" />)
                ) : students.map((s) => (
                  <tr key={s.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-neutral-900">{s.roll_no}</td>
                    <td className="px-6 py-4 text-neutral-700">{s.name}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-indigo-600">{s.cgpa || "0.00"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-sm text-indigo-600 font-medium hover:underline">View Profile</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {isLoading ? (
            [1, 2].map(i => <div key={i} className="h-32 bg-white rounded-2xl border border-neutral-200 animate-pulse" />)
          ) : odRequests.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-neutral-200">
              <FileText className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
              <p className="text-neutral-500 font-medium">No pending OD requests</p>
            </div>
          ) : odRequests.map((od) => (
            <div key={od.id} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900">{od.student_name} ({od.roll_no})</h3>
                  <p className="text-sm text-neutral-500 mt-1">{od.reason}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-neutral-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {od.date}
                    </span>
                    <span className={`text-xs font-bold uppercase ${
                      od.status === 'submitted' ? 'text-amber-500' : 
                      od.status === 'tutor_verified' ? 'text-blue-500' : 
                      'text-emerald-500'
                    }`}>
                      {od.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-sm font-medium">
                  <Eye className="w-4 h-4" />
                  View Letter
                </button>
                {od.status === 'submitted' && (
                  <>
                    <button 
                      onClick={() => handleODStatus(od.id, 'tutor_verified')}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Verify
                    </button>
                    <button 
                      onClick={() => handleODStatus(od.id, 'rejected')}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
