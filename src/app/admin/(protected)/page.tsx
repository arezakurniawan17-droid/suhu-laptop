import { supabaseAdmin } from '@/lib/supabase'
import AdminDashboardClient from '@/components/AdminDashboardClient'

export const revalidate = 0

async function getMetrics() {
  const today = new Date().toISOString().split('T')[0]
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  const [ordersTodayRes, incomeMonthRes, activeRes, alertRes, recentRes] = await Promise.all([
    supabaseAdmin.from('orders').select('total_bayar').gte('created_at', today + 'T00:00:00').neq('status', 'batal'),
    supabaseAdmin.from('orders').select('total_bayar').gte('created_at', monthStart + 'T00:00:00').neq('status', 'batal'),
    supabaseAdmin.from('orders').select('id').eq('status', 'aktif'),
    supabaseAdmin.from('orders').select('id, nama, kategori, jam_kembali').eq('tanggal_kembali', tomorrow).eq('status', 'aktif'),
    supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false }).limit(10),
  ])

  const ordersToday = ordersTodayRes.data?.length ?? 0
  const incomeToday = ordersTodayRes.data?.reduce((s, o) => s + o.total_bayar, 0) ?? 0
  const incomeMonth = incomeMonthRes.data?.reduce((s, o) => s + o.total_bayar, 0) ?? 0
  const activeCount = activeRes.data?.length ?? 0
  const alerts = alertRes.data ?? []
  const recent = recentRes.data ?? []

  // Weekly income (last 7 days)
  const weekly = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const { data } = await supabaseAdmin.from('orders')
      .select('total_bayar')
      .gte('created_at', dateStr + 'T00:00:00')
      .lte('created_at', dateStr + 'T23:59:59')
      .neq('status', 'batal')
    weekly.push({
      label: d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }),
      income: data?.reduce((s, o) => s + o.total_bayar, 0) ?? 0,
    })
  }

  // Monthly income (last 6 months)
  const monthly = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const y = d.getFullYear()
    const m = d.getMonth()
    const start = new Date(y, m, 1).toISOString()
    const end = new Date(y, m + 1, 0, 23, 59, 59).toISOString()
    const { data } = await supabaseAdmin.from('orders')
      .select('total_bayar')
      .gte('created_at', start)
      .lte('created_at', end)
      .neq('status', 'batal')
    monthly.push({
      label: d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' }),
      income: data?.reduce((s, o) => s + o.total_bayar, 0) ?? 0,
    })
  }

  return { ordersToday, incomeToday, incomeMonth, activeCount, alerts, recent, weekly, monthly }
}

export default async function AdminPage() {
  const metrics = await getMetrics()
  return <AdminDashboardClient {...metrics} />
}
