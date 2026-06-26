"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PANtUN_WORDS = [
  "RUMPUN MELAYU",
  "SAMPIRAN",
  "ISI & RIMA",
  "SENI SASTRA",
  "KECERDASAN BUATAN",
  "INDOBERT MODEL",
  "GENERASI PANTUN"
];

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Cycle words
  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % PANtUN_WORDS.length);
    }, 400);

    return () => clearInterval(wordInterval);
  }, []);

  // Increment progress
  useEffect(() => {
    const duration = 2000; // 2 seconds total loading
    const intervalTime = 20;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const progressInterval = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setProgress(nextProgress);

      if (nextProgress === 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
          setIsFinished(true);
        }, 300); // Small pause at 100%
      }
    }, intervalTime);

    return () => clearInterval(progressInterval);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!isFinished && (
        <motion.div
          className="fixed inset-0 z-[999] flex flex-col items-center justify-between bg-black p-12 text-white select-none"
          initial={{ y: 0 }}
          exit={{ 
            y: "-100%", 
            transition: { 
              duration: 0.8, 
              ease: [0.76, 0, 0.24, 1] as const // Custom cubic-bezier for Awwwards-like smooth slide-up
            } 
          }}
        >
          {/* Top: Metadata */}
          <div className="flex w-full items-center justify-between text-xs tracking-[0.3em] text-zinc-500 font-mono">
            <span>INDOBERT PANTUN AI</span>
            <span>PROYEK AKADEMIK NLP v1.0</span>
          </div>

          {/* Middle: Word Cycler & Decorative Circle */}
          <div className="relative flex flex-col items-center justify-center">
            {/* Glowing back-halo */}
            <div className="absolute h-64 w-64 rounded-full bg-white/5 blur-[80px]" />
            
            <div className="h-16 overflow-hidden flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  className="text-2xl md:text-3xl font-extralight tracking-[0.2em] text-white block font-sans"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  {PANtUN_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
            
            <span className="mt-4 text-xs tracking-widest text-zinc-600 font-mono">
              SEDANG MENYELARASKAN TRADISI DENGAN TEKNOLOGI
            </span>
          </div>

          {/* Bottom: Progress percentage and loader bar */}
          <div className="w-full flex flex-col items-start gap-4">
            <div className="flex w-full items-end justify-between">
              {/* Songket Icon Pattern outline */}
              <div className="text-[10px] tracking-wider text-zinc-500 font-mono uppercase">
                Menginisialisasi Model IndoBERT Melayu...
              </div>
              <span className="text-6xl md:text-8xl font-thin tracking-tighter text-zinc-100 font-sans">
                {progress}%
              </span>
            </div>
            <div className="h-[2px] w-full bg-zinc-900 overflow-hidden relative">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-zinc-800 via-zinc-400 to-white"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
