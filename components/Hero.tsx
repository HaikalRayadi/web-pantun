"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ScrambledText from "./ScrambledText";

interface HeroProps {
  onStartChatbot: () => void;
}

const WORDS = ["Pantun", "Melayu"];

export default function Hero({ onStartChatbot }: HeroProps) {
  // Title text splitting
  const title1 = "Generate";

  // Typewriter loop logic for second line
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleType = () => {
      const fullWord = WORDS[currentWordIndex];
      if (!isDeleting) {
        // Typing
        setCurrentText(fullWord.substring(0, currentText.length + 1));
        setTypingSpeed(100 + Math.random() * 50); // realistic variance

        if (currentText === fullWord) {
          // Pause at end of word
          setTypingSpeed(2200);
          setIsDeleting(true);
        }
      } else {
        // Deleting
        setCurrentText(fullWord.substring(0, currentText.length - 1));
        setTypingSpeed(60);

        if (currentText === "") {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % WORDS.length);
          setTypingSpeed(450); // pause before next word
        }
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, typingSpeed]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const letterVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const, // Power4.easeOut equivalent
      },
    },
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-transparent text-white px-4 md:px-12"
    >
      {/* Visual background element: Abstract generative neural grid */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-25">
        <div className="absolute h-[600px] w-[600px] rounded-full bg-gradient-to-r from-zinc-950 via-zinc-500/5 to-black blur-[120px]" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Elegant traditional songket mandala outline - rotating slowly */}
        <motion.div
          className="h-[500px] w-[500px] rounded-full border border-zinc-800/60 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        >
          <div className="h-[400px] w-[400px] rounded-full border border-dashed border-zinc-800/40 flex items-center justify-center">
            <div className="h-[250px] w-[250px] rounded-full border border-zinc-900/60" />
          </div>
        </motion.div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex max-w-5xl flex-col items-center text-center">
        {/* Small subtitle tag */}
        <motion.div
          className="mb-6 flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/60 px-4 py-1.5 backdrop-blur-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-300 uppercase font-mono">
            Proyek Natural Language Processing
          </span>
        </motion.div>

        {/* Heading 1 (Word Reveal Animation) */}
        <motion.h1
          className="flex flex-col text-5xl font-extralight tracking-tight sm:text-7xl md:text-8xl lg:text-9xl font-sans"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="overflow-hidden h-fit py-2">
            <motion.span
              className="block font-bold bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent"
              variants={letterVariants}
            >
              {title1}
            </motion.span>
          </div>
          <div className="overflow-hidden h-fit py-2 -mt-2 md:-mt-6">
            <motion.span
              className="inline-block text-white italic font-serif leading-none tracking-normal font-light"
              variants={letterVariants}
            >
              {currentText}
              <span className="inline-block w-[3px] h-[0.75em] bg-[#ffffff] ml-2 align-baseline animate-cursor-blink" />
            </motion.span>
          </div>
        </motion.h1>

        {/* Description */}
        <motion.div
          className="mt-8 max-w-2xl text-sm leading-relaxed tracking-wide text-zinc-400 font-light md:text-base md:leading-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <ScrambledText
            radius={120}
            duration={1.2}
            speed={0.5}
            scrambleChars=".:"
            className="text-zinc-400"
          >
            Sinergi kecerdasan buatan berbasis deep learning model IndoBERT dengan warisan kesusastraan klasik Melayu. Hasilkan pantun secara instan, presisi, dan estetis dengan menjaga pakem rima dan struktur sampiran-isi.
          </ScrambledText>
        </motion.div>

        {/* Call to Action Button */}
        <motion.div
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <button
            onClick={onStartChatbot}
            className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-full border border-white bg-white px-8 py-4 text-black transition-all hover:border-white hover:bg-black hover:text-white"
            data-cursor="pointer"
            data-cursor-text="START"
          >
            <span className="relative z-10 text-xs font-bold tracking-widest uppercase transition-colors duration-300">
              Mulai
            </span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            <span className="absolute inset-0 z-0 bg-black scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
