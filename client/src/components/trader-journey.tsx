'use client';

import React, { useState, useEffect } from 'react';
import { User, Clock, TrendingUp, Building, Briefcase, Coffee, Moon, Sun } from 'lucide-react';

interface TraderProfile {
  id: string;
  name: string;
  type: string;
  avatar: string;
  schedule: string;
  challenge: string;
  solution: string;
  result: string;
  icon: React.ComponentType<any>;
  color: string;
  timeSlots: string[];
}

const traderProfiles: TraderProfile[] = [
  {
    id: 'daytrader',
    name: 'Alex',
    type: 'Day Trader',
    avatar: 'A',
    schedule: '9:30 AM - 4:00 PM',
    challenge: 'Making 10-20 trades daily, but missing the best entry points',
    solution: 'Gets alerts 15 minutes before major moves',
    result: 'Increased win rate from 45% to 72%',
    icon: TrendingUp,
    color: 'green',
    timeSlots: ['9:30', '10:15', '11:45', '1:30', '2:45', '3:15']
  },
  {
    id: 'swingtrader',
    name: 'Sarah',
    type: 'Swing Trader',
    avatar: 'S',
    schedule: 'Evenings & Weekends',
    challenge: 'Full-time job, limited time to analyze markets',
    solution: 'Automated scanning finds the best setups',
    result: 'Finds 3x more opportunities with 1/10th the time',
    icon: Coffee,
    color: 'blue',
    timeSlots: ['6:00 PM', '7:30 PM', 'Sat 10 AM', 'Sun 2 PM']
  },
  {
    id: 'institutional',
    name: 'Marcus',
    type: 'Fund Manager',
    avatar: 'M',
    schedule: '24/7 Global Markets',
    challenge: 'Managing $50M+ across multiple strategies',
    solution: 'Scales analysis across hundreds of stocks',
    result: 'Improved fund performance by 23% annually',
    icon: Building,
    color: 'purple',
    timeSlots: ['Pre-Market', 'Regular', 'After Hours', 'International']
  }
];

export default function TraderJourney() {
  const [selectedTrader, setSelectedTrader] = useState<string>('daytrader');
  const [currentTimeSlot, setCurrentTimeSlot] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const selectedProfile = traderProfiles.find(p => p.id === selectedTrader)!;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimeSlot(prev => (prev + 1) % selectedProfile.timeSlots.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedProfile]);

  const handleTraderSelect = (traderId: string) => {
    if (traderId !== selectedTrader) {
      setIsAnimating(true);
      setTimeout(() => {
        setSelectedTrader(traderId);
        setCurrentTimeSlot(0);
        setIsAnimating(false);
      }, 300);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-mono tracking-tight mb-6">
          EVERY TRADER'S SUCCESS STORY
        </h2>
        <p className="text-gray-400 font-mono text-lg uppercase tracking-[0.2em] font-light">
          See how different traders use BullzEye
        </p>
      </div>

      {/* Trader Selection */}
      <div className="flex justify-center mb-12">
        <div className="flex space-x-4 bg-black/60 border border-white/20 p-2 rounded-lg">
          {traderProfiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => handleTraderSelect(profile.id)}
              className={`
                flex items-center space-x-3 px-6 py-3 rounded font-mono text-sm transition-all duration-300
                ${selectedTrader === profile.id 
                  ? `bg-${profile.color}-500/20 border border-${profile.color}-500/50 text-${profile.color}-400` 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <profile.icon className="w-4 h-4" />
              <span>{profile.type}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Journey Display */}
      <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Card */}
          <div className={`bg-${selectedProfile.color}-500/10 border border-${selectedProfile.color}-500/30 p-6`}>
            <div className="flex items-center space-x-4 mb-6">
              <div className={`w-16 h-16 bg-${selectedProfile.color}-500/20 border border-${selectedProfile.color}-500/50 flex items-center justify-center font-mono font-black text-${selectedProfile.color}-400 text-xl`}>
                {selectedProfile.avatar}
              </div>
              <div>
                <h3 className="text-white font-mono font-bold text-xl">{selectedProfile.name}</h3>
                <p className={`text-${selectedProfile.color}-400 font-mono text-sm uppercase tracking-wider`}>
                  {selectedProfile.type}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-gray-400 font-mono text-xs uppercase tracking-wider mb-1">SCHEDULE</div>
                <div className="text-white font-mono text-sm">{selectedProfile.schedule}</div>
              </div>

              {/* Active Time Slots */}
              <div>
                <div className="text-gray-400 font-mono text-xs uppercase tracking-wider mb-2">ACTIVE TIMES</div>
                <div className="flex flex-wrap gap-2">
                  {selectedProfile.timeSlots.map((slot, index) => (
                    <div
                      key={slot}
                      className={`
                        px-2 py-1 font-mono text-xs border rounded transition-all duration-300
                        ${index === currentTimeSlot 
                          ? `bg-${selectedProfile.color}-500/30 border-${selectedProfile.color}-500 text-${selectedProfile.color}-400 animate-pulse` 
                          : 'bg-gray-800/50 border-gray-600 text-gray-400'
                        }
                      `}
                    >
                      {slot}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Journey Steps */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Challenge */}
            <div className="bg-red-500/10 border border-red-500/30 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-red-500/20 border border-red-500/50 flex items-center justify-center font-mono font-bold text-red-400 text-sm rounded-full">
                  1
                </div>
                <h4 className="text-red-400 font-mono font-bold text-lg uppercase tracking-wider">
                  THE CHALLENGE
                </h4>
              </div>
              <p className="text-gray-300 font-mono text-sm leading-relaxed">
                {selectedProfile.challenge}
              </p>
            </div>

            {/* Solution */}
            <div className={`bg-${selectedProfile.color}-500/10 border border-${selectedProfile.color}-500/30 p-6`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-8 h-8 bg-${selectedProfile.color}-500/20 border border-${selectedProfile.color}-500/50 flex items-center justify-center font-mono font-bold text-${selectedProfile.color}-400 text-sm rounded-full`}>
                  2
                </div>
                <h4 className={`text-${selectedProfile.color}-400 font-mono font-bold text-lg uppercase tracking-wider`}>
                  BULLZEYE SOLUTION
                </h4>
              </div>
              <p className="text-gray-300 font-mono text-sm leading-relaxed">
                {selectedProfile.solution}
              </p>
            </div>

            {/* Result */}
            <div className="bg-green-500/10 border border-green-500/30 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-500/20 border border-green-500/50 flex items-center justify-center font-mono font-bold text-green-400 text-sm rounded-full">
                  3
                </div>
                <h4 className="text-green-400 font-mono font-bold text-lg uppercase tracking-wider">
                  THE RESULT
                </h4>
              </div>
              <p className="text-gray-300 font-mono text-sm leading-relaxed mb-4">
                {selectedProfile.result}
              </p>
              
              {/* Success Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-500/20 border border-green-500/30 p-3 text-center">
                  <div className="text-green-400 font-mono text-xl font-bold">
                    {selectedProfile.id === 'daytrader' ? '72%' : 
                     selectedProfile.id === 'swingtrader' ? '3x' : '23%'}
                  </div>
                  <div className="text-gray-400 font-mono text-xs uppercase">
                    {selectedProfile.id === 'daytrader' ? 'Win Rate' : 
                     selectedProfile.id === 'swingtrader' ? 'More Opportunities' : 'Performance Boost'}
                  </div>
                </div>
                <div className="bg-green-500/20 border border-green-500/30 p-3 text-center">
                  <div className="text-green-400 font-mono text-xl font-bold">
                    {selectedProfile.id === 'daytrader' ? '$2.4M' : 
                     selectedProfile.id === 'swingtrader' ? '90%' : '$50M+'}
                  </div>
                  <div className="text-gray-400 font-mono text-xs uppercase">
                    {selectedProfile.id === 'daytrader' ? 'Avg Profit' : 
                     selectedProfile.id === 'swingtrader' ? 'Time Saved' : 'Assets Managed'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
