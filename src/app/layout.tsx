import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Suhu Laptop | Sewa Laptop Lampung – Sewa Tanpa Ribet",
  description:
    "Sewa laptop di Bandar Lampung. Tersedia Laptop i3, i5, dan MacBook. Proses booking online mudah, tanpa ribet via WhatsApp. Harga mulai Rp149.000/hari.",
  keywords: "sewa laptop lampung, rental laptop bandar lampung, sewa laptop murah",
  icons: {
    icon: "/favicon-rounded.png",
    apple: "/favicon-rounded.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
