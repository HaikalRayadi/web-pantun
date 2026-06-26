"use client";

// Component inspired by Tom Miller from the GSAP community
// https://codepen.io/creativeocean/pen/NPWLwJM

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(SplitText, ScrambleTextPlugin);

export interface ScrambledTextProps {
  radius?: number;
  duration?: number;
  speed?: number;
  scrambleChars?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

interface CharData {
  el: HTMLElement;
  /** Absolute page coordinate (invariant to scroll) */
  cx: number;
  cy: number;
  content: string;
}

const ScrambledText: React.FC<ScrambledTextProps> = ({
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = ".:",
  className = "",
  style = {},
  children,
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const pEl = rootRef.current.querySelector("p");
    if (!pEl) return;

    const split = SplitText.create(pEl, {
      type: "chars",
      charsClass: "inline-block will-change-transform",
    });

    split.chars.forEach((el) => {
      const c = el as HTMLElement;
      gsap.set(c, { attr: { "data-content": c.innerHTML } });
    });

    // ── Position cache ────────────────────────────────────────────────────
    // Stored as absolute page coordinates (rect + scrollY/X at build time).
    // Absolute coords are stable across scroll → no re-cache needed on scroll.
    // Cache is built LAZILY on first interaction so framer-motion entry
    // animations (y:30 → y:0) are guaranteed to have finished.
    let charCache: CharData[] = [];
    let cacheValid = false;

    const buildCache = () => {
      const sx = window.scrollX;
      const sy = window.scrollY;
      charCache = (split.chars as HTMLElement[]).map((c) => {
        const { left, top, width, height } = c.getBoundingClientRect();
        return {
          el: c,
          cx: left + width * 0.5 + sx,
          cy: top + height * 0.5 + sy,
          content: c.dataset.content || "",
        };
      });
      cacheValid = true;
    };

    // Invalidate cache on resize (layout may shift)
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      cacheValid = false;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildCache, 200);
    };

    // Invalidate cache when element re-enters viewport
    // (covers the case where user scrolls away and back)
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          cacheValid = false;
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(rootRef.current);

    // ── RAF-throttled pointer handler ─────────────────────────────────────
    let rafId: number | null = null;
    let mouseX = 0;
    let mouseY = 0;

    const processFrame = () => {
      rafId = null;

      // Build cache lazily on first interaction frame
      if (!cacheValid) buildCache();

      const ax = mouseX + window.scrollX;
      const ay = mouseY + window.scrollY;

      for (const { el, cx, cy, content } of charCache) {
        const dist = Math.hypot(ax - cx, ay - cy);
        if (dist < radius) {
          gsap.to(el, {
            overwrite: true,
            duration: duration * (1 - dist / radius),
            scrambleText: { text: content, chars: scrambleChars, speed },
            ease: "none",
          });
        }
      }
    };

    const handleMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Discard excess events — only one frame scheduled at a time
      if (rafId === null) {
        rafId = requestAnimationFrame(processFrame);
      }
    };

    const container = rootRef.current;
    container.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      container.removeEventListener("pointermove", handleMove);
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
      if (rafId !== null) cancelAnimationFrame(rafId);
      observer.disconnect();
      split.revert();
    };
  }, [radius, duration, speed, scrambleChars]);

  return (
    <div ref={rootRef} className={className} style={style}>
      <p>{children}</p>
    </div>
  );
};

export default ScrambledText;
