import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Shield, Clock, Package, AlertCircle, CreditCard, Lock,
  Scale, Laptop, ArrowLeft
} from "lucide-react";

const SECTIONS = [
  {
    icon: Shield,
    title: "1. Ketentuan Umum",
    items: [
      "Layanan sewa laptop hanya tersedia untuk perorangan (Mahasiswa, Karyawan, Guru).",
      "Penyewa wajib berdomisili atau berada di wilayah Bandar Lampung.",
      "Penyewa minimal berusia 17 tahun dan memiliki identitas resmi.",
      "Pengambilan & pengembalian dilakukan di outlet Sukarame, Bandar Lampung.",
      "Jam operasional: Senin–Jumat, 08.00–16.00 WIB.",
      "Booking di luar jam operasional diproses pada hari kerja berikutnya.",
    ],
  },
  {
    icon: Lock,
    title: "2. Dokumen & Jaminan",
    items: [
      "Wajib menyerahkan minimal 2 dokumen jaminan asli saat pengambilan laptop.",
      "Dokumen yang diterima: KTP, SIM A, SIM C, STNK, atau Passport.",
      "Semua dokumen wajib atas nama satu penyewa yang sama.",
      "Dokumen dijaga kerahasiaannya dan dikembalikan saat laptop kembali dalam kondisi baik.",
      "Suhu Laptop berhak menolak jika dokumen tidak memenuhi syarat.",
    ],
  },
  {
    icon: Package,
    title: "3. Barang yang Disewa",
    items: [
      "Setiap unit sewa termasuk: Laptop + Charger + Tas laptop.",
      "Merk laptop bersifat random sesuai ketersediaan. Spesifikasi dijamin sesuai kategori yang dipilih.",
      "Penyewa wajib memeriksa kondisi barang saat serah terima.",
    ],
  },
  {
    icon: Clock,
    title: "4. Durasi & Pengembalian",
    items: [
      "Durasi sewa dihitung sejak jam pengambilan laptop.",
      "Denda keterlambatan: Rp10.000 per jam.",
      "Jika penyewa tidak dapat dihubungi dalam 1×24 jam setelah waktu pengembalian, Suhu Laptop berhak melaporkan ke pihak kepolisian.",
    ],
  },
  {
    icon: AlertCircle,
    title: "5. Kerusakan & Kehilangan",
    items: [
      "Kerusakan selama masa sewa → biaya perbaikan ditanggung sepenuhnya oleh penyewa.",
      "Laptop hilang → penyewa wajib mengganti dengan laptop spesifikasi setara harga pasaran.",
      "Bencana alam & force majeure → tetap menjadi tanggung jawab penyewa.",
    ],
  },
  {
    icon: CreditCard,
    title: "6. Pembayaran",
    items: [
      "Pembayaran dilakukan via QRIS sebelum pengambilan laptop.",
      "Bukti bayar wajib dikirim ke WhatsApp admin: 082182702569.",
      "Tidak ada refund setelah pembayaran dikonfirmasi.",
      "Pembatalan sepihak setelah pembayaran = pembayaran hangus.",
    ],
  },
  {
    icon: Shield,
    title: "7. Privasi",
    items: [
      "Data pribadi & dokumen jaminan hanya digunakan untuk keperluan administrasi sewa.",
      "Data tidak disebarluaskan kepada pihak ketiga manapun.",
    ],
  },
  {
    icon: Scale,
    title: "8. Hak Suhu Laptop",
    items: [
      "Berhak membatalkan pesanan jika dokumen jaminan tidak memenuhi syarat.",
      "Berhak mengambil tindakan hukum jika terjadi penyalahgunaan barang sewaan.",
    ],
  },
];

export default function KetentuanPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAF5FF] pt-16">
        {/* Header */}
        <div className="gradient-hero py-14 px-4 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/25 rounded-full px-4 py-2 mb-4 text-white/90 text-sm font-medium">
              <Laptop className="w-4 h-4" />
              Suhu Laptop Lampung
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              Ketentuan & Kebijakan
            </h1>
            <p className="text-purple-200 max-w-xl mx-auto text-sm leading-relaxed">
              Harap baca seluruh ketentuan ini sebelum melakukan pemesanan sewa laptop.
              Dengan melanjutkan pemesanan, kamu dianggap telah menyetujui semua ketentuan di bawah.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="flex flex-col gap-5">
            {SECTIONS.map((section, i) => (
              <div
                key={i}
                className="bg-white border border-purple-100 rounded-2xl overflow-hidden hover:shadow-md hover:shadow-purple-50 transition-shadow"
              >
                <div className="flex items-center gap-3 px-5 py-4 bg-purple-50 border-b border-purple-100">
                  <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="font-bold text-purple-900">{section.title}</h2>
                </div>
                <ul className="p-5 flex flex-col gap-3">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0 mt-2" />
                      <p className="text-purple-700 text-sm leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Notice box */}
          <div className="mt-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 text-center text-white">
            <p className="text-purple-200 text-xs mb-2">Pertanyaan & Informasi</p>
            <p className="font-bold text-lg mb-1">Hubungi Admin Kami</p>
            <p className="text-purple-200 text-sm mb-4">
              Jam operasional: Senin–Jumat, 08.00–16.00 WIB
            </p>
            <a
              href="https://wa.me/6282182702569"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-6 py-3 rounded-xl transition-all cursor-pointer text-sm"
            >
              WhatsApp: 082182702569
            </a>
          </div>

          {/* Back button */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-semibold text-sm transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
