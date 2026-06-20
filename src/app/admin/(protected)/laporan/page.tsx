import { supabaseAdmin } from '@/lib/supabase'
import LaporanClient from '@/components/LaporanClient'

export const revalidate = 0

async function getLaporan() {
  const { data: orders } = await supabaseAdmin
    .from('orders')
    .select('*')
    .neq('status', 'batal')
    .order('created_at', { ascending: false })

  const all = orders ?? []

  // Per bulan (last 12)
  const monthly: Record<string, { gross: number; days: number; count: number; byKategori: Record<string, number> }> = {}
  for (let i = 11; i >= 0; i--) {
    const d = new Date()
    d.setDate(1)
    d.setMonth(d.getMonth() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    monthly[key] = { gross: 0, days: 0, count: 0, byKategori: { i3: 0, i5: 0, macbook: 0 } }
  }

  for (const o of all) {
    const key = o.created_at.slice(0, 7)
    if (monthly[key]) {
      monthly[key].gross += o.total_bayar
      monthly[key].days += o.durasi_hari
      monthly[key].count += 1
      monthly[key].byKategori[o.kategori] = (monthly[key].byKategori[o.kategori] ?? 0) + 1
    }
  }

  const rows = Object.entries(monthly).map(([key, val]) => ({
    bulan: new Date(key + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
    gross: val.gross,
    konsinyasi: val.days * 50000,
    net: val.gross - val.days * 50000,
    count: val.count,
    byKategori: val.byKategori,
  }))

  const totalGross = all.reduce((s, o) => s + o.total_bayar, 0)
  const totalDays = all.reduce((s, o) => s + o.durasi_hari, 0)
  const totalKonsinyasi = totalDays * 50000
  const totalNet = totalGross - totalKonsinyasi

  const byKategori = { i3: 0, i5: 0, macbook: 0 }
  const incomeByKategori = { i3: 0, i5: 0, macbook: 0 }
  for (const o of all) {
    byKategori[o.kategori as keyof typeof byKategori] = (byKategori[o.kategori as keyof typeof byKategori] ?? 0) + 1
    incomeByKategori[o.kategori as keyof typeof incomeByKategori] = (incomeByKategori[o.kategori as keyof typeof incomeByKategori] ?? 0) + o.total_bayar
  }

  return { rows, totalGross, totalKonsinyasi, totalNet, totalOrders: all.length, byKategori, incomeByKategori }
}

export default async function LaporanPage() {
  const data = await getLaporan()
  return <LaporanClient {...data} />
}
