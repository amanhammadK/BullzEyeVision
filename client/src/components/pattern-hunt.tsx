import React, { useState } from "react";

const PATTERNS = [
  { name: "Breakout", color: "#398848" },
  { name: "Reversal", color: "#d60c16" },
  { name: "Consolidation", color: "#398848" },
];

export default function PatternHunt() {
  const [score, setScore] = useState(0);
  const [found, setFound] = useState<number | null>(null);

  const handleClick = (i: number) => {
    setFound(i);
    setScore((s) => s + (PATTERNS[i].name === "Breakout" ? 2 : 1));
    setTimeout(() => setFound(null), 700);
  };

  return (
    <div className="bg-black/60 border border-white/10 p-6 md:p-8 backdrop-blur-sm max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-[#398848] font-mono text-xs uppercase tracking-[0.3em] mb-2 opacity-80">Pattern Hunt</div>
          <h3 className="text-white font-mono font-black text-2xl md:text-3xl uppercase tracking-wider">Find the pattern</h3>
        </div>
        <div className="text-white font-mono text-sm">Score: <span className="text-[#398848]">{score}</span></div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleClick(i % PATTERNS.length)}
            className={`h-24 md:h-28 lg:h-32 border border-white/10 bg-black/30 hover:bg-white/5 transition-all relative overflow-hidden group ${
              found === i % PATTERNS.length ? "ring-2 ring-[#398848]" : ""
            }`}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `radial-gradient(circle at 50% 50%, ${PATTERNS[i % PATTERNS.length].color}22, transparent 60%)` }} />
            <div className="absolute bottom-2 left-2 text-[11px] font-mono uppercase tracking-wider text-gray-400">{PATTERNS[i % PATTERNS.length].name}</div>
          </button>
        ))}
      </div>

      <div className="mt-6 text-right">
        <button className="inline-block bg-[#d60c16] hover:bg-[#b50a13] text-white px-4 py-2 font-mono text-xs uppercase tracking-wider">Reset</button>
      </div>
    </div>
  );
}

