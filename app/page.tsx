"use client";

import { useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useMotionValueEvent } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Team from "@/components/Team";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import LiquidEther from "@/components/LiquidEther";

const BACKGROUND_COLORS = ["#495057", "#6c757d", "#adb5bd"];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<"home" | "chatbot">("home");

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [percent, setPercent] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setPercent(Math.round(latest * 100));
  });

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const pageTransitionVariants = {
    initialHome: {
      opacity: 0,
      scale: 1,
    },
    enterHome: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exitHome: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1] as const,
      },
    },
    initialChatbot: {
      opacity: 0,
      scale: 1.08,
    },
    enterChatbot: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exitChatbot: {
      opacity: 0,
      scale: 1.08,
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1] as const,
      },
    },
  };

  return (
    <main className="relative min-h-screen w-full bg-black overflow-x-hidden selection:bg-[#dee2e6] selection:text-black">
      {/* Loading Screen */}
      <LoadingScreen onComplete={() => setIsLoading(false)} />

      {!isLoading && (
        <>
          {/* Custom Cursor */}
          <CustomCursor />

          {/* Minimalist Scroll Progress Bar */}
          {activeView === "home" && (
            <motion.div
              className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#495057] via-[#6c757d] to-[#adb5bd] origin-left z-50 pointer-events-none"
              style={{ scaleX }}
            />
          )}

          {/* Minimalist Scroll Progress Gadget (Bottom Right) */}
          {activeView === "home" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-xl pointer-events-none"
            >
              <svg className="w-12 h-12 transform -rotate-90">
                {/* Background track circle */}
                <circle
                  cx="24"
                  cy="24"
                  r="19"
                  className="stroke-white/10"
                  strokeWidth="2"
                  fill="none"
                />
                {/* Animated progress circle */}
                <motion.circle
                  cx="24"
                  cy="24"
                  r="19"
                  stroke="url(#progress-circle-grad)"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  style={{ pathLength: scrollYProgress }}
                />
                <defs>
                  <linearGradient id="progress-circle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#495057" />
                    <stop offset="50%" stopColor="#6c757d" />
                    <stop offset="100%" stopColor="#adb5bd" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Centered Percentage Text */}
              <span className="absolute font-mono text-[9px] font-bold text-zinc-300 tracking-tighter">
                {percent}%
              </span>
            </motion.div>
          )}



          {/* Fixed Liquid Ether Background */}
          <div className="fixed inset-0 z-0 w-full h-full pointer-events-none opacity-40">
            <LiquidEther
              colors={BACKGROUND_COLORS}
              mouseForce={20}
              cursorSize={100}
              isViscous={false}
              viscous={0}
              iterationsViscous={0}
              iterationsPoisson={16}
              resolution={0.25}
              isBounce={false}
              autoDemo
              autoSpeed={0.5}
              autoIntensity={2.2}
              takeoverDuration={0.25}
              autoResumeDelay={1000}
              autoRampDuration={0.6}
            />
          </div>

          {/* Fixed Navbar */}
          {activeView === "home" && (
            <Navbar
              activeView={activeView}
              setActiveView={setActiveView}
              onNavigateToSection={handleScrollToSection}
            />
          )}

          {/* Page Transitions */}
          <AnimatePresence mode="wait">
            {activeView === "home" && (
              <motion.div
                key="home-view"
                variants={pageTransitionVariants}
                initial="initialHome"
                animate="enterHome"
                exit="exitHome"
                className="w-full flex flex-col"
              >
                <Hero
                  onStartChatbot={() => setActiveView("chatbot")}
                />
                <About />
                <Team />
                <Footer />
              </motion.div>
            )}

            {activeView === "chatbot" && (
              <motion.div
                key="chatbot-view"
                variants={pageTransitionVariants}
                initial="initialChatbot"
                animate="enterChatbot"
                exit="exitChatbot"
                className="w-full"
              >
                <Chatbot onBackToHome={() => setActiveView("home")} />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </main>
  );
}