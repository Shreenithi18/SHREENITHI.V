import { useEffect, useState, FormEvent } from "react";
import { useAuth } from "../../hooks/useAuth";
import { FileUp, FileText, CheckCircle2, Clock, Trash2, ShieldCheck } from "lucide-react";

export default function DocumentUpload() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: "marksheet",
    name: "",
    url: ""
  });

  useEffect(() => {
    fetch(`/api/student/documents/${user?.related_id}`)
      .then(res => res.json())
      .then(data => {
        setDocuments(data);
        setIsLoading(false);
      });
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/student/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, student_id: user?.related_id }),
    });
    const data = await res.json();
    if (data.success) {
      setFormData({ type: "marksheet", name: "", url: "" });
      fetch(`/api/student/documents/${user?.related_id}`).then(res => res.json()).then(setDocuments);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Document Management</h1>
        <p className="text-neutral-500">Upload and manage your marksheets, Aadhar, and certificates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
            <h2 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <FileUp className="w-5 h-5 text-indigo-600" />
              Upload Document
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Document Type</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="marksheet">Marksheet</option>
                  <option value="aadhar">Aadhar Card</option>
                  <option value="certificate">Certificate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Document Name</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Sem 1 Marksheet"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Document Link / URL</label>
                <input 
                  type="url" 
                  required 
                  value={formData.url}
                  onChange={e => setFormData({...formData, url: e.target.value})}
                  placeholder="https://example.com/doc.pdf"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Upload Document
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-neutral-100">
              <h2 className="text-lg font-bold text-neutral-900">My Documents</h2>
            </div>
            <div className="divide-y divide-neutral-100">
              {isLoading ? (
                [1, 2].map(i => <div key={i} className="h-20 animate-pulse bg-neutral-50/50" />)
              ) : documents.length === 0 ? (
                <div className="p-12 text-center text-neutral-500">
                  <FileText className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
                  <p>No documents uploaded yet</p>
                </div>
              ) : documents.map((doc) => (
                <div key={doc.id} className="p-6 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900">{doc.name}</p>
                      <div className="flex items-center gap-3 text-xs text-neutral-500">
                        <span className="capitalize">{doc.type}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(doc.uploaded_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <a 
                      href={doc.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 font-medium hover:underline"
                    >
                      View
                    </a>
                    <button className="p-2 text-neutral-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
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
