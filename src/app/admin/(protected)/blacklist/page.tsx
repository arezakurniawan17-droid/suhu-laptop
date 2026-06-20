"use client";

import { useEffect, useState } from "react";
import type { Blacklist } from "@/lib/supabase";
import { Shield, Trash2, UserX, Plus, Phone, AlertTriangle } from "lucide-react";

export default function BlacklistPage() {
  const [list, setList] = useState<Blacklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nama: "", no_hp: "", alasan: "" });
  const [submitting, setSubmitting] = useState(false);

  const load = () => fetch("/api/admin/blacklist").then((r) => r.json()).then((d) => { setList(Array.isArray(d) ? d : []); setLoading(false); });

  useEffect(() => { load(); }, []);

  const tambah = async () => {
    if (!form.nama || !form.no_hp || !form.alasan) return;
    setSubmitting(true);
    await fetch("/api/admin/blacklist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ nama: "", no_hp: "", alasan: "" });
    setShowForm(false);
    setSubmitting(false);
    load();
  };

  const hapus = async (id: string) => {
    if (!confirm("Hapus dari blacklist?")) return;
    await fetch(`/api/admin/blacklist/${id}`, { method: "DELETE" });
    setList((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="p-4 md:p-7 pt-16 md:pt-7 max-w-3xl">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-purple-900">Blacklist</h1>
          <p className="text-purple-400 text-sm mt-0.5">{list.length} penyewa diblokir</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer text-sm">
          <Plus className="w-4 h-4" />Tambah Blacklist
        </button>
      </div>

      {showForm && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <p className="font-bold text-red-800">Tambah ke Blacklist</p>
          </div>
          <div className="flex flex-col gap-3">
            {[["nama","Nama Lengkap","text"],["no_hp","Nomor HP","tel"],["alasan","Alasan Diblokir","text"]].map(([field,label,type])=>(
              <div key={field}>
                <label className="text-xs font-semibold text-red-700 block mb-1">{label}</label>
                <input type={type} value={form[field as keyof typeof form]} onChange={(e) => setForm({...form,[field]:e.target.value})}
                  placeholder={label} className="w-full border-2 border-red-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 bg-white" />
              </div>
            ))}
            <div className="flex gap-3 mt-1">
              <button onClick={tambah} disabled={submitting || !form.nama || !form.no_hp || !form.alasan}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl transition-colors cursor-pointer text-sm">
                {submitting ? "Menyimpan..." : "Tambahkan"}
              </button>
              <button onClick={() => setShowForm(false)} className="px-6 border-2 border-red-200 text-red-700 font-bold py-2.5 rounded-xl hover:bg-red-100 transition-colors cursor-pointer text-sm">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-purple-400">Memuat data...</div>
      ) : list.length === 0 ? (
        <div className="text-center py-20 text-purple-300">
          <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">Belum ada penyewa di blacklist</p>
          <p className="text-sm mt-1">Tambahkan jika ada penyewa bermasalah</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((b) => (
            <div key={b.id} className="bg-white border-2 border-red-100 rounded-2xl p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <UserX className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-extrabold text-red-900">{b.nama}</p>
                      <p className="text-red-400 text-sm flex items-center gap-1 mt-0.5">
                        <Phone className="w-3.5 h-3.5" />{b.no_hp}
                      </p>
                    </div>
                    <button onClick={() => hapus(b.id)} className="p-2 hover:bg-red-50 rounded-xl cursor-pointer transition-colors flex-shrink-0" title="Hapus dari blacklist">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                  <div className="mt-3 bg-red-50 rounded-xl px-3 py-2">
                    <p className="text-xs text-red-400 mb-0.5">Alasan</p>
                    <p className="text-sm font-semibold text-red-800">{b.alasan}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Ditambahkan: {new Date(b.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
