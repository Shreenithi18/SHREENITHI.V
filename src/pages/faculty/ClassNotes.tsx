import { useEffect, useState, FormEvent } from "react";
import { useAuth } from "../../hooks/useAuth";
import { BookOpen, Plus, FileText, Calendar, Search, X } from "lucide-react";

export default function ClassNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    content: "",
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetch(`/api/faculty/notes/${user?.related_id}`)
      .then(res => res.json())
      .then(data => {
        setNotes(data);
        setIsLoading(false);
      });
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/faculty/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, faculty_id: user?.related_id }),
    });
    const data = await res.json();
    if (data.success) {
      setIsModalOpen(false);
      fetch(`/api/faculty/notes/${user?.related_id}`).then(res => res.json()).then(setNotes);
      setFormData({ subject: "", topic: "", content: "", date: new Date().toISOString().split('T')[0] });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Class Notes</h1>
          <p className="text-neutral-500">Manage and share daily class materials</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Notes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map(i => <div key={i} className="h-48 bg-white rounded-2xl border border-neutral-200 animate-pulse" />)
        ) : notes.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-neutral-200">
            <BookOpen className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
            <p className="text-neutral-500 font-medium">No notes uploaded yet</p>
          </div>
        ) : notes.map((note) => (
          <div key={note.id} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase">
                {note.subject}
              </span>
              <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {note.date}
              </span>
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">{note.topic}</h3>
            <p className="text-sm text-neutral-600 mb-4 flex-1 line-clamp-3">{note.content}</p>
            <button className="w-full py-2 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              View Materials
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-neutral-900">Add Class Notes</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Subject</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                    placeholder="e.g., Data Structures"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Topic</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.topic}
                    onChange={e => setFormData({...formData, topic: e.target.value})}
                    placeholder="e.g., Binary Search Trees"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Content / Link</label>
                  <textarea 
                    required 
                    rows={3}
                    value={formData.content}
                    onChange={e => setFormData({...formData, content: e.target.value})}
                    placeholder="Brief description or link to materials"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none" 
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    required 
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
              </div>
              <div className="pt-4 flex items-center gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Save Notes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
