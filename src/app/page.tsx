"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { KATEGORI_INFO, hitungHarga, formatRupiah, WA_NUMBER } from "@/lib/pricing";
import type { Kategori } from "@/lib/pricing";
import {
  Laptop, MessageCircle, ChevronDown, ChevronUp,
  CheckCircle, Shield, Clock, Users,
  Monitor, Zap, FileText, CreditCard, Phone, MapPin,
  ArrowRight, Briefcase, Building
} from "lucide-react";

const FAQS = [
  {
    q: "Laptop apa saja yang tersedia?",
    a: "Kami menyediakan 3 kategori: Laptop i3 (tugas kuliah & office), Laptop i5 (multitasking & desain ringan), dan MacBook (creative work & macOS). Merk bersifat random sesuai ketersediaan, namun spesifikasi dijamin sesuai kategori.",
  },
  {
    q: "Apa saja yang sudah termasuk dalam paket sewa?",
    a: "Setiap unit sudah termasuk: Laptop + Charger + Tas laptop. Tidak ada biaya tambahan untuk bundling ini.",
  },
  {
    q: "Dokumen jaminan apa yang diperlukan?",
    a: "Minimal 2 dokumen dari pilihan: KTP, SIM A, SIM C, STNK, atau Passport. Semua dokumen harus atas nama satu orang. Dokumen asli diserahkan saat pengambilan laptop di outlet.",
  },
  {
    q: "Bagaimana cara membayar?",
    a: "Pembayaran via QRIS (scan di halaman invoice). Setelah transfer, kirim bukti bayar ke WhatsApp admin. Laptop baru bisa diambil setelah pembayaran dikonfirmasi.",
  },
  {
    q: "Berapa denda jika terlambat mengembalikan?",
    a: "Denda keterlambatan Rp10.000 per jam. Jika tidak dapat dihubungi lebih dari 24 jam setelah waktu kembali, Suhu Laptop berhak melaporkan ke pihak kepolisian.",
  },
  {
    q: "Apakah ada promo atau diskon?",
    a: "Ada! Promo 3 hari: Laptop i3 hanya Rp319.000 (hemat Rp128.000), Laptop i5 & MacBook hanya Rp379.000 (hemat Rp158.000). Jauh lebih hemat dari harga normal per hari.",
  },
  {
    q: "Bisakah sewa untuk instansi atau acara?",
    a: "Bisa! Kami melayani sewa untuk instansi, sekolah, perusahaan dengan jumlah 5–100 unit. Hubungi admin via WhatsApp untuk penawaran khusus.",
  },
];

const GALLERY_ROW1 = [
  { nama: "Rizky A.", profesi: "Mahasiswa UBL", inisial: "R", bg: "bg-gradient-to-br from-purple-500 to-purple-800" },
  { nama: "Sari W.", profesi: "Guru SDN 1", inisial: "S", bg: "bg-gradient-to-br from-violet-500 to-indigo-700" },
  { nama: "Dani M.", profesi: "Karyawan Swasta", inisial: "D", bg: "bg-gradient-to-br from-fuchsia-500 to-purple-800" },
  { nama: "Feby N.", profesi: "Mahasiswa Unila", inisial: "F", bg: "bg-gradient-to-br from-indigo-500 to-purple-700" },
  { nama: "Ari S.", profesi: "Freelancer", inisial: "A", bg: "bg-gradient-to-br from-purple-600 to-pink-700" },
  { nama: "Nita P.", profesi: "Mahasiswa IBI", inisial: "N", bg: "bg-gradient-to-br from-violet-600 to-purple-900" },
  { nama: "Budi K.", profesi: "Staff Kantor", inisial: "B", bg: "bg-gradient-to-br from-purple-400 to-indigo-800" },
];

const GALLERY_ROW2 = [
  { nama: "Putri R.", profesi: "Mahasiswa Darmajaya", inisial: "P", bg: "bg-gradient-to-br from-pink-500 to-purple-700" },
  { nama: "Hendra T.", profesi: "Wiraswasta", inisial: "H", bg: "bg-gradient-to-br from-indigo-600 to-violet-800" },
  { nama: "Yuni A.", profesi: "Mahasiswa", inisial: "Y", bg: "bg-gradient-to-br from-purple-500 to-fuchsia-800" },
  { nama: "Reza F.", profesi: "Content Creator", inisial: "R", bg: "bg-gradient-to-br from-violet-500 to-purple-900" },
  { nama: "Mega L.", profesi: "Admin Perusahaan", inisial: "M", bg: "bg-gradient-to-br from-purple-600 to-indigo-900" },
  { nama: "Tono S.", profesi: "Mahasiswa ITERA", inisial: "T", bg: "bg-gradient-to-br from-fuchsia-600 to-indigo-700" },
  { nama: "Dinda K.", profesi: "Guru Honorer", inisial: "D", bg: "bg-gradient-to-br from-purple-400 to-violet-800" },
];

const CARA_SEWA = [
  { icon: Monitor, label: "Pilih Laptop", desc: "Pilih kategori laptop sesuai kebutuhanmu: i3, i5, atau MacBook" },
  { icon: Clock, label: "Atur Jadwal", desc: "Tentukan tanggal ambil, jam, dan durasi sewa (1–7 hari)" },
  { icon: FileText, label: "Isi Data", desc: "Lengkapi data diri dan pilih dokumen jaminan minimal 2 jenis" },
  { icon: CreditCard, label: "Bayar QRIS", desc: "Tanda tangan digital & bayar via QRIS. Invoice otomatis terbuat" },
  { icon: Laptop, label: "Ambil Laptop", desc: "Datang ke outlet Sukarame sesuai jadwal dengan dokumen jaminan asli" },
];

function FaqItem({ q, a, idx }: { q: string; a: string; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer ${
        open ? "border-purple-300 shadow-md shadow-purple-50" : "border-purple-100 hover:border-purple-200"
      }`}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold mt-0.5">
            {idx + 1}
          </span>
          <p className="font-semibold text-purple-900 leading-snug">{q}</p>
        </div>
        <div className="flex-shrink-0 text-purple-400 mt-0.5">
          {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>
      {open && (
        <div className="px-5 pb-5 pt-0">
          <p className="text-purple-700/80 text-sm leading-relaxed pl-10">{a}</p>
        </div>
      )}
    </div>
  );
}

function KategoriCard({ id }: { id: Kategori }) {
  const info = KATEGORI_INFO[id];
  const isPopuler = info.badge === "Terpopuler";
  const isUnavailable = id === "macbook";

  return (
    <div
      className={`relative rounded-3xl p-6 flex flex-col gap-4 transition-all duration-300 ${
        isUnavailable
          ? "bg-gray-100 border-2 border-gray-200 text-gray-400 opacity-75"
          : isPopuler
          ? "bg-gradient-to-br from-purple-700 to-purple-900 text-white shadow-xl shadow-purple-200 card-hover"
          : "bg-white border-2 border-purple-100 text-purple-900 hover:border-purple-200 card-hover"
      }`}
    >
      {isUnavailable && (
        <div className="absolute inset-0 rounded-3xl flex items-center justify-center z-10">
          <div className="bg-gray-800/80 backdrop-blur-sm text-white text-center px-5 py-3 rounded-2xl">
            <p className="text-lg font-extrabold">Full Rent</p>
            <p className="text-xs text-gray-300 mt-0.5">Sedang tidak tersedia</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isUnavailable ? "bg-gray-200" : isPopuler ? "bg-white/20" : "bg-purple-50"}`}>
          <Monitor className={`w-6 h-6 ${isUnavailable ? "text-gray-400" : isPopuler ? "text-white" : "text-purple-600"}`} />
        </div>
        {info.badge && !isUnavailable && (
          <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
            {info.badge}
          </span>
        )}
        {isUnavailable && (
          <span className="bg-red-100 text-red-500 text-xs font-bold px-3 py-1 rounded-full border border-red-200">
            Tidak Tersedia
          </span>
        )}
      </div>

      <div>
        <h3 className={`text-xl font-bold mb-1 ${isUnavailable ? "text-gray-500" : isPopuler ? "text-white" : "text-purple-900"}`}>{info.label}</h3>
        <p className={`text-xs font-medium ${isUnavailable ? "text-gray-400" : isPopuler ? "text-purple-200" : "text-purple-500"}`}>{info.spek}</p>
      </div>

      <p className={`text-sm ${isUnavailable ? "text-gray-400" : isPopuler ? "text-purple-100" : "text-purple-700"}`}>{info.cocokUntuk}</p>

      <div className={`rounded-2xl p-4 ${isUnavailable ? "bg-gray-200" : isPopuler ? "bg-white/15" : "bg-purple-50"}`}>
        <p className={`text-xs font-medium mb-1 ${isUnavailable ? "text-gray-400" : isPopuler ? "text-purple-200" : "text-purple-500"}`}>Mulai dari</p>
        <p className={`text-2xl font-bold ${isUnavailable ? "text-gray-400" : isPopuler ? "text-white" : "text-purple-900"}`}>{formatRupiah(info.hargaPerHari)}<span className={`text-sm font-medium ${isUnavailable ? "text-gray-400" : isPopuler ? "text-purple-200" : "text-purple-400"}`}>/hari</span></p>
        <p className={`text-xs mt-1 ${isUnavailable ? "text-gray-400" : isPopuler ? "text-purple-200" : "text-purple-400"}`}>Promo 3 hari: {formatRupiah(hitungHarga(id, 3))}</p>
      </div>

      <div className="flex gap-4">
        {["Laptop", "Charger", "Tas"].map((item) => (
          <div key={item} className="flex items-center gap-1">
            <CheckCircle className={`w-3.5 h-3.5 ${isUnavailable ? "text-gray-300" : isPopuler ? "text-green-300" : "text-green-500"}`} />
            <span className={`text-xs ${isUnavailable ? "text-gray-400" : isPopuler ? "text-purple-100" : "text-purple-600"}`}>{item}</span>
          </div>
        ))}
      </div>

      {isUnavailable ? (
        <div className="w-full text-center py-3 rounded-xl font-semibold text-sm bg-gray-200 text-gray-400 cursor-not-allowed">
          Sedang Full Rent
        </div>
      ) : (
        <Link
          href="/booking"
          className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
            isPopuler
              ? "bg-yellow-400 text-yellow-900 hover:bg-yellow-300 shadow-lg shadow-yellow-500/30"
              : "bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-100"
          }`}
        >
          Sewa {info.label}
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">

        {/* HERO */}
        <section className="gradient-hero min-h-screen flex flex-col items-center justify-center px-4 pt-16 pb-16 relative overflow-hidden">
          <div className="absolute top-20 -right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-2 mb-6 text-white/90 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Tersedia di Bandar Lampung
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4">
              Sewa Laptop
              <br />
              <span className="text-yellow-400">Tanpa Ribet</span>
            </h1>

            <p className="text-purple-100 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Laptop i3, i5, hingga MacBook tersedia untuk sewa harian di Sukarame, Bandar Lampung.
              Booking online, bayar QRIS, ambil langsung.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold text-base px-8 py-4 rounded-2xl shadow-xl shadow-yellow-500/30 transition-all duration-200 hover:-translate-y-1 cursor-pointer"
              >
                <Laptop className="w-5 h-5" />
                Sewa Sekarang
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Halo Admin, saya ingin tanya tentang sewa laptop untuk instansi")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur border border-white/30 text-white font-semibold text-base px-8 py-4 rounded-2xl transition-all duration-200 cursor-pointer"
              >
                <Building className="w-5 h-5" />
                Untuk Instansi
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
              {[
                { num: "200+", label: "Penyewa" },
                { num: "3", label: "Kategori" },
                { num: "100%", label: "Terpercaya" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-extrabold text-yellow-400">{s.num}</p>
                  <p className="text-purple-200 text-xs font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-6 h-6 text-white/50" />
          </div>
        </section>

        {/* KATEGORI */}
        <section className="py-20 px-4 bg-[#FAF5FF]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-purple-600 text-sm font-bold uppercase tracking-widest">Pilihan Laptop</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-purple-900 mt-2 mb-3">Semua Ada, Semua Terjangkau</h2>
              <p className="text-purple-600 max-w-xl mx-auto">
                Hover pada pilihan hari untuk lihat harga. Setiap unit sudah termasuk laptop, charger, dan tas.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(["i3", "i5", "macbook"] as Kategori[]).map((id) => (
                <KategoriCard key={id} id={id} />
              ))}
            </div>
            <div className="mt-8 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-yellow-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-900/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-yellow-900" />
                </div>
                <div>
                  <p className="font-bold text-yellow-900">Promo Sewa 3 Hari!</p>
                  <p className="text-yellow-800 text-sm">i3 cuma Rp319.000 · i5 & MacBook cuma Rp379.000</p>
                </div>
              </div>
              <Link
                href="/booking"
                className="bg-yellow-900 text-yellow-100 font-bold px-6 py-2.5 rounded-xl hover:bg-yellow-800 transition-colors cursor-pointer text-sm flex-shrink-0"
              >
                Ambil Promo
              </Link>
            </div>
          </div>
        </section>

        {/* CARA SEWA */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-purple-600 text-sm font-bold uppercase tracking-widest">Cara Kerja</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-purple-900 mt-2 mb-3">5 Langkah, Laptop di Tangan</h2>
              <p className="text-purple-600">Proses mudah dari pilih hingga ambil laptop. Tidak perlu tanya-tanya via WA dulu.</p>
            </div>
            <div className="relative">
              <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-purple-200 via-purple-400 to-purple-200" />
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {CARA_SEWA.map((step, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-3 relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-lg shadow-purple-200 relative z-10">
                      <step.icon className="w-8 h-8 text-white" />
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-yellow-400 text-yellow-900 text-xs font-bold flex items-center justify-center shadow">
                        {i + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-purple-900">{step.label}</p>
                      <p className="text-purple-600 text-xs leading-relaxed mt-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-12 text-center">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-purple-200 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                Mulai Booking
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* GALLERY PENYEWA */}
        <section className="py-20 bg-[#FAF5FF] overflow-hidden">
          <div className="text-center mb-10 px-4">
            <span className="text-purple-600 text-sm font-bold uppercase tracking-widest">Galeri Penyewa</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-purple-900 mt-2 mb-3">Mereka Sudah Sewa di Sini</h2>
            <p className="text-purple-600">Ratusan penyewa sudah mempercayai Suhu Laptop untuk kebutuhan mereka.</p>
          </div>

          {/* Row 1 — scroll kiri */}
          <div className="marquee-wrap mb-4">
            <div className="marquee-left flex gap-4 w-max">
              {[...GALLERY_ROW1, ...GALLERY_ROW1].map((g, i) => (
                <div key={i} className="w-52 h-64 sm:w-60 sm:h-72 rounded-2xl overflow-hidden flex-shrink-0 relative shadow-md">
                  <div className={`w-full h-full ${g.bg} flex flex-col items-center justify-end pb-5`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-4xl font-extrabold text-white/70">
                        {g.inisial}
                      </div>
                    </div>
                    <div className="relative z-10 text-center">
                      <p className="text-white font-bold text-sm drop-shadow">{g.nama}</p>
                      <p className="text-white/80 text-xs">{g.profesi}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 — scroll kanan */}
          <div className="marquee-wrap">
            <div className="marquee-right flex gap-4 w-max">
              {[...GALLERY_ROW2, ...GALLERY_ROW2].map((g, i) => (
                <div key={i} className="w-52 h-64 sm:w-60 sm:h-72 rounded-2xl overflow-hidden flex-shrink-0 relative shadow-md">
                  <div className={`w-full h-full ${g.bg} flex flex-col items-center justify-end pb-5`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-4xl font-extrabold text-white/70">
                        {g.inisial}
                      </div>
                    </div>
                    <div className="relative z-10 text-center">
                      <p className="text-white font-bold text-sm drop-shadow">{g.nama}</p>
                      <p className="text-white/80 text-xs">{g.profesi}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-purple-400 text-xs mt-6">📸 Mau fotomu ada di sini? Sewa sekarang &amp; tag kami!</p>
        </section>

        {/* INSTANSI */}
        <section className="py-20 px-4 gradient-hero relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-2 mb-6 text-white/90 text-sm font-medium">
              <Briefcase className="w-4 h-4" />
              Layanan Instansi & Korporat
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Butuh 5–100 Unit Laptop?</h2>
            <p className="text-purple-100 text-lg max-w-2xl mx-auto mb-8">
              Kami melayani sewa massal untuk sekolah, perusahaan, acara seminar, dan kegiatan korporat
              di seluruh Bandar Lampung. Hubungi admin untuk penawaran terbaik.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto">
              {[
                { icon: Shield, label: "Terjamin Kualitas" },
                { icon: Clock, label: "Tepat Waktu" },
                { icon: Users, label: "Layanan Dedicated" },
              ].map((f) => (
                <div key={f.label} className="bg-white/10 backdrop-blur rounded-2xl p-4 flex flex-col items-center gap-2 text-white border border-white/20">
                  <f.icon className="w-6 h-6 text-yellow-400" />
                  <span className="text-sm font-medium">{f.label}</span>
                </div>
              ))}
            </div>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Halo Admin Suhu Laptop, saya ingin tanya tentang sewa laptop untuk instansi")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-400 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-xl shadow-green-500/30 transition-all hover:-translate-y-1 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              Chat Admin via WhatsApp
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-4 bg-[#FAF5FF]">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-purple-600 text-sm font-bold uppercase tracking-widest">FAQ</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-purple-900 mt-2 mb-3">Pertanyaan Umum</h2>
            </div>
            <div className="flex flex-col gap-3">
              {FAQS.map((f, i) => (
                <FaqItem key={i} q={f.q} a={f.a} idx={i} />
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-purple-950 text-white py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Image src="/logo.jpg" alt="Suhu Laptop" width={140} height={48} className="h-12 w-auto object-contain brightness-0 invert" />
                </div>
                <p className="text-purple-300 text-sm leading-relaxed">
                  Sewa laptop harian terpercaya di Bandar Lampung. Booking online, ambil di outlet.
                </p>
              </div>
              <div>
                <p className="font-semibold text-purple-200 mb-4">Informasi</p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-2 text-sm text-purple-300">
                    <MapPin className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span>Sukarame, Bandar Lampung</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-purple-300">
                    <Clock className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span>Senin–Jumat, 08.00–16.00 WIB</span>
                  </div>
                  <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors cursor-pointer">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>082182702569</span>
                  </a>
                  <a href="https://instagram.com/suhulaptop.lpg" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-pink-400 hover:text-pink-300 transition-colors cursor-pointer">
                    <Phone className="w-4 h-4 flex-shrink-0 text-pink-400" />
                    <span>@suhulaptop.lpg</span>
                  </a>
                </div>
              </div>
              <div>
                <p className="font-semibold text-purple-200 mb-4">Link Cepat</p>
                <div className="flex flex-col gap-2">
                  {[
                    { href: "/booking", label: "Booking Laptop", ext: false },
                    { href: "/ketentuan", label: "Ketentuan Sewa", ext: false },
                    { href: `https://wa.me/${WA_NUMBER}`, label: "Hubungi Admin", ext: true },
                  ].map((link) => (
                    <a key={link.label} href={link.href} target={link.ext ? "_blank" : undefined}
                      rel={link.ext ? "noopener noreferrer" : undefined}
                      className="text-sm text-purple-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                      <ArrowRight className="w-3 h-3" />
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t border-purple-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-purple-500">
              <p>© 2026 Suhu Laptop Lampung. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
