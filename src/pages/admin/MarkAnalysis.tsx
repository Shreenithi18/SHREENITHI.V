import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Users, Search, Download } from "lucide-react";
import { cn } from "../../lib/utils";

interface AnalysisData {
  student_name: string;
  roll_no: string;
  section_name: string;
  average_score: number;
  subjects_count: number;
}

export default function MarkAnalysis() {
  const [data, setData] = useState<AnalysisData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/admin/mark-analysis")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setIsLoading(false);
      });
  }, []);

  const filteredData = data.filter(s => 
    s.student_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.roll_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Student Mark Analysis</h1>
          <p className="text-neutral-500">Analyze performance trends across sections</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Top Performer</p>
          </div>
          <p className="text-2xl font-bold text-neutral-900">
            {data.length > 0 ? [...data].sort((a, b) => b.average_score - a.average_score)[0]?.student_name : "N/A"}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Overall Average</p>
          </div>
          <p className="text-2xl font-bold text-neutral-900">
            {data.length > 0 ? (data.reduce((acc, curr) => acc + (curr.average_score || 0), 0) / data.length).toFixed(2) : "0.00"}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
              <BarChart3 className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Total Analyzed</p>
          </div>
          <p className="text-2xl font-bold text-neutral-900">{data.length} Students</p>
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
                <th className="px-6 py-4 font-semibold">Avg Score</th>
                <th className="px-6 py-4 font-semibold">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                [1, 2, 3].map(i => <tr key={i} className="h-16 animate-pulse bg-neutral-50/50" />)
              ) : filteredData.map((s, idx) => (
                <tr key={idx} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-neutral-900">{s.student_name}</p>
                    <p className="text-xs text-neutral-500">{s.roll_no}</p>
                  </td>
                  <td className="px-6 py-4 text-neutral-600">{s.section_name}</td>
                  <td className="px-6 py-4 font-bold text-indigo-600">{(s.average_score || 0).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="w-full max-w-[100px] h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full transition-all duration-500",
                          s.average_score >= 80 ? "bg-emerald-500" : 
                          s.average_score >= 60 ? "bg-blue-500" : 
                          "bg-amber-500"
                        )}
                        style={{ width: `${s.average_score}%` }}
                      />
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
