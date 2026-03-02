import { useEffect, useState } from "react";
import { FileText, CheckCircle2, XCircle, Clock, Eye, ShieldCheck } from "lucide-react";

export default function AdminODVerification() {
  const [odRequests, setOdRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/od-requests?role=admin")
      .then(res => res.json())
      .then(data => {
        setOdRequests(data);
        setIsLoading(false);
      });
  }, []);

  const handleODStatus = async (id: number, status: string) => {
    const res = await fetch("/api/od-requests/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const data = await res.json();
    if (data.success) {
      fetch("/api/od-requests?role=admin")
        .then(res => res.json())
        .then(setOdRequests);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Admin OD Verification</h1>
        <p className="text-neutral-500">Final approval for student On-Duty requests</p>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          [1, 2].map(i => <div key={i} className="h-32 bg-white rounded-2xl border border-neutral-200 animate-pulse" />)
        ) : odRequests.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-neutral-200">
            <ShieldCheck className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
            <p className="text-neutral-500 font-medium">No pending OD requests for approval</p>
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
                  <span className="text-xs text-neutral-400 font-medium">Section: {od.section_name}</span>
                  <span className={`text-xs font-bold uppercase ${
                    od.status === 'submitted' ? 'text-amber-500' : 
                    od.status === 'tutor_verified' ? 'text-blue-500' : 
                    od.status === 'admin_approved' ? 'text-indigo-500' :
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
              {od.status === 'tutor_verified' && (
                <>
                  <button 
                    onClick={() => handleODStatus(od.id, 'admin_approved')}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Approve
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
    </div>
  );
}
