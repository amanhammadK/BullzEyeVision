'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Clock, Target, Zap } from 'lucide-react';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
}

const mockStocks: StockData[] = [
  { symbol: 'AAPL', price: 185.42, change: 4.23, changePercent: 2.34, signal: 'BUY', confidence: 94 },
  { symbol: 'TSLA', price: 248.91, change: -2.15, changePercent: -0.86, signal: 'HOLD', confidence: 67 },
  { symbol: 'NVDA', price: 421.33, change: 12.87, changePercent: 3.15, signal: 'BUY', confidence: 89 },
  { symbol: 'MSFT', price: 378.12, change: 6.45, changePercent: 1.73, signal: 'BUY', confidence: 82 },
  { symbol: 'GOOGL', price: 142.56, change: -1.23, changePercent: -0.85, signal: 'SELL', confidence: 76 },
];

export default function TradingDashboardPreview() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animatedStocks, setAnimatedStocks] = useState(mockStocks);
  const [glitchEffect, setGlitchEffect] = useState(false);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const stockInterval = setInterval(() => {
      setAnimatedStocks(prev => prev.map(stock => ({
        ...stock,
        price: stock.price + (Math.random() - 0.5) * 2,
        change: stock.change + (Math.random() - 0.5) * 0.5,
        changePercent: stock.changePercent + (Math.random() - 0.5) * 0.2,
        confidence: Math.max(60, Math.min(99, stock.confidence + (Math.random() - 0.5) * 5))
      })));
    }, 2000);

    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 200);
    }, 8000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(stockInterval);
      clearInterval(glitchInterval);
    };
  }, []);

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Main Dashboard Container */}
      <div className={`bg-black/90 border border-green-400/30 backdrop-blur-md p-6 font-mono ${glitchEffect ? 'animate-pulse' : ''}`}>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-green-400/20 pb-4">
          <div>
            <h3 className="text-green-400 text-xl font-bold tracking-wider">BULLZEYE LIVE</h3>
            <p className="text-gray-400 text-sm">AI TRADING INTELLIGENCE</p>
          </div>
          <div className="text-right">
            <div className="text-green-400 text-lg font-bold">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-gray-400 text-sm">
              {currentTime.toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-500/10 border border-green-500/30 p-3 text-center">
            <div className="text-green-400 text-2xl font-bold">94.7%</div>
            <div className="text-gray-400 text-xs uppercase">Success Rate</div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 p-3 text-center">
            <div className="text-blue-400 text-2xl font-bold">$2.4M</div>
            <div className="text-gray-400 text-xs uppercase">Avg Profit</div>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 p-3 text-center">
            <div className="text-purple-400 text-2xl font-bold">0.03s</div>
            <div className="text-gray-400 text-xs uppercase">Response</div>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/30 p-3 text-center">
            <div className="text-orange-400 text-2xl font-bold">24/7</div>
            <div className="text-gray-400 text-xs uppercase">Monitoring</div>
          </div>
        </div>

        {/* Live Stock Feed */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">LIVE SIGNALS</h4>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-xs">ACTIVE</span>
            </div>
          </div>

          {animatedStocks.map((stock, index) => (
            <div 
              key={stock.symbol}
              className="flex items-center justify-between p-3 bg-gray-900/50 border border-gray-700/50 hover:border-green-400/30 transition-all duration-300"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                transform: glitchEffect ? `translateX(${Math.random() * 4 - 2}px)` : 'none'
              }}
            >
              <div className="flex items-center space-x-4">
                <div className="text-white font-bold text-sm">{stock.symbol}</div>
                <div className="text-gray-300 text-sm">${stock.price.toFixed(2)}</div>
                <div className={`flex items-center space-x-1 text-sm ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stock.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}</span>
                  <span>({stock.changePercent.toFixed(2)}%)</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className={`text-xs font-bold px-2 py-1 rounded ${
                    stock.signal === 'BUY' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    stock.signal === 'SELL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {stock.signal}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white text-sm font-bold">{stock.confidence.toFixed(0)}%</div>
                  <div className="text-gray-400 text-xs">CONFIDENCE</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Action Bar */}
        <div className="mt-6 pt-4 border-t border-green-400/20 flex justify-between items-center">
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <Target className="w-3 h-3" />
              <span>SCANNING 50+ STOCKS</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="w-3 h-3" />
              <span>REAL-TIME ANALYSIS</span>
            </div>
          </div>
          <div className="text-green-400 text-xs font-bold animate-pulse">
            ● SYSTEM ACTIVE
          </div>
        </div>
      </div>

      {/* Glitch Overlay Effect */}
      {glitchEffect && (
        <div className="absolute inset-0 bg-green-400/5 pointer-events-none animate-pulse"></div>
      )}
    </div>
  );
}
