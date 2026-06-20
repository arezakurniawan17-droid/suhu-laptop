"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Order, OrderStatus } from "@/lib/supabase";
import { formatRupiah } from "@/lib/pricing";
import { Search, Filter, Download, Clock, CheckCircle, XCircle, RefreshCw, ChevronDown } from "lucide-react";

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock },
  aktif: { label: "Aktif", color: "bg-blue-100 text-blue-700 border-blue-200", icon: RefreshCw },
  selesai: { label: "Selesai", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
  batal: { label: "Batal", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [kategoriFilter, setKategoriFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (kategoriFilter !== "all") params.set("kategori", kategoriFilter);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/orders?${params}`);
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [statusFilter, kategoriFilter, dateFrom, dateTo, search]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    setUpdatingId(id);
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await fetchOrders();
    setUpdatingId(null);
  };

  const exportCSV = () => {
    const headers = ["ID","Tanggal","Nama","No HP","Kategori","Durasi","Tgl Ambil","Total","Status"];
    const rows = orders.map((o) => [
      o.id, new Date(o.created_at).toLocaleDateString("id-ID"),
      o.nama, o.no_hp, o.kategori, o.durasi_hari + " hari",
      o.tanggal_ambil, formatRupiah(o.total_bayar), o.status
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `orders_suhu_laptop_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="p-4 md:p-7 pt-16 md:pt-7">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-purple-900">Semua Order</h1>
          <p className="text-purple-400 text-sm">{orders.length} order ditemukan</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-purple-100 p-4 mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input type="text" placeholder="Cari nama atau No. HP..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border-2 border-purple-200 rounded-xl text-sm text-purple-900 placeholder-purple-300 focus:outline-none focus:border-purple-500" />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 border-2 border-purple-200 rounded-xl text-sm text-purple-900 focus:outline-none focus:border-purple-500 appearance-none cursor-pointer bg-white">
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="aktif">Aktif</option>
            <option value="selesai">Selesai</option>
            <option value="batal">Batal</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select value={kategoriFilter} onChange={(e) => setKategoriFilter(e.target.value)}
            className="px-4 pr-8 py-2.5 border-2 border-purple-200 rounded-xl text-sm text-purple-900 focus:outline-none focus:border-purple-500 appearance-none cursor-pointer bg-white">
            <option value="all">Semua Kategori</option>
            <option value="i3">Laptop i3</option>
            <option value="i5">Laptop i5</option>
            <option value="macbook">MacBook</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 pointer-events-none" />
        </div>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
          className="px-3 py-2.5 border-2 border-purple-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 cursor-pointer" />
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
          className="px-3 py-2.5 border-2 border-purple-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 cursor-pointer" />
      </div>

      <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-purple-50 text-left">
                <th className="px-5 py-3 text-purple-600 font-semibold text-xs">Nama</th>
                <th className="px-3 py-3 text-purple-600 font-semibold text-xs">Laptop</th>
                <th className="px-3 py-3 text-purple-600 font-semibold text-xs hidden md:table-cell">Tgl Ambil</th>
                <th className="px-3 py-3 text-purple-600 font-semibold text-xs hidden md:table-cell">Tgl Kembali</th>
                <th className="px-3 py-3 text-purple-600 font-semibold text-xs">Total</th>
                <th className="px-3 py-3 text-purple-600 font-semibold text-xs">Status</th>
                <th className="px-3 py-3 text-purple-600 font-semibold text-xs">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {loading ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-purple-300">Memuat data...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-purple-300">Tidak ada order</td></tr>
              ) : orders.map((o) => {
                const st = STATUS_CONFIG[o.status] ?? STATUS_CONFIG.pending;
                return (
                  <tr key={o.id} className="hover:bg-purple-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <Link href={`/admin/orders/${o.id}`} className="font-semibold text-purple-900 hover:text-purple-600 cursor-pointer">{o.nama}</Link>
                      <p className="text-purple-400 text-xs">{o.no_hp}</p>
                    </td>
                    <td className="px-3 py-3 text-purple-700 font-medium capitalize">{o.kategori}<br/><span className="text-xs text-purple-400">{o.durasi_hari} hari</span></td>
                    <td className="px-3 py-3 text-purple-500 text-xs hidden md:table-cell">
                      {new Date(o.tanggal_ambil).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'2-digit'})}<br/>{o.jam_ambil.slice(0,5)} WIB
                    </td>
                    <td className="px-3 py-3 text-purple-500 text-xs hidden md:table-cell">
                      {new Date(o.tanggal_kembali).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'2-digit'})}<br/>{o.jam_kembali.slice(0,5)} WIB
                    </td>
                    <td className="px-3 py-3 font-bold text-purple-900 whitespace-nowrap">{formatRupiah(o.total_bayar)}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border ${st.color}`}>
                        <st.icon className="w-3 h-3" />{st.label}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="relative">
                        <select value={o.status} disabled={updatingId === o.id}
                          onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)}
                          className="text-xs border-2 border-purple-200 rounded-lg px-2 py-1.5 text-purple-700 focus:outline-none cursor-pointer appearance-none pr-6 bg-white disabled:opacity-50">
                          <option value="pending">Pending</option>
                          <option value="aktif">Aktif</option>
                          <option value="selesai">Selesai</option>
                          <option value="batal">Batal</option>
                        </select>
                        <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-purple-400 pointer-events-none" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
