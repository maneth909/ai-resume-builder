"use client";

import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import AnimatedGridBackground from "@/components/publicPage/AnimatedGridBackground";
import LaptopDemo from "@/components/publicPage/LaptopDemo";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Home() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();

  const handleScrollToDemo = () => {
    window.scrollTo({
      top: 650,
      behavior: "smooth",
    });
  };

  // --- SMOOTH ANIMATION CONFIG ---

  const heroOpacity = useTransform(scrollY, [0, 250], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 250], [1, 0.9]);
  const heroY = useTransform(scrollY, [0, 250], [0, -300]);

  // Disable clicks once opacity drops
  const heroPointerEvents = useTransform(scrollY, (v) =>
    v > 150 ? "none" : "auto",
  );

  // LAPTOP DEMO
  const laptopOpacity = useTransform(scrollY, [200, 500], [0, 1]);
  const laptopScale = useTransform(scrollY, [200, 600], [0.85, 1.35]);
  const laptopY = useTransform(scrollY, [150, 600], [400, 0]);

  return (
    <div
      ref={containerRef}
      className="relative h-[250vh] bg-background text-blackcolor dark:text-whitecolor transition-colors duration-300"
    >
      <AnimatedGridBackground />

      {/* --- Header (Fixed) --- */}
      <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-tertiary">
            <Image src="/logo.png" alt="Logo" width={28} height={28} />
            <span>JDify</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="h-6 w-px bg-border hidden sm:block" />
            <Link
              href="/login"
              className="hidden sm:block px-4 py-2 text-sm font-bold text-background bg-tertiary rounded-lg hover:opacity-90 transition-opacity shadow-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* --- Sticky Center Stage --- */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center pt-16">
        {/* HERO SECTION WRAPPER */}
        <motion.div
          style={{
            opacity: heroOpacity,
            scale: heroScale,
            y: heroY,
            pointerEvents: heroPointerEvents,
          }}
          className="absolute inset-0 flex flex-col items-center justify-center z-20 px-6 text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border mb-8 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs font-medium text-muted uppercase tracking-wide">
              v1.0 Public Beta
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-normal mb-8 text-tertiary ">
            Your resume, built by you <br className="hidden sm:block" />
            <span className="inline-block py-1 text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
              Judged by AI
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted mb-10 max-w-2xl leading-relaxed">
            Create a clean resume, compare it with any job description, and get
            an AI match score with improvement tips.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-bold text-whitecolor bg-primary rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/25"
            >
              Create Resume Now
            </Link>

            <button
              onClick={handleScrollToDemo}
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-tertiary bg-whitecolor dark:bg-secondary border border-border rounded-xl hover:bg-secondary dark:hover:bg-border transition-colors cursor-pointer"
            >
              View Demo
            </button>
          </div>
        </motion.div>

        {/* ANIMATED LAPTOP DEMO */}
        <motion.div
          style={{
            opacity: laptopOpacity,
            scale: laptopScale,
            y: laptopY,
          }}
          className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
        >
          <div className="w-full max-w-7xl px-4 mt-20">
            <LaptopDemo videoSrc="/demo.mp4" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
