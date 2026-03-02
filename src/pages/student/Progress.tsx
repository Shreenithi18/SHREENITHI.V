import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { TrendingUp, BookOpen, Award, AlertCircle } from "lucide-react";

export default function ProgressCheck() {
  const { user } = useAuth();
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/student/academic/${user?.related_id}`)
      .then(res => res.json())
      .then(data => {
        setRecords(data);
        setIsLoading(false);
      });
  }, [user]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Academic Progress</h1>
        <p className="text-neutral-500">Track your grades and performance over semesters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Current CGPA</p>
          </div>
          <p className="text-3xl font-bold text-neutral-900">{user?.details?.cgpa || "0.00"}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
              <Award className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Rank in Class</p>
          </div>
          <p className="text-3xl font-bold text-neutral-900">#12</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Arrears</p>
          </div>
          <p className="text-3xl font-bold text-neutral-900">0</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-100">
          <h2 className="text-lg font-bold text-neutral-900">Subject-wise Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Semester</th>
                <th className="px-6 py-4 font-semibold">Subject</th>
                <th className="px-6 py-4 font-semibold">Score</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                [1, 2, 3].map(i => <tr key={i} className="h-16 animate-pulse bg-neutral-50/50" />)
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                    <AlertCircle className="w-8 h-8 text-neutral-200 mx-auto mb-2" />
                    No academic records found
                  </td>
                </tr>
              ) : records.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 text-neutral-600">Sem {r.semester}</td>
                  <td className="px-6 py-4 font-medium text-neutral-900">{r.subject}</td>
                  <td className="px-6 py-4 font-bold text-indigo-600">{r.score}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${r.score >= 50 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {r.score >= 50 ? 'Pass' : 'Fail'}
                    </span>
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
