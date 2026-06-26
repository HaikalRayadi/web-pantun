"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [cursorType, setCursorType] = useState<"default" | "pointer" | "text" | "zoom">("default");
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  // Position of the mouse
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring physics for the outer circle (lagging effect)
  const springConfig = { damping: 40, stiffness: 400, mass: 0.4 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Determine cursor type based on hovered element
      if (target.closest("button") || target.closest("a") || target.closest("[data-cursor='pointer']")) {
        setCursorType("pointer");
        
        // Custom text for special buttons if data-cursor-text is provided
        const customText = (target.closest("[data-cursor-text]") as HTMLElement)?.dataset.cursorText;
        if (customText) {
          setCursorText(customText);
        } else {
          setCursorText("");
        }
      } else if (target.closest("[data-cursor='zoom']")) {
        setCursorType("zoom");
        setCursorText("ZOOM");
      } else if (target.closest("h1") || target.closest("h2") || target.closest("p") || target.closest("[data-cursor='text']")) {
        setCursorType("text");
        setCursorText("");
      } else {
        setCursorType("default");
        setCursorText("");
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  // Custom variants for different hover states
  const ringVariants = {
    default: {
      width: 32,
      height: 32,
      borderColor: "rgba(255, 255, 255, 0.4)", // Translucent White
      backgroundColor: "rgba(255, 255, 255, 0)",
    },
    pointer: {
      width: 64,
      height: 64,
      borderColor: "rgba(255, 255, 255, 0.9)", // Solid White
      backgroundColor: "rgba(255, 255, 255, 0.05)",
    },
    text: {
      width: 16,
      height: 48,
      borderRadius: "4px",
      borderColor: "rgba(255, 255, 255, 0.8)", // White bar
      backgroundColor: "rgba(255, 255, 255, 0)",
    },
    zoom: {
      width: 80,
      height: 80,
      borderColor: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
    }
  };

  const dotVariants = {
    default: {
      scale: 1,
      backgroundColor: "#ffffff",
    },
    pointer: {
      scale: 1.5,
      backgroundColor: "#ffffff", // Pure white dot
    },
    text: {
      scale: 0, // hide dot on text hover for a clean text-cursor effect
    },
    zoom: {
      scale: 0,
    }
  };

  return (
    <>
      {/* Outer Ring (smooth lag effect) */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full border border-solid mix-blend-difference hidden md:flex items-center justify-center overflow-hidden"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={cursorType}
        variants={ringVariants}
        transition={{ type: "tween", ease: "backOut", duration: 0.2 }}
      >
        {cursorText && (
          <span className="text-[10px] font-bold tracking-widest text-[#ffffff] uppercase select-none">
            {cursorText}
          </span>
        )}
      </motion.div>

      {/* Inner Dot (instant, exact mouse position) */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-difference hidden md:block"
        style={{
          x: mouseX,
          y: mouseY,
        }}
        animate={cursorType}
        variants={dotVariants}
        transition={{ duration: 0.1 }}
      />
    </>
  );
}
