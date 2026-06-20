import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { cookies } from 'next/headers'

async function checkAuth() {
  const c = await cookies()
  return c.get('sl_admin_session')?.value === 'authenticated_suhu_laptop_admin'
}

export async function GET(req: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const status = searchParams.get('status')
  const kategori = searchParams.get('kategori')
  const dateFrom = searchParams.get('dateFrom')
  const dateTo = searchParams.get('dateTo')
  const search = searchParams.get('search')

  let q = supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false })
  if (status && status !== 'all') q = q.eq('status', status)
  if (kategori && kategori !== 'all') q = q.eq('kategori', kategori)
  if (dateFrom) q = q.gte('tanggal_ambil', dateFrom)
  if (dateTo) q = q.lte('tanggal_ambil', dateTo)

  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let result = data ?? []
  if (search) {
    const s = search.toLowerCase()
    result = result.filter((o) => o.nama.toLowerCase().includes(s) || o.no_hp.includes(s))
  }

  return NextResponse.json(result)
}
