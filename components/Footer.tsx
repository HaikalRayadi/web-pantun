"use client";

import { Cpu } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative w-full bg-black py-12 px-6 md:px-12 text-zinc-500 font-mono text-[10px]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        
        {/* Left: Branding */}
        <div className="flex items-center gap-2">
          <Cpu className="h-4.5 w-4.5 text-white" />
          <span className="tracking-[0.2em] text-zinc-300">
            INDO<span className="text-zinc-500 font-light">BERT</span> PANTUN MELAYU
          </span>
        </div>

        {/* Middle: Credits */}
        <div className="text-center md:text-left font-light">
          © {new Date().getFullYear()} PROYEK AKADEMIK NLP. SELURUH HAK CIPTA DILINDUNGI.
        </div>

        {/* Right: Academic Association */}
        <div className="flex flex-col items-center md:items-end gap-1 font-light text-zinc-600">
          <span>DEPARTEMEN ILMU KOMPUTER & TEKNOLOGI INFORMASI</span>
          <span className="text-zinc-500">PRESERVASI SASTRA DENGAN TRANSFORMer MODEL</span>
        </div>

      </div>
    </footer>
  );
}
