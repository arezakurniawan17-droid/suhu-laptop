import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Public client — used client-side (booking form)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Admin client — used server-side only (admin dashboard)
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

export type OrderStatus = 'pending' | 'aktif' | 'selesai' | 'batal'

export interface Order {
  id: string
  created_at: string
  nama: string
  no_hp: string
  username_ig: string
  profesi: string
  nama_instansi: string
  alamat: string
  no_hp_darurat: string
  kategori: string
  tanggal_ambil: string
  jam_ambil: string
  durasi_hari: number
  tanggal_kembali: string
  jam_kembali: string
  jaminan: string[]
  total_bayar: number
  status: OrderStatus
  ttd_base64: string | null
  confirmed_at: string | null
  returned_at: string | null
}

export interface Blacklist {
  id: string
  created_at: string
  nama: string
  no_hp: string
  alasan: string
}
