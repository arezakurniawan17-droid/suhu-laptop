"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { formatRupiah, formatTanggalShort, WA_NUMBER, buatPesanWA, KATEGORI_INFO, JAMINAN_OPTIONS } from "@/lib/pricing";
import type { Kategori } from "@/lib/pricing";
import { CheckCircle, Download, MessageCircle, CreditCard, ArrowLeft, Laptop } from "lucide-react";

interface OrderDraft {
  id: string;
  nama: string;
  noHp: string;
  usernameIg: string;
  profesi: string;
  namaInstansi: string;
  alamat: string;
  noHpDarurat: string;
  kategori: Kategori;
  tanggalAmbil: string;
  jamAmbil: string;
  durasi: number;
  jaminan: string[];
  ttdBase64: string;
  total: number;
  createdAt: string;
}

export default function InvoicePage() {
  const [order, setOrder] = useState<OrderDraft | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const draft = localStorage.getItem("suhu_order_draft");
    if (draft) {
      setOrder(JSON.parse(draft));
    }
  }, []);

  if (!order) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#FAF5FF] pt-16 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Laptop className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-purple-900 mb-2">Invoice tidak ditemukan</h2>
            <p className="text-purple-500 text-sm mb-6">
              Buat booking terlebih dahulu untuk melihat invoice.
            </p>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-purple-700 text-white font-bold px-6 py-3 rounded-xl cursor-pointer hover:bg-purple-800 transition-colors"
            >
              Mulai Booking
            </Link>
          </div>
        </main>
      </>
    );
  }

  const info = KATEGORI_INFO[order.kategori];
  const tanggalAmbil = new Date(order.tanggalAmbil);

  const handleDownloadPDF = async () => {
    setLoading(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const margin = 20;
      let y = margin;

      doc.setFillColor(124, 58, 237);
      doc.rect(0, 0, 210, 35, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("SUHU LAPTOP LAMPUNG", 105, 15, { align: "center" });
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("SURAT PERJANJIAN SEWA MENYEWA", 105, 25, { align: "center" });
      y = 45;

      doc.setTextColor(30, 27, 75);
      doc.setFontSize(10);

      const addLine = (label: string, value: string) => {
        doc.setFont("helvetica", "bold");
        doc.text(label + ":", margin, y);
        doc.setFont("helvetica", "normal");
        doc.text(value, margin + 55, y);
        y += 7;
      };

      doc.setFont("helvetica", "bold");
      doc.text("DATA PENYEWA", margin, y);
      y += 2;
      doc.setDrawColor(124, 58, 237);
      doc.line(margin, y, 190, y);
      y += 6;

      addLine("Nama", order.nama);
      addLine("No. HP", order.noHp);
      addLine("Username IG", "@" + order.usernameIg);
      addLine("Profesi", order.profesi);
      addLine("Nama Instansi", order.namaInstansi);
      addLine("No. HP Darurat", order.noHpDarurat);
      y += 2;
      doc.setFont("helvetica", "bold");
      doc.text("Alamat:", margin, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      const alamatLines = doc.splitTextToSize(order.alamat, 150);
      doc.text(alamatLines, margin, y);
      y += alamatLines.length * 6 + 4;

      doc.line(margin, y, 190, y);
      y += 8;
      doc.setFont("helvetica", "bold");
      doc.text("DETAIL SEWA", margin, y);
      y += 2;
      doc.line(margin, y, 190, y);
      y += 6;

      addLine("Kategori", info.label + " (" + info.spek + ")");
      addLine("Durasi", order.durasi + " hari");
      addLine("Tanggal Ambil", formatTanggalShort(tanggalAmbil) + " pukul " + order.jamAmbil + " WIB");
      addLine("Bundling", "Laptop + Charger + Tas Laptop");
      addLine("Denda Telat", "Rp10.000/jam");
      y += 2;

      doc.setFillColor(124, 58, 237);
      doc.setTextColor(255, 255, 255);
      doc.roundedRect(margin, y, 170, 14, 3, 3, "F");
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("TOTAL BAYAR: " + formatRupiah(order.total), 105, y + 9, { align: "center" });
      y += 22;
      doc.setTextColor(30, 27, 75);
      doc.setFontSize(10);

      doc.setFont("helvetica", "bold");
      doc.text("DOKUMEN JAMINAN", margin, y);
      y += 2;
      doc.line(margin, y, 190, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      order.jaminan.forEach((j) => {
        const label = JAMINAN_OPTIONS.find((opt) => opt.id === j)?.label ?? j;
        doc.text("• " + label + " a/n " + order.nama, margin + 5, y);
        y += 6;
      });
      y += 4;

      if (order.ttdBase64) {
        doc.setFont("helvetica", "bold");
        doc.text("Tanda Tangan:", margin, y);
        y += 4;
        doc.addImage(order.ttdBase64, "PNG", margin, y, 60, 25);
        y += 28;
        doc.line(margin, y, margin + 60, y);
        y += 5;
        doc.text(order.nama, margin, y);
        y += 5;
        doc.text("Penyewa", margin, y);
      }

      const filename = `SuhuLaptop_${order.nama.replace(/\s+/g, "_")}_${tanggalAmbil.toISOString().split("T")[0]}.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error("PDF error:", err);
    }
    setLoading(false);
  };

  const pesanWA = buatPesanWA({
    nama: order.nama,
    kategori: info.label,
    durasi: order.durasi,
    tanggalAmbil: formatTanggalShort(tanggalAmbil),
    jamAmbil: order.jamAmbil,
    total: order.total,
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAF5FF] pt-16">
        <div className="max-w-xl mx-auto px-4 py-8">
          {/* Success header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-extrabold text-purple-900 mb-1">Invoice Berhasil Dibuat!</h1>
            <p className="text-purple-500 text-sm">Lakukan pembayaran dan kirim konfirmasi ke admin</p>
          </div>

          {/* Invoice card */}
          <div className="bg-white border-2 border-purple-200 rounded-2xl overflow-hidden mb-4">
            <div className="bg-gradient-to-r from-purple-700 to-purple-900 px-5 py-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-xs">Nomor Order</p>
                  <p className="font-mono font-bold text-sm">{order.id}</p>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Laptop className="w-5 h-5" />
                </div>
              </div>
            </div>
            <div className="p-5 flex flex-col gap-2.5">
              {[
                ["Penyewa", order.nama],
                ["No. HP", order.noHp],
                ["Laptop", info.label],
                ["Durasi", `${order.durasi} hari`],
                ["Tanggal Ambil", `${formatTanggalShort(tanggalAmbil)} · ${order.jamAmbil} WIB`],
                ["Jaminan", order.jaminan.map((j) => JAMINAN_OPTIONS.find((o) => o.id === j)?.label ?? j).join(", ")],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm gap-2">
                  <span className="text-purple-400 flex-shrink-0">{label}</span>
                  <span className="font-semibold text-purple-900 text-right">{value}</span>
                </div>
              ))}
              <div className="border-t-2 border-purple-100 pt-3 mt-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-purple-800">Total Bayar</span>
                  <span className="text-2xl font-extrabold text-purple-900">{formatRupiah(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* QRIS */}
          <div className="bg-white border-2 border-purple-200 rounded-2xl p-5 text-center mb-4">
            <p className="font-bold text-purple-800 mb-3">Scan QRIS untuk Bayar</p>
            <div className="w-48 h-48 bg-purple-50 border-2 border-dashed border-purple-300 rounded-xl flex items-center justify-center mx-auto mb-3">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-purple-400 text-xs font-medium">QRIS akan diisi</p>
                <p className="text-purple-400 text-xs">oleh pemilik</p>
              </div>
            </div>
            <div className="bg-purple-50 rounded-xl px-4 py-2 inline-block">
              <p className="text-purple-600 text-xs font-medium">Nominal Transfer</p>
              <p className="text-purple-900 font-bold text-xl">{formatRupiah(order.total)}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={handleDownloadPDF}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-800 disabled:opacity-60 text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-200 transition-all cursor-pointer"
            >
              <Download className="w-5 h-5" />
              Download Surat Perjanjian PDF
            </button>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${pesanWA}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-200 transition-all cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              Konfirmasi via WhatsApp
            </a>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
            <p className="text-amber-700 text-xs leading-relaxed text-center">
              Setelah transfer, kirim screenshot bukti bayar ke WhatsApp admin agar pesanan dikonfirmasi.
              Laptop baru bisa diambil setelah pembayaran dikonfirmasi admin.
            </p>
          </div>

          <div className="text-center">
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
