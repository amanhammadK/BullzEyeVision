import React, { useMemo, useState } from "react";

export default function TradeSimulator() {
  const [entry, setEntry] = useState(1000);
  const [risk, setRisk] = useState(1);
  const [reward, setReward] = useState(2);
  const [size, setSize] = useState(1);

  const outcome = useMemo(() => {
    const stop = +(entry * (1 - risk / 100)).toFixed(2);
    const target = +(entry * (1 + reward / 100)).toFixed(2);
    const pnlLoss = +(-size * (entry - stop)).toFixed(2);
    const pnlWin = +(size * (target - entry)).toFixed(2);
    return { stop, target, pnlLoss, pnlWin };
  }, [entry, risk, reward, size]);

  const slider = (label: string, value: number, set: (v: number) => void, min: number, max: number, step = 1) => (
    <div>
      <div className="flex justify-between text-xs font-mono text-gray-400 uppercase mb-2">
        <span>{label}</span><span className="text-white">{value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(+e.target.value)} className="w-full accent-[#398848]" />
    </div>
  );

  return (
    <div className="bg-black/60 border border-white/10 p-6 md:p-8 backdrop-blur-sm max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-[#398848] font-mono text-xs uppercase tracking-[0.3em] mb-3 opacity-80">Simulate</div>
        <h3 className="text-white font-mono font-black text-2xl md:text-3xl uppercase tracking-wider">Trade Simulator</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-5">
          {slider("Entry", entry, setEntry, 100, 5000, 10)}
          {slider("Risk %", risk, setRisk, 0.1, 5, 0.1)}
          {slider("Reward %", reward, setReward, 0.1, 10, 0.1)}
          {slider("Size", size, setSize, 0.1, 10, 0.1)}
        </div>
        <div className="bg-black/40 border border-white/10 p-4">
          <div className="text-xs font-mono text-gray-400 uppercase mb-2">Outcome</div>
          <div className="text-white font-mono text-sm space-y-2">
            <div className="flex justify-between"><span>Stop</span><span className="text-[#d60c16]">{outcome.stop}</span></div>
            <div className="flex justify-between"><span>Target</span><span className="text-[#398848]">{outcome.target}</span></div>
            <div className="flex justify-between"><span>PNL (Loss)</span><span className="text-[#d60c16]">{outcome.pnlLoss}</span></div>
            <div className="flex justify-between"><span>PNL (Win)</span><span className="text-[#398848]">{outcome.pnlWin}</span></div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="bg-[#d60c16] hover:bg-[#b50a13] text-white py-2 font-mono uppercase tracking-wider">Short</button>
            <button className="bg-[#398848] hover:bg-[#2e6b38] text-white py-2 font-mono uppercase tracking-wider">Long</button>
          </div>
        </div>
      </div>
    </div>
  );
}

