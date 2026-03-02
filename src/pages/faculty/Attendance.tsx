import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { ClipboardCheck, Check, X, Search } from "lucide-react";

export default function AttendanceMarking() {
  const { user } = useAuth();
  const [sections, setSections] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedHour, setSelectedHour] = useState("1");
  const [attendance, setAttendance] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/sections").then(res => res.json()).then(setSections);
  }, []);

  useEffect(() => {
    if (selectedSection) {
      fetch(`/api/students?section_id=${selectedSection}`)
        .then(res => res.json())
        .then(data => {
          // Filter by section_id if the API doesn't do it (my API currently returns all)
          const filtered = data.filter((s: any) => s.section_id === parseInt(selectedSection));
          setStudents(filtered);
          const initial: Record<number, string> = {};
          filtered.forEach((s: any) => initial[s.id] = "present");
          setAttendance(initial);
        });
    } else {
      setStudents([]);
    }
  }, [selectedSection]);

  const toggleStatus = (id: number) => {
    setAttendance(prev => ({
      ...prev,
      [id]: prev[id] === "present" ? "absent" : "present"
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const student_ids = Object.entries(attendance).map(([id, status]) => ({ id: parseInt(id), status }));
    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_ids,
        date: new Date().toISOString().split('T')[0],
        hour: parseInt(selectedHour),
        faculty_id: user?.related_id,
        section_id: parseInt(selectedSection)
      }),
    });
    const data = await res.json();
    if (data.success) {
      alert("Attendance submitted successfully!");
      setSelectedSection("");
      setStudents([]);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Mark Attendance</h1>
        <p className="text-neutral-500">Select section and hour to record attendance</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Select Section</label>
            <select 
              value={selectedSection}
              onChange={e => setSelectedSection(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Choose Section</option>
              {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Select Hour</label>
            <select 
              value={selectedHour}
              onChange={e => setSelectedHour(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(h => <option key={h} value={h}>Hour {h}</option>)}
            </select>
          </div>
        </div>
      </div>

      {students.length > 0 && (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900">Student List ({students.length})</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                  <span className="text-neutral-500">Present: {Object.values(attendance).filter(v => v === 'present').length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-neutral-500">Absent: {Object.values(attendance).filter(v => v === 'absent').length}</span>
                </div>
              </div>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Attendance"}
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Roll No</th>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-neutral-900">{student.roll_no}</td>
                    <td className="px-6 py-4 text-neutral-700">{student.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => setAttendance(prev => ({...prev, [student.id]: "present"}))}
                          className={`p-2 rounded-lg transition-all ${attendance[student.id] === 'present' ? 'bg-emerald-100 text-emerald-600' : 'bg-neutral-100 text-neutral-400'}`}
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => setAttendance(prev => ({...prev, [student.id]: "absent"}))}
                          className={`p-2 rounded-lg transition-all ${attendance[student.id] === 'absent' ? 'bg-red-100 text-red-600' : 'bg-neutral-100 text-neutral-400'}`}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
