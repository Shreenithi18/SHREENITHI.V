import { useEffect, useState } from "react";
import { ClipboardCheck, ArrowRight, UserSquare2, CheckCircle2 } from "lucide-react";

export default function TutorAssignment() {
  const [sections, setSections] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/sections").then(res => res.json()),
      fetch("/api/faculty").then(res => res.json()),
      fetch("/api/tutor-assignments").then(res => res.json())
    ]).then(([s, f, a]) => {
      setSections(s);
      setFaculty(f);
      setAssignments(a);
      setIsLoading(false);
    });
  }, []);

  const handleAssign = async () => {
    if (!selectedSection || !selectedFaculty) return;
    
    const res = await fetch("/api/tutor-assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section_id: selectedSection, faculty_id: selectedFaculty }),
    });
    const data = await res.json();
    if (data.success) {
      fetch("/api/tutor-assignments").then(res => res.json()).then(setAssignments);
      setSelectedSection("");
      setSelectedFaculty("");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Tutor Assignment</h1>
        <p className="text-neutral-500">Assign faculty members as tutors for specific sections</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
            <h2 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-indigo-600" />
              New Assignment
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Select Section</label>
                <select 
                  value={selectedSection}
                  onChange={e => setSelectedSection(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Choose Section</option>
                  {sections.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-center py-2">
                <ArrowRight className="w-6 h-6 text-neutral-300 rotate-90 lg:rotate-0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Select Faculty</label>
                <select 
                  value={selectedFaculty}
                  onChange={e => setSelectedFaculty(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Choose Faculty</option>
                  {faculty.map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.faculty_id})</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={handleAssign}
                disabled={!selectedSection || !selectedFaculty}
                className="w-full mt-4 bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                Assign Tutor
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-neutral-100">
              <h2 className="text-lg font-bold text-neutral-900">Current Assignments</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Section</th>
                    <th className="px-6 py-4 font-semibold">Assigned Tutor</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {isLoading ? (
                    [1, 2, 3].map(i => <tr key={i} className="h-16 animate-pulse bg-neutral-50/50" />)
                  ) : assignments.map((a) => (
                    <tr key={a.section_id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-neutral-900">{a.section_name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs">
                            {a.faculty_name[0]}
                          </div>
                          <span className="text-neutral-700">{a.faculty_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-xs font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
