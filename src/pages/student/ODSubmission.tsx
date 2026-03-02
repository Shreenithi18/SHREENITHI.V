import { useState, useEffect, FormEvent } from "react";
import { useAuth } from "../../hooks/useAuth";
import { FileText, Send, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export default function ODSubmission() {
  const { user } = useAuth();
  const [reason, setReason] = useState("");
  const [date, setDate] = useState("");
  const [letterUrl, setLetterUrl] = useState("");
  const [requests, setRequests] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/od-requests?student_id=${user?.related_id}`)
      .then(res => res.json())
      .then(data => {
        // Filter by student_id if the API doesn't do it (my API currently returns all)
        const filtered = data.filter((r: any) => r.student_id === user?.related_id);
        setRequests(filtered);
      });
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await fetch("/api/student/od-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: user?.related_id,
        reason,
        date,
        letter_url: letterUrl || "https://example.com/letter.pdf"
      }),
    });
    const data = await res.json();
    if (data.success) {
      setReason("");
      setDate("");
      setLetterUrl("");
      // Refresh list
      fetch(`/api/od-requests?student_id=${user?.related_id}`)
        .then(res => res.json())
        .then(d => setRequests(d.filter((r: any) => r.student_id === user?.related_id)));
    }
    setIsSubmitting(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <Clock className="w-5 h-5 text-amber-500" />;
      case 'tutor_verified': return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
      case 'admin_approved': return <CheckCircle2 className="w-5 h-5 text-indigo-500" />;
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <AlertCircle className="w-5 h-5 text-neutral-400" />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">OD Submission</h1>
        <p className="text-neutral-500">Apply for On-Duty leave and track status</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
            <h2 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Send className="w-5 h-5 text-indigo-600" />
              New Request
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Reason for OD</label>
                <textarea 
                  required 
                  rows={3}
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="e.g., Workshop at IIT Madras"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Date</label>
                <input 
                  type="date" 
                  required 
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Letter URL (PDF/Image)</label>
                <input 
                  type="url" 
                  value={letterUrl}
                  onChange={e => setLetterUrl(e.target.value)}
                  placeholder="https://example.com/letter.pdf"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit OD Request"}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-neutral-100">
              <h2 className="text-lg font-bold text-neutral-900">My Requests</h2>
            </div>
            <div className="divide-y divide-neutral-100">
              {requests.length === 0 ? (
                <div className="p-12 text-center text-neutral-500">
                  <FileText className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
                  <p>No OD requests found</p>
                </div>
              ) : requests.map((req) => (
                <div key={req.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getStatusIcon(req.status)}</div>
                    <div>
                      <p className="font-bold text-neutral-900">{req.reason}</p>
                      <p className="text-sm text-neutral-500">{req.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      req.status === 'submitted' ? 'bg-amber-100 text-amber-600' :
                      req.status === 'tutor_verified' ? 'bg-blue-100 text-blue-600' :
                      req.status === 'admin_approved' ? 'bg-indigo-100 text-indigo-600' :
                      req.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {req.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
