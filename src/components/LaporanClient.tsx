"use client";

import { formatRupiah } from "@/lib/pricing";
import { TrendingUp, TrendingDown, DollarSign, Package } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";

interface Props {
  rows: { bulan: string; gross: number; konsinyasi: number; net: number; count: number; byKategori: Record<string, number> }[]
  totalGross: number
  totalKonsinyasi: number
  totalNet: number
  totalOrders: number
  byKategori: Record<string, number>
  incomeByKategori: Record<string, number>
}

export default function LaporanClient({ rows, totalGross, totalKonsinyasi, totalNet, totalOrders, byKategori, incomeByKategori }: Props) {
  const chartData = rows.slice(-6).map((r) => ({
    name: r.bulan.split(' ')[0],
    Gross: r.gross,
    Konsinyasi: r.konsinyasi,
    Net: r.net,
  }))

  return (
    <div className="p-4 md:p-7 pt-16 md:pt-7">
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold text-purple-900">Laporan Keuangan</h1>
        <p className="text-purple-400 text-sm">Gross income vs biaya konsinyasi vs net profit</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {[
          { label: "Total Gross Income", value: formatRupiah(totalGross), icon: TrendingUp, color: "from-blue-500 to-blue-700", sub: `${totalOrders} transaksi` },
          { label: "Biaya Konsinyasi", value: formatRupiah(totalKonsinyasi), icon: TrendingDown, color: "from-orange-400 to-orange-600", sub: "Rp50.000/unit/hari" },
          { label: "Net Profit", value: formatRupiah(totalNet), icon: DollarSign, color: totalNet >= 0 ? "from-emerald-500 to-emerald-700" : "from-red-500 to-red-700", sub: "Gross - Konsinyasi" },
          { label: "Total Order", value: totalOrders, icon: Package, color: "from-purple-500 to-purple-700", sub: "tidak termasuk batal" },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-2xl border border-purple-100 p-4 shadow-sm">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center mb-3`}>
              <m.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-xl font-extrabold text-purple-900">{m.value}</p>
            <p className="text-purple-400 text-xs mt-0.5">{m.sub}</p>
            <p className="text-purple-600 text-xs font-semibold mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-purple-100 p-5 mb-7 shadow-sm">
        <p className="font-bold text-purple-900 mb-4">Gross vs Konsinyasi vs Net (6 Bulan Terakhir)</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#7c3aed' }} />
            <YAxis tick={{ fontSize: 10, fill: '#a78bfa' }} tickFormatter={(v) => v >= 1000000 ? `${v/1000000}jt` : `${v/1000}k`} />
            <Tooltip // eslint-disable-next-line @typescript-eslint/no-explicit-any
formatter={(v: any) => formatRupiah(Number(v ?? 0))} />
            <Legend />
            <Bar dataKey="Gross" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Konsinyasi" fill="#f97316" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Net" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Rekap per kategori */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
        {(["i3", "i5", "macbook"] as const).map((k) => (
          <div key={k} className="bg-white rounded-2xl border border-purple-100 p-4 shadow-sm">
            <p className="font-bold text-purple-900 capitalize mb-3">{k === "macbook" ? "MacBook" : `Laptop ${k.toUpperCase()}`}</p>
            <p className="text-2xl font-extrabold text-purple-900">{byKategori[k] ?? 0}x</p>
            <p className="text-purple-400 text-xs mb-2">disewa</p>
            <p className="text-sm font-bold text-purple-700">{formatRupiah(incomeByKategori[k] ?? 0)}</p>
            <p className="text-purple-400 text-xs">income dari kategori ini</p>
          </div>
        ))}
      </div>

      {/* Monthly table */}
      <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-purple-50">
          <p className="font-bold text-purple-900">Detail per Bulan</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-purple-50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-purple-600">Bulan</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-purple-600">Order</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-purple-600">Gross</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-purple-600">Konsinyasi</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-purple-600">Net Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {rows.slice().reverse().map((r) => (
                <tr key={r.bulan} className="hover:bg-purple-50/50">
                  <td className="px-5 py-3 font-medium text-purple-900">{r.bulan}</td>
                  <td className="px-3 py-3 text-right text-purple-600">{r.count}</td>
                  <td className="px-3 py-3 text-right text-purple-900 font-semibold">{formatRupiah(r.gross)}</td>
                  <td className="px-3 py-3 text-right text-orange-600">{formatRupiah(r.konsinyasi)}</td>
                  <td className={`px-3 py-3 text-right font-bold ${r.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatRupiah(r.net)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
