export type Kategori = "i3" | "i5" | "macbook";

const BASE_PRICE: Record<Kategori, number> = {
  i3: 149000,
  i5: 179000,
  macbook: 179000,
};

const PROMO_3_HARI: Record<Kategori, number> = {
  i3: 319000,
  i5: 379000,
  macbook: 379000,
};

export function hitungHarga(kategori: Kategori, durasi: number): number {
  if (durasi === 3) return PROMO_3_HARI[kategori];
  return BASE_PRICE[kategori] * durasi;
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export const DURASI_OPTIONS = [1, 2, 3, 4, 5, 7];

export const JAM_OPTIONS = [
  "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00",
];

export function hitungTanggalKembali(
  tanggalAmbil: Date,
  jamAmbil: string,
  durasi: number
): { tanggal: Date; jam: string } {
  const result = new Date(tanggalAmbil);
  result.setDate(result.getDate() + durasi);
  return { tanggal: result, jam: jamAmbil };
}

export function isWeekday(date: Date): boolean {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

export function formatTanggal(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatTanggalShort(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export const KATEGORI_INFO = {
  i3: {
    label: "Laptop i3",
    spek: "Intel i3, RAM 4–8GB, SSD",
    cocokUntuk: "Tugas kuliah, Office, Browsing",
    hargaPerHari: 149000,
    badge: null,
  },
  i5: {
    label: "Laptop i5",
    spek: "Intel i5, RAM 4–8GB, SSD",
    cocokUntuk: "Desain ringan, Multitasking, Presentasi",
    hargaPerHari: 179000,
    badge: "Terpopuler",
  },
  macbook: {
    label: "MacBook",
    spek: "Apple Silicon / i5, RAM 8GB+, SSD",
    cocokUntuk: "Creative work, macOS ecosystem",
    hargaPerHari: 179000,
    badge: null,
  },
} as const;

export const JAMINAN_OPTIONS = [
  { id: "ktp", label: "KTP" },
  { id: "sim_a", label: "SIM A" },
  { id: "sim_c", label: "SIM C" },
  { id: "stnk", label: "STNK" },
  { id: "passport", label: "Passport" },
] as const;

export const WA_NUMBER = "6282182702569";

export function buatPesanWA(data: {
  nama: string;
  kategori: string;
  durasi: number;
  tanggalAmbil: string;
  jamAmbil: string;
  total: number;
  metodeBayar?: "full" | "dp";
  dpBayar?: number;
}): string {
  const isDP = data.metodeBayar === "dp" && data.dpBayar !== undefined;
  const bayarLine = isDP
    ? `DP Dibayar : ${formatRupiah(data.dpBayar!)} (50%)\nPelunasan  : ${formatRupiah(data.total - data.dpBayar!)} (dibayar di tempat saat ambil)`
    : `Total      : ${formatRupiah(data.total)}`;

  const msg = `Halo Admin Suhu Laptop, saya sudah melakukan ${isDP ? "pembayaran DP" : "pembayaran"} sewa laptop.

Nama      : ${data.nama}
Kategori  : ${data.kategori}
Durasi    : ${data.durasi} hari
Tgl ambil : ${data.tanggalAmbil} pukul ${data.jamAmbil} WIB
${bayarLine}

(Lampirkan screenshot bukti transfer${isDP ? " DP" : ""})`;
  return encodeURIComponent(msg);
}
