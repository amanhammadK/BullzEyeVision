import React, { useMemo, useState } from "react";

export default function StrategyBuilder() {
  const [risk, setRisk] = useState<"Low" | "Medium" | "High">("Low");
  const [timeframe, setTimeframe] = useState<"Scalp" | "Swing" | "Day">("Swing");
  const [asset, setAsset] = useState<"BTC" | "ETH" | "NQ">("BTC");

  const config = useMemo(() => {
    const riskMap = { Low: 0.5, Medium: 1.0, High: 1.5 } as const;
    const tfMap = { Scalp: 0.6, Day: 1.0, Swing: 1.4 } as const;
    const baseRR = 1.6;
    const rr = (baseRR * riskMap[risk] * tfMap[timeframe]).toFixed(2);
    const win = Math.max(45, 65 - (risk === "High" ? 10 : risk === "Medium" ? 5 : 0) + (timeframe === "Swing" ? 4 : 0));
    return { rr, win };
  }, [risk, timeframe]);

  const pill = (label: string, active: boolean, onClick: () => void) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full border text-sm font-mono uppercase tracking-wider transition-all ${
        active ? "bg-[#398848] text-white border-transparent" : "bg-black/30 text-gray-300 border-white/20 hover:border-white/40"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-black/60 border border-white/10 p-6 md:p-8 backdrop-blur-sm max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-[#398848] font-mono text-xs uppercase tracking-[0.3em] mb-3 opacity-80">Build Strategy</div>
        <h3 className="text-white font-mono font-black text-2xl md:text-3xl uppercase tracking-wider">Strategy Builder</h3>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <div className="text-xs font-mono text-gray-400 uppercase mb-3">Risk</div>
          <div className="flex flex-wrap gap-2">
            {pill("Low", risk === "Low", () => setRisk("Low"))}
            {pill("Medium", risk === "Medium", () => setRisk("Medium"))}
            {pill("High", risk === "High", () => setRisk("High"))}
          </div>
        </div>
        <div>
          <div className="text-xs font-mono text-gray-400 uppercase mb-3">Timeframe</div>
          <div className="flex flex-wrap gap-2">
            {pill("Scalp", timeframe === "Scalp", () => setTimeframe("Scalp"))}
            {pill("Day", timeframe === "Day", () => setTimeframe("Day"))}
            {pill("Swing", timeframe === "Swing", () => setTimeframe("Swing"))}
          </div>
        </div>
        <div>
          <div className="text-xs font-mono text-gray-400 uppercase mb-3">Asset</div>
          <div className="flex flex-wrap gap-2">
            {pill("BTC", asset === "BTC", () => setAsset("BTC"))}
            {pill("ETH", asset === "ETH", () => setAsset("ETH"))}
            {pill("NQ", asset === "NQ", () => setAsset("NQ"))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="bg-black/40 border border-white/10 p-4">
            <div className="text-xs font-mono text-gray-400 uppercase mb-2">Preview</div>
            <div className="h-40 md:h-48 bg-gradient-to-b from-black/40 to-black/10 grid grid-cols-12 gap-1 p-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className={`h-full ${i % 2 ? "bg-[#398848]/40" : "bg-white/10"}`}></div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-black/40 border border-white/10 p-4">
          <div className="text-xs font-mono text-gray-400 uppercase mb-2">Metrics</div>
          <div className="text-white font-mono text-sm space-y-2">
            <div className="flex justify-between"><span>R / R</span><span className="text-[#398848]">{config.rr}</span></div>
            <div className="flex justify-between"><span>Win Rate</span><span className="text-[#398848]">{config.win}%</span></div>
            <div className="flex justify-between"><span>Asset</span><span className="text-gray-300">{asset}</span></div>
          </div>
          <button className="mt-4 w-full bg-[#398848] hover:bg-[#2e6b38] text-white py-2 font-mono uppercase tracking-wider">Apply Strategy</button>
        </div>
      </div>
    </div>
  );
}

