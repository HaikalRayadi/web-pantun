"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrambledText from "./ScrambledText";

const PARAGRAPHS = [
  {
    id: "01",
    label: "Latar Belakang",
    text: "Pantun Melayu adalah salah satu bentuk puisi lama yang diakui secara global oleh UNESCO sebagai Warisan Budaya Takbenda. Namun, di era digital, minat menulis pantun dengan kaidah yang tepat — struktur sampiran dan isi yang memiliki rima berpelatuk a-b-a-b — mulai meredup di kalangan generasi muda karena kompleksitas linguistiknya.",
  },
  {
    id: "02",
    label: "Pendekatan",
    text: "Proyek akademik NLP ini berfokus pada rancang bangun generator pantun berbasis IndoBERT — Bidirectional Encoder Representations from Transformers yang disetel khusus untuk Bahasa Indonesia. Model dilatih memahami struktur semantik, asosiasi kata, dan kecocokan rima secara mendalam guna mempermudah pembuatan pantun Melayu yang autentik.",
  },
  {
    id: "03",
    label: "Tujuan",
    text: "Dengan pendekatan deep learning dan pemrosesan bahasa alami, sistem ini mampu mendeteksi rima fonetik, menghasilkan metafora yang relevan secara budaya, serta menjamin setiap bait memenuhi standar struktural sastra Melayu klasik. Harapannya, teknologi ini menjadi jembatan antara warisan leluhur dan generasi digital masa kini.",
  },
];


/** Glowing divider — thin line with soft bloom above it */
function GlowDivider() {
  return (
    <div className="relative h-[1px] my-0 overflow-visible pointer-events-none">
      {/* Base gradient line */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-700/70 to-transparent" />
      {/* Bloom layer — blurred bright strip */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-white/20"
        style={{ filter: "blur(3px)" }}
      />
      {/* Wide soft glow */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-1/3 h-[6px] -top-[2.5px] bg-white/[0.06]"
        style={{ filter: "blur(6px)" }}
      />
    </div>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const lineScale    = useTransform(scrollYProgress, [0.1, 0.8], [0, 1]);
  const titleY       = useTransform(scrollYProgress, [0, 0.25], [24, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.18], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full bg-transparent py-24 md:py-36 px-4 md:px-12 text-white overflow-hidden"
    >
      {/* ── Soft Black Fade Transition (Hero to Solid Black) ────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, #000000 300px, #000000 100%)",
        }}
      />

      {/* ── Ambient glow blobs ────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-1/3 w-[280px] h-[180px] rounded-full bg-white/[0.012] blur-[70px]" />
        <div className="absolute bottom-0 right-1/3 w-[280px] h-[180px] rounded-full bg-white/[0.012] blur-[70px]" />
      </div>

      {/* ── Decorative vertical rules ─────────────────────────────────────── */}
      <div className="absolute top-0 right-10 h-full w-px bg-gradient-to-b from-transparent via-zinc-800/50 to-transparent pointer-events-none hidden lg:block" />
      <div className="absolute top-0 left-10  h-full w-px bg-gradient-to-b from-transparent via-zinc-900/50 to-transparent pointer-events-none hidden lg:block" />

      <div className="relative z-10 mx-auto max-w-6xl">

        {/* ══ HEADER — centered at top ══════════════════════════════════════ */}
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="text-center mb-20 md:mb-28"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-zinc-700" />
            <span className="text-[10px] font-mono tracking-[0.35em] text-zinc-500 uppercase">
              LATAR BELAKANG PROYEK
            </span>
            <div className="h-px w-8 bg-zinc-700" />
          </div>

          <h2 className="text-2xl font-extralight tracking-tight sm:text-3xl md:text-4xl font-sans leading-tight">
            Melestarikan{" "}
            <span className="font-serif italic font-light text-zinc-300">
              Warisan Melayu
            </span>
            <br />
            Melalui Kecerdasan Buatan.
          </h2>

          {/* Animated glowing underline */}
          <div className="flex justify-center mt-6">
            <div className="relative">
              <motion.div
                className="h-px bg-gradient-to-r from-transparent via-zinc-500 to-transparent"
                initial={{ width: 0 }}
                whileInView={{ width: "180px" }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              />
              {/* Glow on underline */}
              <motion.div
                className="absolute inset-0 h-[3px] -top-[1px]"
                initial={{ width: 0 }}
                whileInView={{ width: "180px" }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                  filter: "blur(4px)",
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* ══ CONTENT GRID ══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">

          {/* ── Left sidebar — plain stat items ────────────────────────── */}
          <div className="lg:col-span-3 flex flex-col gap-6 lg:sticky lg:top-28 h-fit">
            {[
              { value: "UNESCO",   sub: "Warisan Budaya\nTakbenda" },
              { value: "IndoBERT", sub: "Model NLP\nBahasa Indonesia" },
              { value: "a-b-a-b",  sub: "Skema Rima\nKlasik" },
            ].map((stat, i) => (
              <motion.div
                key={stat.value}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group flex items-start gap-3"
              >
                {/* Left accent line */}
                <div className="w-px self-stretch bg-zinc-800 group-hover:bg-zinc-600 transition-colors duration-300 shrink-0" />
                <div>
                  <p className="font-mono font-semibold text-white text-sm tracking-tight">
                    {stat.value}
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-zinc-600 tracking-widest uppercase leading-[1.6] whitespace-pre-line">
                    {stat.sub}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Scroll progress */}
            <div className="hidden lg:flex items-center gap-3 mt-2">
              <span className="text-[9px] tracking-widest text-zinc-700 font-mono uppercase">scroll</span>
              <div className="flex-1 h-px bg-zinc-900 relative overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-zinc-500 origin-left"
                  style={{ scaleX: lineScale, width: "100%" }}
                />
              </div>
            </div>
          </div>

          {/* ── Right — paragraphs separated by glow dividers ──────────── */}
          <div className="lg:col-span-9 flex flex-col">
            {PARAGRAPHS.map((p, i) => (
              <div key={p.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: "-15% 0px -15% 0px" }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="group py-8 md:py-10"
                >
                  {/* Row header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-mono tracking-[0.3em] text-zinc-700 uppercase">
                      {p.id}
                    </span>
                    <span className="text-[9px] font-mono tracking-[0.25em] text-zinc-600 uppercase
                                     opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {p.label}
                    </span>
                  </div>

                  {/* Scrambled interactive text */}
                  <ScrambledText
                    radius={120}
                    duration={1.2}
                    speed={0.5}
                    scrambleChars=".:"
                    className="font-mono text-[clamp(13px,1.5vw,18px)] text-zinc-400 leading-[1.9]"
                  >
                    {p.text}
                  </ScrambledText>

                  {/* Hover bottom accent */}
                  <div className="mt-5 h-px w-0 group-hover:w-10 bg-zinc-600 transition-all duration-500 ease-out" />
                </motion.div>

                {/* Glow divider between paragraphs */}
                {i < PARAGRAPHS.length - 1 && <GlowDivider />}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
