"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Laptop, Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();
    if (json.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError(json.error || "Login gagal");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen gradient-hero flex items-center justify-center px-4">
      <div className="absolute top-20 -right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 -left-20 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Laptop className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Suhu Laptop</h1>
          <p className="text-purple-200 text-sm">Admin Dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-7 shadow-2xl shadow-purple-900/30">
          <h2 className="text-xl font-bold text-purple-900 mb-1">Masuk Admin</h2>
          <p className="text-purple-400 text-sm mb-6">Khusus pemilik Suhu Laptop</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-purple-800 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@suhulaptop.id"
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-purple-200 rounded-xl text-purple-900 placeholder-purple-300 focus:outline-none focus:border-purple-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-purple-800 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 border-2 border-purple-200 rounded-xl text-purple-900 placeholder-purple-300 focus:outline-none focus:border-purple-500 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600 cursor-pointer"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-700 hover:bg-purple-800 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-200 transition-all cursor-pointer mt-2"
            >
              {loading ? "Memverifikasi..." : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
