-- =============================================
-- SUHU LAPTOP - Database Schema
-- Jalankan di: Supabase Dashboard > SQL Editor
-- =============================================

-- 1. Tabel Orders
CREATE TABLE IF NOT EXISTS orders (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      timestamptz DEFAULT now(),
  nama            text NOT NULL,
  no_hp           text NOT NULL,
  username_ig     text NOT NULL,
  profesi         text NOT NULL,
  nama_instansi   text NOT NULL,
  alamat          text NOT NULL,
  no_hp_darurat   text NOT NULL,
  kategori        text NOT NULL,       -- i3 | i5 | macbook
  tanggal_ambil   date NOT NULL,
  jam_ambil       time NOT NULL,
  durasi_hari     int NOT NULL,
  tanggal_kembali date NOT NULL,
  jam_kembali     time NOT NULL,
  jaminan         text[] NOT NULL DEFAULT '{}',
  total_bayar     int NOT NULL,
  status          text NOT NULL DEFAULT 'pending',  -- pending | aktif | selesai | batal
  ttd_base64      text,
  confirmed_at    timestamptz,
  returned_at     timestamptz
);

-- 2. Tabel Blacklist
CREATE TABLE IF NOT EXISTS blacklist (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  nama       text NOT NULL,
  no_hp      text NOT NULL,
  alasan     text NOT NULL
);

-- 3. Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE blacklist ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Public hanya bisa INSERT order baru
DROP POLICY IF EXISTS "public_insert_orders" ON orders;
CREATE POLICY "public_insert_orders" ON orders
  FOR INSERT TO anon WITH CHECK (true);

-- Service role full access
DROP POLICY IF EXISTS "service_all_orders" ON orders;
CREATE POLICY "service_all_orders" ON orders
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_all_blacklist" ON blacklist;
CREATE POLICY "service_all_blacklist" ON blacklist
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 5. Indexes
CREATE INDEX IF NOT EXISTS orders_created_at_idx     ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS orders_status_idx         ON orders(status);
CREATE INDEX IF NOT EXISTS orders_tanggal_ambil_idx  ON orders(tanggal_ambil);
CREATE INDEX IF NOT EXISTS orders_no_hp_idx          ON orders(no_hp);
CREATE INDEX IF NOT EXISTS blacklist_no_hp_idx       ON blacklist(no_hp);

-- Done!
SELECT 'Schema berhasil dibuat!' AS result;
