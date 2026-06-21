"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import {
  KATEGORI_INFO, DURASI_OPTIONS, JAM_OPTIONS, hitungHarga, formatRupiah,
  formatTanggal, formatTanggalShort, hitungTanggalKembali, isWeekday, JAMINAN_OPTIONS,
  WA_NUMBER, buatPesanWA
} from "@/lib/pricing";
import type { Kategori } from "@/lib/pricing";
import {
  Laptop, Monitor, CheckCircle, ChevronLeft, ChevronRight,
  AlertCircle, Pen, Trash2, Calendar, Clock, Package, User,
  FileText, CreditCard, MessageCircle, Download, Shield
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────
interface BookingData {
  kategori: Kategori | null;
  tanggalAmbil: Date | null;
  jamAmbil: string;
  durasi: number;
  nama: string;
  noHp: string;
  usernameIg: string;
  alamat: string;
  noHpDarurat: string;
  profesi: string;
  namaInstansi: string;
  jaminan: string[];
  ttdBase64: string;
  setuju: boolean;
}

const STEP_LABELS = [
  "Kategori",
  "Jadwal",
  "Harga",
  "Data Diri",
  "TTD",
  "Invoice",
];

const STEP_ICONS = [Laptop, Calendar, CreditCard, User, Pen, FileText];

// ── Step indicator ─────────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="w-full px-4 py-4">
      <div className="flex items-center justify-center gap-1 sm:gap-2 max-w-xl mx-auto">
        {STEP_LABELS.map((label, i) => {
          const Icon = STEP_ICONS[i];
          const isDone = i < current;
          const isActive = i === current;
          return (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isDone
                      ? "bg-green-500 shadow-md shadow-green-200"
                      : isActive
                      ? "bg-gradient-to-br from-purple-600 to-purple-800 shadow-lg shadow-purple-200"
                      : "bg-purple-100 text-purple-400"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  ) : (
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? "text-white" : "text-purple-400"}`} />
                  )}
                </div>
                <span className={`text-[10px] font-semibold hidden sm:block ${
                  isActive ? "text-purple-700" : isDone ? "text-green-600" : "text-purple-300"
                }`}>
                  {label}
                </span>
              </div>
              {i < total - 1 && (
                <div className={`w-6 sm:w-10 h-0.5 mx-1 transition-all duration-500 ${
                  i < current ? "bg-green-400" : "bg-purple-100"
                }`} />
              )}
            </div>
          );
        })}
      </div>
      <p className="text-center text-xs text-purple-400 mt-2 sm:hidden">
        Step {current + 1}/{total}: {STEP_LABELS[current]}
      </p>
    </div>
  );
}

// ── STEP 1: Pilih Kategori ─────────────────────────────────────
function Step1({ data, setData }: { data: BookingData; setData: (d: BookingData) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-extrabold text-purple-900 mb-1">Pilih Kategori Laptop</h2>
        <p className="text-purple-500 text-sm">Setiap paket termasuk laptop, charger, dan tas</p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {(Object.keys(KATEGORI_INFO) as Kategori[]).map((id) => {
          const info = KATEGORI_INFO[id];
          const selected = data.kategori === id;
          const isUnavailable = id === "macbook";
          return (
            <button
              key={id}
              onClick={() => !isUnavailable && setData({ ...data, kategori: id })}
              disabled={isUnavailable}
              className={`w-full text-left rounded-2xl p-5 border-2 transition-all duration-200 ${
                isUnavailable
                  ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                  : selected
                  ? "border-purple-600 bg-purple-50 shadow-lg shadow-purple-100 cursor-pointer"
                  : "border-purple-100 bg-white hover:border-purple-300 hover:bg-purple-50/50 cursor-pointer"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isUnavailable ? "bg-gray-200" : selected ? "bg-purple-600" : "bg-purple-100"
                }`}>
                  <Monitor className={`w-6 h-6 ${isUnavailable ? "text-gray-400" : selected ? "text-white" : "text-purple-600"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`font-bold ${isUnavailable ? "text-gray-400" : "text-purple-900"}`}>{info.label}</span>
                    {info.badge && !isUnavailable && (
                      <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
                        {info.badge}
                      </span>
                    )}
                    {isUnavailable && (
                      <span className="bg-red-100 text-red-400 text-xs font-bold px-2 py-0.5 rounded-full">
                        Full Rent
                      </span>
                    )}
                  </div>
                  <p className={`text-xs mb-2 ${isUnavailable ? "text-gray-400" : "text-purple-500"}`}>{info.spek}</p>
                  <p className={`text-sm ${isUnavailable ? "text-gray-400" : "text-purple-700"}`}>{isUnavailable ? "Sedang tidak tersedia — semua unit sedang disewa" : info.cocokUntuk}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-xs ${isUnavailable ? "text-gray-400" : "text-purple-400"}`}>mulai</p>
                  <p className={`font-bold text-lg ${isUnavailable ? "text-gray-400" : selected ? "text-purple-700" : "text-purple-900"}`}>
                    {formatRupiah(info.hargaPerHari)}
                  </p>
                  <p className={`text-xs ${isUnavailable ? "text-gray-400" : "text-purple-400"}`}>/hari</p>
                </div>
              </div>
              {selected && !isUnavailable && (
                <div className="mt-3 flex items-center gap-2 text-purple-600 text-sm font-semibold">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Dipilih
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── STEP 2: Pilih Jadwal ───────────────────────────────────────
function Step2({ data, setData }: { data: BookingData; setData: (d: BookingData) => void }) {
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() + 1);

  // Find next valid weekday
  while (!isWeekday(minDate)) {
    minDate.setDate(minDate.getDate() + 1);
  }

  const minDateStr = minDate.toISOString().split("T")[0];

  const handleDateChange = (val: string) => {
    const d = new Date(val + "T00:00:00");
    if (!isWeekday(d)) {
      return;
    }
    setData({ ...data, tanggalAmbil: d });
  };

  const tanggalKembali = data.tanggalAmbil && data.jamAmbil && data.durasi
    ? hitungTanggalKembali(data.tanggalAmbil, data.jamAmbil, data.durasi)
    : null;

  const returnIsWeekend = tanggalKembali && !isWeekday(tanggalKembali.tanggal);

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-extrabold text-purple-900 mb-1">Atur Jadwal Sewa</h2>
        <p className="text-purple-500 text-sm">Pilih tanggal, jam ambil, dan durasi sewa</p>
      </div>

      {/* Tanggal */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-purple-800 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Tanggal Ambil <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          min={minDateStr}
          value={data.tanggalAmbil ? data.tanggalAmbil.toISOString().split("T")[0] : ""}
          onChange={(e) => handleDateChange(e.target.value)}
          className="w-full border-2 border-purple-200 rounded-xl px-4 py-3 text-purple-900 focus:outline-none focus:border-purple-500 bg-white font-medium cursor-pointer"
        />
        <p className="text-xs text-purple-400">
          Hanya Senin–Jumat. Minimal H+1 dari hari ini.
        </p>
        {data.tanggalAmbil && !isWeekday(data.tanggalAmbil) && (
          <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 p-3 rounded-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            Hari libur/akhir pekan tidak tersedia. Pilih Senin–Jumat.
          </div>
        )}
      </div>

      {/* Jam */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-purple-800 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Jam Ambil <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-4 gap-2">
          {JAM_OPTIONS.map((jam) => (
            <button
              key={jam}
              onClick={() => setData({ ...data, jamAmbil: jam })}
              className={`py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border-2 ${
                data.jamAmbil === jam
                  ? "bg-purple-600 text-white border-purple-600 shadow-md"
                  : "bg-white text-purple-700 border-purple-100 hover:border-purple-300"
              }`}
            >
              {jam}
            </button>
          ))}
        </div>
      </div>

      {/* Durasi */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-purple-800">
          Durasi Sewa <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {DURASI_OPTIONS.map((d) => {
            const isPromo = d === 3;
            return (
              <button
                key={d}
                onClick={() => setData({ ...data, durasi: d })}
                className={`flex flex-col items-center py-3 rounded-xl transition-all cursor-pointer border-2 relative ${
                  data.durasi === d
                    ? "bg-purple-600 text-white border-purple-600 shadow-md"
                    : "bg-white text-purple-700 border-purple-100 hover:border-purple-300"
                }`}
              >
                {isPromo && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap">
                    PROMO
                  </span>
                )}
                <span className="text-lg font-bold">{d}</span>
                <span className="text-xs opacity-75">hari</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Return date preview */}
      {tanggalKembali && (
        <div className={`rounded-2xl p-4 border-2 ${
          returnIsWeekend ? "bg-orange-50 border-orange-200" : "bg-green-50 border-green-200"
        }`}>
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              returnIsWeekend ? "bg-orange-100" : "bg-green-100"
            }`}>
              {returnIsWeekend ? (
                <AlertCircle className="w-4 h-4 text-orange-600" />
              ) : (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </div>
            <div>
              <p className={`font-semibold text-sm ${returnIsWeekend ? "text-orange-800" : "text-green-800"}`}>
                Pengembalian: {formatTanggalShort(tanggalKembali.tanggal)} pukul {tanggalKembali.jam} WIB
              </p>
              {returnIsWeekend && (
                <p className="text-orange-600 text-xs mt-1">
                  Hari kembali jatuh di akhir pekan. Pastikan koordinasi dengan admin.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── STEP 3: Summary Harga ──────────────────────────────────────
function Step3({ data }: { data: BookingData }) {
  if (!data.kategori || !data.tanggalAmbil) return null;
  const info = KATEGORI_INFO[data.kategori];
  const total = hitungHarga(data.kategori, data.durasi);
  const isPromo = data.durasi === 3;
  const tanggalKembali = hitungTanggalKembali(data.tanggalAmbil, data.jamAmbil, data.durasi);

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-extrabold text-purple-900 mb-1">Ringkasan Pesanan</h2>
        <p className="text-purple-500 text-sm">Cek kembali detail sewa kamu</p>
      </div>

      {/* Laptop card */}
      <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            {data.kategori === "macbook" ? <Monitor className="w-6 h-6" /> : <Laptop className="w-6 h-6" />}
          </div>
          <div>
            <p className="font-bold text-lg">{info.label}</p>
            <p className="text-purple-200 text-xs">{info.spek}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-purple-200 text-xs mb-1">Tanggal Ambil</p>
            <p className="font-semibold text-sm">{formatTanggalShort(data.tanggalAmbil)} · {data.jamAmbil} WIB</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-purple-200 text-xs mb-1">Tanggal Kembali</p>
            <p className="font-semibold text-sm">{formatTanggalShort(tanggalKembali.tanggal)} · {tanggalKembali.jam} WIB</p>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-purple-200 text-xs mb-1">Durasi Sewa</p>
          <p className="font-semibold">{data.durasi} hari{isPromo ? " (Harga Promo!)" : ""}</p>
        </div>
      </div>

      {/* Bundling */}
      <div className="bg-white border-2 border-purple-100 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-4 h-4 text-purple-600" />
          <p className="font-semibold text-purple-800 text-sm">Termasuk dalam paket:</p>
        </div>
        <div className="flex gap-4">
          {["Laptop", "Charger", "Tas laptop"].map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-purple-700 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-purple-700 font-medium">Total Pembayaran</p>
          {isPromo && (
            <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-lg">PROMO 3 HARI</span>
          )}
        </div>
        <p className="text-3xl font-extrabold text-purple-900">{formatRupiah(total)}</p>
        <p className="text-purple-500 text-xs mt-1">Bayar via QRIS setelah invoice dibuat</p>
      </div>

      {/* Denda info */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
        <p className="text-orange-700 text-xs leading-relaxed">
          <strong>Denda keterlambatan: Rp10.000/jam.</strong> Harap kembalikan laptop tepat waktu sesuai jadwal di atas.
        </p>
      </div>
    </div>
  );
}

// ── STEP 4: Form Data ──────────────────────────────────────────
function Step4({ data, setData }: { data: BookingData; setData: (d: BookingData) => void }) {
  const toggleJaminan = (id: string) => {
    const cur = data.jaminan;
    setData({
      ...data,
      jaminan: cur.includes(id) ? cur.filter((j) => j !== id) : [...cur, id],
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-extrabold text-purple-900 mb-1">Data Penyewa</h2>
        <p className="text-purple-500 text-sm">Lengkapi semua data dengan benar</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Nama */}
        <div>
          <label className="block text-sm font-semibold text-purple-800 mb-1.5">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.nama}
            onChange={(e) => setData({ ...data, nama: e.target.value })}
            placeholder="Nama sesuai KTP"
            className="w-full border-2 border-purple-200 rounded-xl px-4 py-3 text-purple-900 placeholder-purple-300 focus:outline-none focus:border-purple-500 bg-white"
          />
        </div>

        {/* No HP */}
        <div>
          <label className="block text-sm font-semibold text-purple-800 mb-1.5">
            No. HP <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            inputMode="numeric"
            value={data.noHp}
            onChange={(e) => setData({ ...data, noHp: e.target.value })}
            placeholder="08xx atau +62xx"
            className="w-full border-2 border-purple-200 rounded-xl px-4 py-3 text-purple-900 placeholder-purple-300 focus:outline-none focus:border-purple-500 bg-white"
          />
        </div>

        {/* Username IG */}
        <div>
          <label className="block text-sm font-semibold text-purple-800 mb-1.5">
            Username Instagram <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <span className="bg-purple-100 border-2 border-r-0 border-purple-200 rounded-l-xl px-3 py-3 text-purple-500 font-medium">@</span>
            <input
              type="text"
              value={data.usernameIg}
              onChange={(e) => setData({ ...data, usernameIg: e.target.value })}
              placeholder="username_kamu"
              className="flex-1 border-2 border-purple-200 rounded-r-xl px-4 py-3 text-purple-900 placeholder-purple-300 focus:outline-none focus:border-purple-500 bg-white"
            />
          </div>
        </div>

        {/* Alamat */}
        <div>
          <label className="block text-sm font-semibold text-purple-800 mb-1.5">
            Alamat Rumah <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={data.alamat}
            onChange={(e) => setData({ ...data, alamat: e.target.value })}
            placeholder="Jl. Contoh No.1, Kelurahan, Kecamatan, Bandar Lampung"
            className="w-full border-2 border-purple-200 rounded-xl px-4 py-3 text-purple-900 placeholder-purple-300 focus:outline-none focus:border-purple-500 bg-white resize-none"
          />
        </div>

        {/* No HP Darurat */}
        <div>
          <label className="block text-sm font-semibold text-purple-800 mb-1.5">
            No. HP Darurat (orang tua/keluarga) <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            inputMode="numeric"
            value={data.noHpDarurat}
            onChange={(e) => setData({ ...data, noHpDarurat: e.target.value })}
            placeholder="08xx atau +62xx"
            className="w-full border-2 border-purple-200 rounded-xl px-4 py-3 text-purple-900 placeholder-purple-300 focus:outline-none focus:border-purple-500 bg-white"
          />
        </div>

        {/* Profesi */}
        <div>
          <label className="block text-sm font-semibold text-purple-800 mb-1.5">
            Profesi <span className="text-red-500">*</span>
          </label>
          <select
            value={data.profesi}
            onChange={(e) => setData({ ...data, profesi: e.target.value })}
            className="w-full border-2 border-purple-200 rounded-xl px-4 py-3 text-purple-900 focus:outline-none focus:border-purple-500 bg-white cursor-pointer appearance-none"
          >
            <option value="">-- Pilih profesi --</option>
            <option value="Mahasiswa">Mahasiswa</option>
            <option value="Karyawan">Karyawan</option>
            <option value="Guru">Guru</option>
          </select>
        </div>

        {/* Nama Instansi */}
        <div>
          <label className="block text-sm font-semibold text-purple-800 mb-1.5">
            Nama Instansi / Kampus / Kantor <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.namaInstansi}
            onChange={(e) => setData({ ...data, namaInstansi: e.target.value })}
            placeholder="Misal: Universitas Lampung, PT ABC, SMA Negeri 1..."
            className="w-full border-2 border-purple-200 rounded-xl px-4 py-3 text-purple-900 placeholder-purple-300 focus:outline-none focus:border-purple-500 bg-white"
          />
        </div>
      </div>

      {/* Jaminan */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-purple-800 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Dokumen Jaminan <span className="text-red-500">*</span>
          </label>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
            data.jaminan.length >= 2 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
          }`}>
            {data.jaminan.length}/2 min
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
          {JAMINAN_OPTIONS.map((j) => {
            const checked = data.jaminan.includes(j.id);
            return (
              <button
                key={j.id}
                onClick={() => toggleJaminan(j.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all cursor-pointer ${
                  checked
                    ? "border-purple-500 bg-purple-50 text-purple-800"
                    : "border-purple-100 bg-white text-purple-600 hover:border-purple-300"
                }`}
              >
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  checked ? "border-purple-500 bg-purple-500" : "border-purple-300"
                }`}>
                  {checked && <CheckCircle className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm font-semibold">{j.label}</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-purple-500 bg-purple-50 p-3 rounded-xl">
          Dokumen asli diserahkan saat pengambilan di outlet Sukarame. Semua dokumen harus atas nama kamu sendiri.
        </p>
      </div>
    </div>
  );
}

// ── STEP 5: TTD Digital ────────────────────────────────────────
function Step5({ data, setData }: { data: BookingData; setData: (d: BookingData) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getPos(e);
    if (!pos) return;
    setIsDrawing(true);
    lastPos.current = pos;
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const pos = getPos(e);
    if (!pos || !lastPos.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "#4c1d95";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
    setHasDrawn(true);
  };

  const endDraw = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    lastPos.current = null;
    const canvas = canvasRef.current;
    if (canvas && hasDrawn) {
      setData({ ...data, ttdBase64: canvas.toDataURL() });
    }
  }, [isDrawing, hasDrawn, data, setData]);

  useEffect(() => {
    window.addEventListener("mouseup", endDraw);
    window.addEventListener("touchend", endDraw);
    return () => {
      window.removeEventListener("mouseup", endDraw);
      window.removeEventListener("touchend", endDraw);
    };
  }, [endDraw]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setData({ ...data, ttdBase64: "" });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-extrabold text-purple-900 mb-1">Tanda Tangan Digital</h2>
        <p className="text-purple-500 text-sm">Tanda tangani menggunakan jari atau mouse</p>
      </div>

      {/* Canvas */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-purple-800 flex items-center gap-2">
            <Pen className="w-4 h-4" />
            Area Tanda Tangan <span className="text-red-500">*</span>
          </label>
          {hasDrawn && (
            <button
              onClick={clearCanvas}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors cursor-pointer bg-red-50 px-3 py-1.5 rounded-lg"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Hapus TTD
            </button>
          )}
        </div>
        <div className={`rounded-2xl border-2 overflow-hidden ${
          hasDrawn ? "border-purple-400" : "border-purple-200 border-dashed"
        }`}>
          <canvas
            ref={canvasRef}
            width={600}
            height={200}
            className="w-full cursor-crosshair bg-white block"
            onMouseDown={startDraw}
            onMouseMove={draw}
            onTouchStart={startDraw}
            onTouchMove={draw}
          />
        </div>
        {!hasDrawn && (
          <p className="text-xs text-purple-400 text-center">
            Mulai tanda tangan di area di atas
          </p>
        )}
        {hasDrawn && (
          <p className="text-xs text-green-600 font-medium flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            Tanda tangan berhasil direkam
          </p>
        )}
      </div>

      {/* Persetujuan */}
      <div className={`rounded-2xl border-2 p-4 transition-all ${
        data.setuju ? "border-green-300 bg-green-50" : "border-purple-200 bg-purple-50"
      }`}>
        <button
          onClick={() => setData({ ...data, setuju: !data.setuju })}
          className="flex items-start gap-3 w-full text-left cursor-pointer"
        >
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
            data.setuju ? "border-green-500 bg-green-500" : "border-purple-400 bg-white"
          }`}>
            {data.setuju && <CheckCircle className="w-3.5 h-3.5 text-white" />}
          </div>
          <p className="text-sm text-purple-800 leading-relaxed">
            Saya telah membaca dan menyetujui seluruh{" "}
            <Link
              href="/ketentuan"
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="text-purple-600 font-semibold underline hover:text-purple-800 cursor-pointer"
            >
              Ketentuan Sewa Suhu Laptop
            </Link>
            , termasuk kebijakan denda, jaminan, dan pembayaran.
          </p>
        </button>
      </div>
    </div>
  );
}

// ── STEP 6: Invoice ────────────────────────────────────────────
function Step6({ data }: { data: BookingData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!data.kategori || !data.tanggalAmbil) return null;

  const info = KATEGORI_INFO[data.kategori];
  const total = hitungHarga(data.kategori, data.durasi);
  const tanggalKembali = hitungTanggalKembali(data.tanggalAmbil, data.jamAmbil, data.durasi);

  const handleSaveAndWA = async () => {
    setLoading(true);
    try {
      const tanggalKembaliObj = hitungTanggalKembali(data.tanggalAmbil!, data.jamAmbil, data.durasi);

      const { data: inserted, error } = await supabase.from("orders").insert({
        nama: data.nama,
        no_hp: data.noHp,
        username_ig: data.usernameIg,
        profesi: data.profesi,
        nama_instansi: data.namaInstansi,
        alamat: data.alamat,
        no_hp_darurat: data.noHpDarurat,
        kategori: data.kategori,
        tanggal_ambil: data.tanggalAmbil!.toISOString().split("T")[0],
        jam_ambil: data.jamAmbil + ":00",
        durasi_hari: data.durasi,
        tanggal_kembali: tanggalKembaliObj.tanggal.toISOString().split("T")[0],
        jam_kembali: tanggalKembaliObj.jam + ":00",
        jaminan: data.jaminan,
        total_bayar: total,
        status: "pending",
        ttd_base64: data.ttdBase64 || null,
      }).select("id").single();

      if (error) throw error;

      // Also cache locally for invoice page
      const orderDraft = {
        id: inserted.id,
        ...data,
        tanggalAmbil: data.tanggalAmbil?.toISOString(),
        total,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("suhu_order_draft", JSON.stringify(orderDraft));
    } catch (err) {
      console.error("Save order error:", err);
      // Fallback: still save locally so user isn't stuck
      localStorage.setItem("suhu_order_draft", JSON.stringify({
        ...data,
        tanggalAmbil: data.tanggalAmbil?.toISOString(),
        total,
        id: `SL-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }));
    }

    const pesanWA = buatPesanWA({
      nama: data.nama,
      kategori: info.label,
      durasi: data.durasi,
      tanggalAmbil: formatTanggalShort(data.tanggalAmbil!),
      jamAmbil: data.jamAmbil,
      total,
    });

    window.open(`https://wa.me/${WA_NUMBER}?text=${pesanWA}`, "_blank");
    setLoading(false);
  };

  const handleDownloadPDF = async () => {
    setLoading(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const margin = 18;
      const pageW = 210;
      const contentW = pageW - margin * 2;
      let y = margin;

      // ── Header ──────────────────────────────────────────────
      doc.setFillColor(109, 40, 217);
      doc.rect(0, 0, pageW, 38, "F");

      // Logo
      try {
        const logoRes = await fetch("/logo.jpg");
        const logoBlob = await logoRes.blob();
        const logoB64 = await new Promise<string>((res) => {
          const reader = new FileReader();
          reader.onloadend = () => res(reader.result as string);
          reader.readAsDataURL(logoBlob);
        });
        doc.addImage(logoB64, "JPEG", margin, 5, 28, 28);
        // Title beside logo
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(15);
        doc.setFont("helvetica", "bold");
        doc.text("SUHU LAPTOP LAMPUNG", margin + 32, 17);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("SURAT PERJANJIAN SEWA MENYEWA", margin + 32, 25);
      } catch {
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(15);
        doc.setFont("helvetica", "bold");
        doc.text("SUHU LAPTOP LAMPUNG", 105, 16, { align: "center" });
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("SURAT PERJANJIAN SEWA MENYEWA", 105, 24, { align: "center" });
      }
      y = 46;

      doc.setTextColor(20, 14, 60);
      doc.setDrawColor(109, 40, 217);

      const addSection = (title: string) => {
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text(title, margin, y);
        y += 2;
        doc.setLineWidth(0.4);
        doc.line(margin, y, margin + contentW, y);
        y += 5;
      };

      const addLine = (label: string, value: string) => {
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text(label + ":", margin, y);
        doc.setFont("helvetica", "normal");
        doc.text(value, margin + 48, y);
        y += 6;
      };

      // ── Data Penyewa ─────────────────────────────────────────
      addSection("DATA PENYEWA");
      addLine("Nama", data.nama);
      addLine("No. HP", data.noHp);
      addLine("Username IG", "@" + data.usernameIg);
      addLine("Profesi", data.profesi);
      addLine("Nama Instansi", data.namaInstansi);
      addLine("No. HP Darurat", data.noHpDarurat);

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Alamat:", margin, y);
      doc.setFont("helvetica", "normal");
      const alamatLines = doc.splitTextToSize(data.alamat, contentW - 48);
      doc.text(alamatLines, margin + 48, y);
      y += Math.max(alamatLines.length * 5, 5) + 4;

      doc.setLineWidth(0.2);
      doc.setDrawColor(200, 190, 230);
      doc.line(margin, y, margin + contentW, y);
      y += 6;

      // ── Detail Sewa ──────────────────────────────────────────
      doc.setDrawColor(109, 40, 217);
      addSection("DETAIL SEWA");
      addLine("Kategori", info.label + " (" + info.spek + ")");
      addLine("Durasi", data.durasi + " hari");
      addLine("Tanggal Ambil", formatTanggalShort(data.tanggalAmbil!) + " pukul " + data.jamAmbil + " WIB");
      addLine("Tanggal Kembali", formatTanggalShort(tanggalKembali.tanggal) + " pukul " + tanggalKembali.jam + " WIB");
      addLine("Bundling", "Laptop + Charger + Tas Laptop");
      addLine("Denda Telat", "Rp10.000/jam");
      y += 1;

      // Total bayar box
      doc.setFillColor(109, 40, 217);
      doc.setTextColor(255, 255, 255);
      doc.roundedRect(margin, y, contentW, 12, 2, 2, "F");
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("TOTAL BAYAR: " + formatRupiah(total), 105, y + 8, { align: "center" });
      y += 18;
      doc.setTextColor(20, 14, 60);

      // ── Dokumen Jaminan ──────────────────────────────────────
      addSection("DOKUMEN JAMINAN");
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      data.jaminan.forEach((j) => {
        const label = JAMINAN_OPTIONS.find((opt) => opt.id === j)?.label ?? j;
        doc.text("• " + label + " a/n " + data.nama, margin + 4, y);
        y += 5;
      });
      y += 3;

      // ── Ketentuan ────────────────────────────────────────────
      addSection("KETENTUAN");
      const ketentuan = [
        "1. Penyewa bertanggung jawab menjaga barang sewaan. Denda keterlambatan Rp10.000/jam.",
        "2. Kerusakan selama sewa ditanggung penyewa.",
        "3. Laptop hilang wajib diganti laptop spesifikasi setara harga pasaran.",
        "4. Tidak dapat dihubungi 1x24 jam = lapor kepolisian.",
        "5. No refund setelah pembayaran dikonfirmasi.",
      ];
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      ketentuan.forEach((k) => {
        const lines = doc.splitTextToSize(k, contentW);
        doc.text(lines, margin, y);
        y += lines.length * 4.5 + 1.5;
      });
      y += 5;

      // ── TTD ──────────────────────────────────────────────────
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Bandar Lampung, " + formatTanggalShort(new Date()), margin, y);
      y += 5;

      if (data.ttdBase64) {
        doc.addImage(data.ttdBase64, "PNG", margin, y, 55, 28);
        y += 30;
      } else {
        y += 30;
      }

      doc.setLineWidth(0.4);
      doc.setDrawColor(20, 14, 60);
      doc.line(margin, y, margin + 55, y);
      y += 5;
      doc.setFont("helvetica", "bold");
      doc.text(data.nama, margin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.text("Penyewa", margin, y);

      const filename = `SuhuLaptop_${data.nama.replace(/\s+/g, "_")}_${data.tanggalAmbil?.toISOString().split("T")[0]}.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error("PDF error:", err);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center mb-2">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-extrabold text-purple-900 mb-1">Invoice & Pembayaran</h2>
        <p className="text-purple-500 text-sm">Simpan invoice & transfer sesuai nominal</p>
      </div>

      {/* Invoice summary */}
      <div className="bg-white border-2 border-purple-200 rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-700 to-purple-900 px-5 py-4 text-white">
          <p className="text-purple-200 text-xs">Nomor Order</p>
          <p className="font-mono font-bold text-sm">SL-{Date.now().toString().slice(-8)}</p>
        </div>
        <div className="p-5 flex flex-col gap-3">
          <div className="flex justify-between text-sm">
            <span className="text-purple-500">Penyewa</span>
            <span className="font-semibold text-purple-900">{data.nama}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-purple-500">Laptop</span>
            <span className="font-semibold text-purple-900">{info.label}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-purple-500">Durasi</span>
            <span className="font-semibold text-purple-900">{data.durasi} hari</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-purple-500">Ambil</span>
            <span className="font-semibold text-purple-900">{formatTanggalShort(data.tanggalAmbil!)} · {data.jamAmbil} WIB</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-purple-500">Kembali</span>
            <span className="font-semibold text-purple-900">{formatTanggalShort(tanggalKembali.tanggal)} · {tanggalKembali.jam} WIB</span>
          </div>
          <div className="border-t-2 border-purple-100 pt-3 mt-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-purple-800">Total Bayar</span>
              <span className="text-2xl font-extrabold text-purple-900">{formatRupiah(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* QRIS */}
      <div className="bg-white border-2 border-purple-200 rounded-2xl p-5 text-center">
        <p className="font-bold text-purple-800 mb-1">Scan QRIS untuk Bayar</p>
        <p className="text-purple-400 text-xs mb-4">Screenshot lalu buka aplikasi dompet digital / m-banking</p>
        <div className="flex justify-center mb-4">
          <img src="/qris.jpg" alt="QRIS Suhu Laptop" className="w-56 h-56 object-contain rounded-xl border border-purple-100 shadow-sm" />
        </div>
        <div className="bg-purple-50 rounded-xl px-4 py-3 inline-block">
          <p className="text-purple-600 text-xs font-medium mb-0.5">Nominal Transfer</p>
          <p className="text-purple-900 font-bold text-2xl">{formatRupiah(total)}</p>
        </div>
        <p className="text-xs text-purple-400 mt-3">Setelah bayar, kirim bukti ke WhatsApp admin</p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleDownloadPDF}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-800 disabled:opacity-60 text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-200 transition-all cursor-pointer"
        >
          <Download className="w-5 h-5" />
          Download Surat Perjanjian PDF
        </button>
        <button
          onClick={handleSaveAndWA}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-200 transition-all cursor-pointer"
        >
          <MessageCircle className="w-5 h-5" />
          Konfirmasi via WhatsApp
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <p className="text-amber-700 text-xs leading-relaxed text-center">
          Setelah transfer, kirim screenshot bukti bayar ke WhatsApp admin agar pesanan dikonfirmasi.
          Laptop baru bisa diambil setelah pembayaran dikonfirmasi admin.
        </p>
      </div>
    </div>
  );
}

// ── Main Booking Page ─────────────────────────────────────────
export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<BookingData>({
    kategori: null,
    tanggalAmbil: null,
    jamAmbil: "",
    durasi: 1,
    nama: "",
    noHp: "",
    usernameIg: "",
    alamat: "",
    noHpDarurat: "",
    profesi: "",
    namaInstansi: "",
    jaminan: [],
    ttdBase64: "",
    setuju: false,
  });

  const canNext = (): boolean => {
    switch (step) {
      case 0: return !!data.kategori;
      case 1:
        return !!data.tanggalAmbil && isWeekday(data.tanggalAmbil) && !!data.jamAmbil && !!data.durasi;
      case 2: return true;
      case 3:
        return !!(
          data.nama && data.noHp && data.usernameIg &&
          data.alamat && data.noHpDarurat && data.profesi &&
          data.namaInstansi && data.jaminan.length >= 2
        );
      case 4: return !!(data.ttdBase64 && data.setuju);
      default: return false;
    }
  };

  const next = () => {
    if (canNext() && step < 5) setStep(step + 1);
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 0: return <Step1 data={data} setData={setData} />;
      case 1: return <Step2 data={data} setData={setData} />;
      case 2: return <Step3 data={data} />;
      case 3: return <Step4 data={data} setData={setData} />;
      case 4: return <Step5 data={data} setData={setData} />;
      case 5: return <Step6 data={data} />;
      default: return null;
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAF5FF] pt-16">
        {/* Step indicator */}
        <div className="bg-white border-b border-purple-100 sticky top-16 z-40">
          <StepIndicator current={step} total={6} />
        </div>

        {/* Content */}
        <div className="max-w-xl mx-auto px-4 py-6">
          <div className="bg-white rounded-3xl shadow-sm border border-purple-100 p-5 sm:p-7">
            {renderStep()}

            {/* Navigation buttons */}
            {step < 5 && (
              <div className={`flex gap-3 mt-8 ${step > 0 ? "justify-between" : "justify-end"}`}>
                {step > 0 && (
                  <button
                    onClick={prev}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-purple-200 text-purple-700 font-semibold hover:bg-purple-50 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Kembali
                  </button>
                )}
                <button
                  onClick={next}
                  disabled={!canNext()}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all cursor-pointer ${
                    canNext()
                      ? "bg-purple-700 hover:bg-purple-800 text-white shadow-lg shadow-purple-200 hover:-translate-y-0.5"
                      : "bg-purple-200 text-purple-400 cursor-not-allowed"
                  }`}
                >
                  {step === 4 ? "Generate Invoice" : "Lanjut"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
