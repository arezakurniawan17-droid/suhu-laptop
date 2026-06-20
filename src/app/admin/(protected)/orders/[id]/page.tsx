"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Order, OrderStatus } from "@/lib/supabase";
import { formatRupiah, JAMINAN_OPTIONS } from "@/lib/pricing";
import { ArrowLeft, User, Laptop, Calendar, Shield, Clock, CheckCircle, XCircle, RefreshCw, Phone, ChevronDown } from "lucide-react";

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  aktif: { label: "Aktif", color: "bg-blue-100 text-blue-700", icon: RefreshCw },
  selesai: { label: "Selesai", color: "bg-green-100 text-green-700", icon: CheckCircle },
  batal: { label: "Batal", color: "bg-red-100 text-red-700", icon: XCircle },
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`).then((r) => r.json()).then((d) => { setOrder(d); setLoading(false); });
  }, [id]);

  const updateStatus = async (status: OrderStatus) => {
    if (!order) return;
    setUpdating(true);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.id) setOrder(data);
    setUpdating(false);
  };

  if (loading) return <div className="p-7 pt-16 md:pt-7 text-purple-400">Memuat...</div>;
  if (!order || (order as { error?: string }).error) return <div className="p-7 pt-16 md:pt-7 text-red-500">Order tidak ditemukan.</div>;

  const st = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;

  return (
    <div className="p-4 md:p-7 pt-16 md:pt-7 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/orders" className="p-2 rounded-xl hover:bg-purple-50 cursor-pointer text-purple-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold text-purple-900">Detail Order</h1>
          <p className="text-purple-400 text-xs font-mono truncate max-w-xs">{order.id}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-purple-100 p-5 mb-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs text-purple-400 mb-1">Status Saat Ini</p>
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold ${st.color}`}>
              <st.icon className="w-4 h-4" />{st.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs text-purple-400">Ubah:</p>
            <div className="relative">
              <select value={order.status} disabled={updating} onChange={(e) => updateStatus(e.target.value as OrderStatus)}
                className="border-2 border-purple-300 rounded-xl px-3 py-2 text-sm text-purple-800 font-semibold focus:outline-none cursor-pointer appearance-none pr-8 bg-white disabled:opacity-50">
                <option value="pending">Pending</option>
                <option value="aktif">Aktif</option>
                <option value="selesai">Selesai</option>
                <option value="batal">Batal</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-purple-100 p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center"><User className="w-4 h-4 text-purple-600" /></div>
          <p className="font-bold text-purple-900">Data Penyewa</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[["Nama",order.nama],["No. HP",order.no_hp],["Instagram","@"+order.username_ig],["Profesi",order.profesi],["Instansi",order.nama_instansi],["No. HP Darurat",order.no_hp_darurat]].map(([label,val])=>(
            <div key={label}><p className="text-xs text-purple-400">{label}</p><p className="font-semibold text-purple-900 text-sm">{val}</p></div>
          ))}
          <div className="sm:col-span-2"><p className="text-xs text-purple-400">Alamat</p><p className="font-semibold text-purple-900 text-sm">{order.alamat}</p></div>
        </div>
        <a href={`https://wa.me/${order.no_hp.replace(/^0/,'62').replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
          className="mt-4 flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors cursor-pointer w-fit">
          <Phone className="w-4 h-4" />Chat via WhatsApp
        </a>
      </div>

      <div className="bg-white rounded-2xl border border-purple-100 p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center"><Laptop className="w-4 h-4 text-purple-600" /></div>
          <p className="font-bold text-purple-900">Detail Sewa</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[["Kategori",order.kategori.toUpperCase()],["Durasi",order.durasi_hari+" hari"],["Tgl Ambil",new Date(order.tanggal_ambil).toLocaleDateString('id-ID',{weekday:'short',day:'numeric',month:'long'})],["Jam Ambil",order.jam_ambil.slice(0,5)+" WIB"],["Tgl Kembali",new Date(order.tanggal_kembali).toLocaleDateString('id-ID',{weekday:'short',day:'numeric',month:'long'})],["Jam Kembali",order.jam_kembali.slice(0,5)+" WIB"]].map(([label,val])=>(
            <div key={label}><p className="text-xs text-purple-400">{label}</p><p className="font-semibold text-purple-900 text-sm">{val}</p></div>
          ))}
        </div>
        <div className="mt-4 bg-purple-50 rounded-xl p-4">
          <p className="text-xs text-purple-400 mb-1">Total Bayar</p>
          <p className="text-2xl font-extrabold text-purple-900">{formatRupiah(order.total_bayar)}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-purple-100 p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center"><Shield className="w-4 h-4 text-purple-600" /></div>
          <p className="font-bold text-purple-900">Dokumen Jaminan</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {order.jaminan.map((j) => {
            const label = JAMINAN_OPTIONS.find((o) => o.id === j)?.label ?? j;
            return (
              <span key={j} className="bg-purple-50 border border-purple-200 text-purple-700 font-semibold text-sm px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />{label}
              </span>
            );
          })}
        </div>
      </div>

      {order.ttd_base64 && (
        <div className="bg-white rounded-2xl border border-purple-100 p-5 mb-4">
          <p className="font-bold text-purple-900 mb-3">Tanda Tangan Digital</p>
          <div className="border-2 border-purple-100 rounded-xl overflow-hidden bg-gray-50">
            <img src={order.ttd_base64} alt="TTD" className="max-h-32 object-contain p-2" />
          </div>
          <p className="text-xs text-purple-400 mt-2">TTD: {order.nama}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-purple-100 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-purple-400" />
          <p className="font-bold text-purple-900 text-sm">Timeline</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span className="text-purple-400">Order dibuat</span>
            <span className="font-medium text-purple-800">{new Date(order.created_at).toLocaleString('id-ID')}</span>
          </div>
          {order.confirmed_at && <div className="flex justify-between text-sm">
            <span className="text-purple-400">Dikonfirmasi</span>
            <span className="font-medium text-blue-700">{new Date(order.confirmed_at).toLocaleString('id-ID')}</span>
          </div>}
          {order.returned_at && <div className="flex justify-between text-sm">
            <span className="text-purple-400">Dikembalikan</span>
            <span className="font-medium text-green-700">{new Date(order.returned_at).toLocaleString('id-ID')}</span>
          </div>}
        </div>
      </div>
    </div>
  );
}
