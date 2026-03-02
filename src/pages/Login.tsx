import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { GraduationCap, Lock, User } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "faculty") navigate("/faculty");
      else if (user.role === "student") navigate("/student");
      else if (user.role.startsWith("warden")) navigate("/warden");
      else if (user.role === "bus_manager") navigate("/manager");
      else if (user.role === "bus_driver") navigate("/driver");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        login(data.user);
        const role = data.user.role;
        if (role === "admin") navigate("/admin");
        else if (role === "faculty") navigate("/faculty");
        else if (role === "student") navigate("/student");
        else if (role.startsWith("warden")) navigate("/warden");
        else if (role === "bus_manager") navigate("/manager");
        else if (role === "bus_driver") navigate("/driver");
        else navigate("/");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-neutral-200 p-10 space-y-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-2xl mb-6 shadow-lg shadow-indigo-200 rotate-3 hover:rotate-0 transition-transform duration-300">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight">EduManage</h1>
          <p className="text-neutral-500 mt-3 font-medium">College Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-neutral-700 ml-1">Username</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-medium"
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-semibold text-neutral-700">Password</label>
              <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Forgot?</button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-medium"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm font-medium flex items-center gap-2 animate-shake">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="pt-6 border-t border-neutral-100">
          <p className="text-center text-xs font-bold text-neutral-400 uppercase tracking-widest mb-6">Quick Access Demo</p>
          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => { setUsername("admin"); setPassword("admin123"); }}
              className="px-2 py-3 text-[10px] font-bold text-neutral-600 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl transition-colors"
            >
              Admin
            </button>
            <button 
              onClick={() => { setUsername("21CS001"); setPassword("student123"); }}
              className="px-2 py-3 text-[10px] font-bold text-neutral-600 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl transition-colors"
            >
              Student
            </button>
            <button 
              onClick={() => { setUsername("FAC001"); setPassword("faculty123"); }}
              className="px-2 py-3 text-[10px] font-bold text-neutral-600 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl transition-colors"
            >
              Faculty
            </button>
            <button 
              onClick={() => { setUsername("warden_boys"); setPassword("warden123"); }}
              className="px-2 py-3 text-[10px] font-bold text-neutral-600 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl transition-colors"
            >
              Warden
            </button>
            <button 
              onClick={() => { setUsername("driver01"); setPassword("driver123"); }}
              className="px-2 py-3 text-[10px] font-bold text-neutral-600 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl transition-colors"
            >
              Driver
            </button>
            <button 
              onClick={() => { setUsername("bus_manager"); setPassword("manager123"); }}
              className="px-2 py-3 text-[10px] font-bold text-neutral-600 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl transition-colors"
            >
              Manager
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
