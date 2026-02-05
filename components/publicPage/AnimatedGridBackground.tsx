"use client";

import { useEffect, useState } from "react";

export default function AnimatedGridBackground() {
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const TOTAL_CELLS = 300;

  useEffect(() => {
    const interval = setInterval(() => {
      const count = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
      const newIndices = new Set<number>();
      while (newIndices.size < count) {
        newIndices.add(Math.floor(Math.random() * TOTAL_CELLS));
      }
      setActiveIndices(Array.from(newIndices));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div
        className="w-full h-full grid gap-[1px] bg-gray-200 dark:bg-zinc-600/30 transition-colors duration-300"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
          gridAutoRows: "100px",
        }}
      >
        {Array.from({ length: TOTAL_CELLS }).map((_, i) => (
          <div
            key={i}
            className="relative w-full h-full bg-background transition-colors duration-300"
          >
            <div
              className={`
                absolute inset-0 bg-primary/5 dark:bg-primary/20
                transition-opacity duration-[1500ms] ease-in-out
                ${activeIndices.includes(i) ? "opacity-100" : "opacity-0"}
              `}
            />
          </div>
        ))}
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(transparent_40%,var(--color-background)_100%)] opacity-80" />
    </div>
  );
}
