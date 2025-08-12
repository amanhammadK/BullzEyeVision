'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, ArrowRight, Clock, Brain, TrendingUp, Shield } from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  painLevel: number;
}

interface Solution {
  id: string;
  title: string;
  description: string;
  benefit: string;
  icon: React.ComponentType<any>;
}

const problems: Problem[] = [
  {
    id: 'timing',
    title: 'Missing the Perfect Moment',
    description: 'You see a stock moving, but by the time you act, the opportunity is gone. Always one step behind.',
    icon: Clock,
    painLevel: 95
  },
  {
    id: 'overload',
    title: 'Information Overwhelm',
    description: 'Charts, news, indicators everywhere. Too much data, not enough clarity. Analysis paralysis.',
    icon: Brain,
    painLevel: 88
  },
  {
    id: 'emotions',
    title: 'Emotional Rollercoaster',
    description: 'Fear makes you sell too early. Greed makes you hold too long. Your emotions are your enemy.',
    icon: TrendingUp,
    painLevel: 92
  },
  {
    id: 'risk',
    title: 'Unpredictable Losses',
    description: 'One bad trade wipes out weeks of gains. No clear exit strategy. Flying blind.',
    icon: Shield,
    painLevel: 97
  }
];

const solutions: Solution[] = [
  {
    id: 'timing',
    title: 'See the Future',
    description: 'Get alerts 15-30 minutes BEFORE major moves happen',
    benefit: 'Never miss another opportunity',
    icon: CheckCircle
  },
  {
    id: 'overload',
    title: 'Crystal Clear Signals',
    description: 'One simple signal: BUY, SELL, or HOLD. No confusion.',
    benefit: 'Make decisions in seconds',
    icon: CheckCircle
  },
  {
    id: 'emotions',
    title: 'Remove Human Error',
    description: 'AI makes cold, calculated decisions. No fear, no greed.',
    benefit: 'Consistent, logical trading',
    icon: CheckCircle
  },
  {
    id: 'risk',
    title: 'Smart Protection',
    description: 'Automatic stop-losses and profit targets built in',
    benefit: 'Sleep peacefully at night',
    icon: CheckCircle
  }
];

export default function ProblemSolutionInteractive() {
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'problems' | 'transition' | 'solutions'>('problems');

  useEffect(() => {
    if (selectedProblem) {
      setAnimationPhase('transition');
      setTimeout(() => {
        setShowSolution(true);
        setAnimationPhase('solutions');
      }, 800);
    }
  }, [selectedProblem]);

  const handleProblemClick = (problemId: string) => {
    if (selectedProblem === problemId) {
      // Reset
      setSelectedProblem(null);
      setShowSolution(false);
      setAnimationPhase('problems');
    } else {
      setSelectedProblem(problemId);
      setShowSolution(false);
    }
  };

  const selectedSolution = solutions.find(s => s.id === selectedProblem);

  return (
    <div className="w-full max-w-7xl mx-auto px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground font-mono tracking-tight mb-6">
          EVERY TRADER'S NIGHTMARE
        </h2>
        <p className="text-gray-700 dark:text-gray-400 font-mono text-lg uppercase tracking-[0.2em] font-light">
          Click on your biggest trading pain point
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Problems Side */}
        <div className="space-y-4">
          <div className="text-red-400 font-mono text-sm uppercase tracking-wider mb-6 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            THE PROBLEMS
          </div>
          
          {problems.map((problem, index) => (
            <div
              key={problem.id}
              onClick={() => handleProblemClick(problem.id)}
              className={`
                relative p-6 border cursor-pointer transition-all duration-500 transform
                ${selectedProblem === problem.id 
                  ? 'border-red-500 bg-red-500/10 scale-105 shadow-lg shadow-red-500/20' 
                  : 'border-red-500/30 bg-red-500/5 hover:border-red-500/50 hover:bg-red-500/10'
                }
                ${animationPhase === 'transition' && selectedProblem === problem.id ? 'animate-pulse' : ''}
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start space-x-4">
                <problem.icon className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-foreground font-mono font-bold text-lg mb-2">
                    {problem.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 font-mono text-sm leading-relaxed mb-3">
                    {problem.description}
                  </p>
                  
                  {/* Pain Level Bar */}
                  <div className="flex items-center space-x-3">
                    <span className="text-red-400 font-mono text-xs">PAIN LEVEL:</span>
                    <div className="flex-1 bg-gray-300 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-1000"
                        style={{ width: `${problem.painLevel}%` }}
                      />
                    </div>
                    <span className="text-red-400 font-mono text-xs font-bold">
                      {problem.painLevel}%
                    </span>
                  </div>
                </div>
              </div>

              {selectedProblem === problem.id && (
                <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
                  <ArrowRight className="w-8 h-8 text-green-400 animate-bounce" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Solution Side */}
        <div className="relative">
          {!showSolution ? (
            <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <div className="text-center">
                <div className="text-gray-600 dark:text-gray-500 font-mono text-lg mb-2">
                  Select a problem to see the solution
                </div>
                <div className="text-gray-700 dark:text-gray-600 font-mono text-sm">
                  Click on any pain point ←
                </div>
              </div>
            </div>
          ) : selectedSolution && (
            <div className="animate-fadeIn">
              <div className="text-green-400 font-mono text-sm uppercase tracking-wider mb-6 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                THE SOLUTION
              </div>
              
              <div className="border border-green-500 bg-green-500/10 p-8 relative overflow-hidden">
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
                
                <div className="relative z-10">
                  <div className="flex items-start space-x-4 mb-6">
                    <selectedSolution.icon className="w-8 h-8 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-foreground font-mono font-bold text-2xl mb-3">
                        {selectedSolution.title}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 font-mono text-lg leading-relaxed mb-4">
                        {selectedSolution.description}
                      </p>
                    </div>
                  </div>

                  <div className="bg-green-500/20 border border-green-500/30 p-4 rounded">
                    <div className="text-green-400 font-mono text-sm uppercase tracking-wider mb-2">
                      RESULT:
                    </div>
                    <div className="text-foreground font-mono font-bold text-lg">
                      {selectedSolution.benefit}
                    </div>
                  </div>

                  {/* Success metrics */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-green-400 font-mono text-2xl font-bold">70%</div>
                      <div className="text-gray-400 font-mono text-xs">SUCCESS RATE</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-400 font-mono text-2xl font-bold">95%</div>
                      <div className="text-gray-400 font-mono text-xs">TIME SAVED</div>
                    </div>
                  </div>
                </div>

                {/* Animated particles */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-green-400 rounded-full animate-ping" />
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-green-400 rounded-full animate-pulse" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
