"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { WA_NUMBER } from "@/lib/pricing";
import { Menu, X, MessageCircle } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-lg shadow-purple-100/50 border-b border-purple-100"
          : "bg-white shadow-sm border-b border-purple-100"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <Image src="/logo.jpg" alt="Suhu Laptop" width={44} height={44} className="h-11 w-11 object-cover rounded-2xl shadow-sm" priority />
            <div className="flex flex-col justify-center gap-0.5">
              <span className="font-extrabold text-xl text-purple-900 leading-tight tracking-tight">Suhu Laptop</span>
              <span className="text-[11px] text-purple-400 font-semibold leading-tight tracking-wide uppercase">Sewa Tanpa Ribet</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-purple-700 hover:text-purple-900 transition-colors cursor-pointer px-3 py-2 rounded-lg hover:bg-purple-50"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WA Admin</span>
            </a>
            <Link
              href="/booking"
              className="flex items-center gap-2 bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-800 hover:to-purple-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-purple-200 transition-all duration-200 cursor-pointer hover:shadow-purple-300 hover:-translate-y-0.5"
            >
              Sewa Sekarang
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer"
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 pt-2 border-t border-purple-100 bg-white/95 backdrop-blur-md rounded-b-2xl shadow-lg">
            <div className="flex flex-col gap-2 px-2">
              <a
                href={`https://wa.me/${WA_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-sm font-medium text-purple-700 px-4 py-3 rounded-xl hover:bg-purple-50 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WA Admin</span>
              </a>
              <Link
                href="/booking"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center bg-gradient-to-r from-purple-700 to-purple-600 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Sewa Sekarang
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
