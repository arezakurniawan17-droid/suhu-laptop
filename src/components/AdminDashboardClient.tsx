"use client";

import Link from "next/link";
import { formatRupiah } from "@/lib/pricing";
import type { Order } from "@/lib/supabase";
import {
  ShoppingBag, TrendingUp, Laptop, AlertCircle,
  Clock, CheckCircle, XCircle, RefreshCw
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

interface Props {
  ordersToday: number
  incomeToday: number
  incomeMonth: number
  activeCount: number
  alerts: { id: string; nama: string; kategori: string; jam_kembali: string }[]
  recent: Order[]
  weekly: { label: string; income: number }[]
  monthly: { label: string; income: number }[]
}

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  aktif: { label: "Aktif", color: "bg-blue-100 text-blue-700", icon: RefreshCw },
  selesai: { label: "Selesai", color: "bg-green-100 text-green-700", icon: CheckCircle },
  batal: { label: "Batal", color: "bg-red-100 text-red-700", icon: XCircle },
}

export default function AdminDashboardClient({ ordersToday, incomeToday, incomeMonth, activeCount, alerts, recent, weekly, monthly }: Props) {
  const metrics = [
    { label: "Order Hari Ini", value: ordersToday, sub: "transaksi", icon: ShoppingBag, color: "from-purple-500 to-purple-700" },
    { label: "Income Hari Ini", value: formatRupiah(incomeToday), sub: "pemasukan", icon: TrendingUp, color: "from-blue-500 to-blue-700" },
    { label: "Order Aktif", value: activeCount, sub: "sedang disewa", icon: Laptop, color: "from-emerald-500 to-emerald-700" },
    { label: "Income Bulan Ini", value: formatRupiah(incomeMonth), sub: "bulan berjalan", icon: TrendingUp, color: "from-violet-500 to-violet-700" },
  ]

  return (
    <div className="p-4 md:p-7 pt-16 md:pt-7">
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold text-purple-900">Dashboard</h1>
        <p className="text-purple-400 text-sm">Selamat datang di admin panel Suhu Laptop</p>
      </div>

      {/* Alert H-1 */}
      {alerts.length > 0 && (
        <div className="bg-orange-50 border-2 border-orange-300 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <p className="font-bold text-orange-800">Pengembalian Besok ({alerts.length} order)</p>
          </div>
          <div className="flex flex-col gap-2">
            {alerts.map((a) => (
              <Link key={a.id} href={`/admin/orders/${a.id}`}
                className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 hover:shadow-md transition-shadow cursor-pointer">
                <span className="font-semibold text-purple-900 text-sm">{a.nama}</span>
                <div className="flex items-center gap-2">
                  <span className="text-purple-500 text-xs">{a.kategori}</span>
                  <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {a.jam_kembali.slice(0, 5)} WIB
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white rounded-2xl p-4 border border-purple-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center mb-3`}>
              <m.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-xl font-extrabold text-purple-900 leading-tight">{m.value}</p>
            <p className="text-purple-400 text-xs mt-0.5">{m.sub}</p>
            <p className="text-purple-600 text-xs font-semibold mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-7">
        <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm">
          <p className="font-bold text-purple-900 mb-4">Income 7 Hari Terakhir</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weekly} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#7c3aed' }} />
              <YAxis tick={{ fontSize: 10, fill: '#a78bfa' }} tickFormatter={(v) => v >= 1000000 ? `${v/1000000}jt` : `${v/1000}k`} />
              <Tooltip // eslint-disable-next-line @typescript-eslint/no-explicit-any
formatter={(v: any) => [formatRupiah(Number(v ?? 0)), 'Income']} />
              <Bar dataKey="income" fill="#7c3aed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm">
          <p className="font-bold text-purple-900 mb-4">Income 6 Bulan Terakhir</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthly} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#7c3aed' }} />
              <YAxis tick={{ fontSize: 10, fill: '#a78bfa' }} tickFormatter={(v) => v >= 1000000 ? `${v/1000000}jt` : `${v/1000}k`} />
              <Tooltip // eslint-disable-next-line @typescript-eslint/no-explicit-any
formatter={(v: any) => [formatRupiah(Number(v ?? 0)), 'Income']} />
              <Bar dataKey="income" fill="#a78bfa" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-purple-50">
          <p className="font-bold text-purple-900">Order Terbaru</p>
          <Link href="/admin/orders" className="text-purple-600 text-sm font-semibold hover:text-purple-800 cursor-pointer">
            Lihat semua →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-purple-50 text-left">
                <th className="px-5 py-3 text-purple-600 font-semibold text-xs">Nama</th>
                <th className="px-3 py-3 text-purple-600 font-semibold text-xs">Laptop</th>
                <th className="px-3 py-3 text-purple-600 font-semibold text-xs hidden sm:table-cell">Ambil</th>
                <th className="px-3 py-3 text-purple-600 font-semibold text-xs">Total</th>
                <th className="px-3 py-3 text-purple-600 font-semibold text-xs">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-purple-300 text-sm">
                    Belum ada order
                  </td>
                </tr>
              ) : recent.map((o) => {
                const st = STATUS_CONFIG[o.status] ?? STATUS_CONFIG.pending
                return (
                  <tr key={o.id} className="hover:bg-purple-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <Link href={`/admin/orders/${o.id}`} className="font-semibold text-purple-900 hover:text-purple-600 cursor-pointer">
                        {o.nama}
                      </Link>
                      <p className="text-purple-400 text-xs">{o.no_hp}</p>
                    </td>
                    <td className="px-3 py-3 text-purple-700 font-medium capitalize">{o.kategori}</td>
                    <td className="px-3 py-3 text-purple-500 text-xs hidden sm:table-cell">
                      {new Date(o.tanggal_ambil).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      <br />{o.jam_ambil.slice(0, 5)} WIB
                    </td>
                    <td className="px-3 py-3 font-bold text-purple-900">{formatRupiah(o.total_bayar)}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${st.color}`}>
                        <st.icon className="w-3 h-3" />
                        {st.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
