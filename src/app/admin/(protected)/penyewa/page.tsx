"use client";

import { useEffect, useState, useMemo } from "react";
import type { Order } from "@/lib/supabase";
import { formatRupiah } from "@/lib/pricing";
import { Users, Phone, Search, ChevronDown, ChevronRight, Laptop, Calendar, Shield } from "lucide-react";

interface Penyewa {
  no_hp: string;
  nama: string;
  username_ig: string;
  alamat: string;
  profesi: string;
  nama_instansi: string;
  total_transaksi: number;
  total_nilai: number;
  orders: Order[];
  terakhir_sewa: string;
}

export default function PenyewaPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/penyewa").then((r) => r.json()).then((d) => { setOrders(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const penyewaList: Penyewa[] = useMemo(() => {
    const map = new Map<string, Penyewa>();
    orders.forEach((o) => {
      const key = o.no_hp;
      if (!map.has(key)) {
        map.set(key, { no_hp: o.no_hp, nama: o.nama, username_ig: o.username_ig, alamat: o.alamat, profesi: o.profesi, nama_instansi: o.nama_instansi, total_transaksi: 0, total_nilai: 0, orders: [], terakhir_sewa: o.created_at });
      }
      const p = map.get(key)!;
      p.total_transaksi++;
      p.total_nilai += o.total_bayar;
      p.orders.push(o);
      if (o.created_at > p.terakhir_sewa) p.terakhir_sewa = o.created_at;
    });
    return Array.from(map.values()).sort((a, b) => b.total_transaksi - a.total_transaksi);
  }, [orders]);

  const filtered = penyewaList.filter((p) =>
    !search || p.nama.toLowerCase().includes(search.toLowerCase()) || p.no_hp.includes(search) || p.username_ig.toLowerCase().includes(search.toLowerCase())
  );

  const STATUS_COLOR: Record<string, string> = { pending: "bg-yellow-100 text-yellow-700", aktif: "bg-blue-100 text-blue-700", selesai: "bg-green-100 text-green-700", batal: "bg-red-100 text-red-700" };

  return (
    <div className="p-4 md:p-7 pt-16 md:pt-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-purple-900">Database Penyewa</h1>
          <p className="text-purple-400 text-sm mt-0.5">{penyewaList.length} penyewa unik terdaftar</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama / no HP / IG..."
            className="pl-9 pr-4 py-2.5 border-2 border-purple-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 w-full sm:w-64" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-purple-400">Memuat data penyewa...</div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((p) => (
            <div key={p.no_hp} className="bg-white rounded-2xl border border-purple-100 overflow-hidden">
              <button onClick={() => setExpanded(expanded === p.no_hp ? null : p.no_hp)}
                className="w-full flex items-center gap-4 p-4 hover:bg-purple-50 transition-colors cursor-pointer text-left">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-purple-900 truncate">{p.nama}</p>
                  <p className="text-purple-400 text-xs">@{p.username_ig} · {p.no_hp}</p>
                </div>
                <div className="hidden sm:flex items-center gap-6 text-center flex-shrink-0">
                  <div>
                    <p className="text-xs text-purple-400">Transaksi</p>
                    <p className="font-extrabold text-purple-900">{p.total_transaksi}×</p>
                  </div>
                  <div>
                    <p className="text-xs text-purple-400">Total Nilai</p>
                    <p className="font-extrabold text-purple-900 text-sm">{formatRupiah(p.total_nilai)}</p>
                  </div>
                </div>
                {expanded === p.no_hp ? <ChevronDown className="w-5 h-5 text-purple-400 flex-shrink-0" /> : <ChevronRight className="w-5 h-5 text-purple-400 flex-shrink-0" />}
              </button>

              {expanded === p.no_hp && (
                <div className="border-t border-purple-100 p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    {[["Profesi",p.profesi],["Instansi",p.nama_instansi],["Alamat",p.alamat],["Total Transaksi",p.total_transaksi+"×"],["Total Nilai",formatRupiah(p.total_nilai)],["Terakhir Sewa",new Date(p.terakhir_sewa).toLocaleDateString('id-ID')]].map(([label,val])=>(
                      <div key={label} className="bg-purple-50 rounded-xl p-3">
                        <p className="text-xs text-purple-400 mb-0.5">{label}</p>
                        <p className="font-semibold text-purple-900 text-sm truncate">{val}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <a href={`https://wa.me/${p.no_hp.replace(/^0/,'62').replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 font-semibold text-xs px-3 py-1.5 rounded-xl transition-colors cursor-pointer">
                      <Phone className="w-3.5 h-3.5" />WhatsApp
                    </a>
                  </div>
                  <p className="font-bold text-purple-800 text-sm mb-2">Riwayat Order ({p.orders.length})</p>
                  <div className="flex flex-col gap-2">
                    {p.orders.map((o) => (
                      <div key={o.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-purple-900 text-sm uppercase">{o.kategori}</span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLOR[o.status] ?? 'bg-gray-100 text-gray-700'}`}>{o.status}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-purple-400">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(o.tanggal_ambil).toLocaleDateString('id-ID')}</span>
                            <span className="flex items-center gap-1"><Laptop className="w-3 h-3" />{o.durasi_hari} hari</span>
                          </div>
                        </div>
                        <p className="font-extrabold text-purple-900 text-sm flex-shrink-0">{formatRupiah(o.total_bayar)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && !loading && (
            <div className="text-center py-20 text-purple-400">
              <Shield className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>Tidak ada data penyewa</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
