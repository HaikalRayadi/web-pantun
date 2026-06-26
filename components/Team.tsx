"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import MagicRings from "./MagicRings";

// Custom robust SVG icons to avoid package version discrepancies
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface TeamMember {
  name: string;
  role: string;
  description: string;
  avatar: string;
  github?: string;
  linkedin?: string;
  email?: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Naufal Arqam Muzakki",
    role: "Lead NLP Researcher",
    description: "Spesialis NLP dan Fine-Tuning Transformer model. Mengatur arsitektur pelatihan model IndoBERT agar presisi mendeteksi rima Melayu.",
    avatar: "NAM",
    email: "naufal23ti@mahasiswa.pcr.ac.id"
  },
  {
    name: "Haikal Rayadi",
    role: "Frontend Dev & UI/UX Designer",
    description: "Mengembangkan antarmuka pengguna interaktif dengan integrasi animasi GSAP/Framer Motion untuk visualisasi AI yang artistik.",
    avatar: "HR",
    github: "https://github.com/HaikalRayadi",
    linkedin: "https://linkedin.com",
    email: "haikalrayadi23ti@mahasiswa.pcr.ac.id"
  },
  {
    name: "Maulani Hafizah",
    role: "Malay Literature Adviser",
    description: "Kurator data pantun dan pengawas kaidah sastra Melayu. Memastikan sintaksis hasil generasi tetap memegang prinsip adat dan estetika puisi.",
    avatar: "MH",
    email: "maulani23ti@mahasiswa.pcr.ac.id"
  }
];

export default function Team() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section
      id="team"
      className="relative w-full bg-black py-24 md:py-36 px-4 md:px-12 text-white overflow-hidden"
    >
      {/* Magic Rings Background Animation */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <MagicRings
          color="#eeeeee"
          colorTwo="#9c9cb1"
          ringCount={6}
          speed={0.8}
          attenuation={10}
          lineThickness={2}
          baseRadius={0.35}
          radiusStep={0.1}
          scaleRate={0.1}
          opacity={0.6}
          blur={0}
          noiseAmount={0.1}
          rotation={0}
          ringGap={1.5}
          fadeIn={0.7}
          fadeOut={0.5}
          followMouse={true}
          mouseInfluence={0.2}
          hoverScale={1.2}
          parallax={0.05}
          clickBurst={true}
        />
      </div>

      {/* Background visual element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-white/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Title */}
        <div className="mb-16 text-center">
          <motion.span 
            className="text-xs font-bold tracking-[0.3em] text-white font-mono uppercase mb-4 block"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            OUR TEAM
          </motion.span>
          <motion.h2 
            className="text-3xl font-extralight tracking-tight sm:text-5xl font-sans"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Job Desk Pengembangan Web Generate <span className="font-serif italic font-light text-zinc-300">Pantun</span>
          </motion.h2>
          <motion.div 
            className="mt-6 mx-auto h-[1px] w-24 bg-white"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </div>

        {/* Team Grid */}
        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {TEAM_MEMBERS.map((member, index) => (
            <motion.div
              key={index}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-zinc-950/80 p-8 transition-all hover:border-white/20"
              variants={cardVariants}
              whileHover={{ y: -8 }}
              data-cursor="pointer"
            >
              {/* Top Section */}
              <div>
                {/* Initial Avatar */}
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-zinc-900 text-lg font-bold tracking-widest text-white group-hover:border-white transition-all duration-300">
                  {member.avatar}
                </div>

                {/* Info */}
                <span className="text-[10px] font-bold tracking-widest text-zinc-400 font-mono uppercase">
                  {member.role}
                </span>
                <h3 className="mt-2 text-xl font-light tracking-wide text-zinc-100 group-hover:text-white transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="mt-4 text-xs font-light leading-relaxed text-zinc-500 group-hover:text-zinc-400 transition-colors duration-300">
                  {member.description}
                </p>
              </div>

              {/* Bottom Section: Socials */}
              <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
                {member.github && (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-white transition-colors"
                  >
                    <GithubIcon className="h-4 w-4" />
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-white transition-colors"
                  >
                    <LinkedinIcon className="h-4 w-4" />
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="text-zinc-500 hover:text-white transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                )}
              </div>

              {/* Hover effect glowing border accent */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-white transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
