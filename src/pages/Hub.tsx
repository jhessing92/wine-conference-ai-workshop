import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wine, ChevronRight, ChevronDown, ChevronUp, Wifi, Clock, Users, Sparkles, BookOpen, ArrowLeft, TrendingUp, Calendar, Zap } from 'lucide-react';

export default function Hub() {
  const [showSplash, setShowSplash] = useState(true);
  const [troubleshootOpen, setTroubleshootOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-shoofly-900 flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
        <div className="relative text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center shadow-glow-cyan">
            <Wine className="w-10 h-10 text-shoofly-900" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white font-display">ShooflyAI</h1>
            <p className="text-cyan-400 font-medium">x GWP 2026</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-bg">
      <div className="px-4 py-8 max-w-lg mx-auto space-y-6 relative">
        <div className="text-center space-y-5 pt-8 pb-4">
          <img
            src="https://i.imgur.com/E6quH0d.png"
            alt="Shoofly Logo"
            className="h-12 mx-auto mb-4"
          />

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-400">ShooflyAI x GWP 2026</span>
          </div>

          <h1 className="text-4xl font-bold text-white font-display">
            AI Can Do That
          </h1>
          <p className="text-xl font-semibold gradient-text">Winery Edition</p>

          <p className="text-slate-500 text-sm">
            Feb 3, 2026 | Forsyth Conference Center
          </p>

          <Link
            to="/gwp-2026/slides"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Deck
          </Link>
        </div>

        <div className="space-y-3">
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider px-1">Exercises</p>

          <Link to="/gwp-2026/1-tasting-notes" className="block">
            <div className="card p-4 flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-wine-500/10 border border-wine-500/20 flex items-center justify-center">
                <Wine className="w-6 h-6 text-wine-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">1</span>
                  <h3 className="text-white font-semibold text-sm">Tasting Notes</h3>
                </div>
                <p className="text-slate-500 text-xs">3 versions from one wine</p>
              </div>
              <span className="text-xs text-slate-600 bg-white/5 px-2 py-1 rounded-lg">5 min</span>
            </div>
          </Link>

          <Link to="/gwp-2026/2-role-track" className="block">
            <div className="card p-4 flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-amber-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">2</span>
                  <h3 className="text-white font-semibold text-sm">Role Track</h3>
                </div>
                <p className="text-slate-500 text-xs">Pick your seat</p>
              </div>
              <span className="text-xs text-slate-600 bg-white/5 px-2 py-1 rounded-lg">8 min</span>
            </div>
          </Link>

          <Link to="/gwp-2026/3-event-marketing" className="block">
            <div className="card p-4 flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-teal-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">3</span>
                  <h3 className="text-white font-semibold text-sm">Event Marketing</h3>
                </div>
                <p className="text-slate-500 text-xs">Full kit in 60 seconds</p>
              </div>
              <span className="text-xs text-slate-600 bg-white/5 px-2 py-1 rounded-lg">5 min</span>
            </div>
          </Link>

          <Link to="/gwp-2026/4-numbers-to-decisions" className="block">
            <div className="card p-4 flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">4</span>
                  <h3 className="text-white font-semibold text-sm">Numbers to Decisions</h3>
                </div>
                <p className="text-slate-500 text-xs">One action this week</p>
              </div>
              <span className="text-xs text-slate-600 bg-white/5 px-2 py-1 rounded-lg">5 min</span>
            </div>
          </Link>

          <Link to="/gwp-2026/5-lightning-lab" className="block">
            <div className="card p-4 flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">5</span>
                  <h3 className="text-white font-semibold text-sm">Lightning Lab</h3>
                </div>
                <p className="text-slate-500 text-xs">Quick tools</p>
              </div>
              <span className="text-xs text-slate-600 bg-white/5 px-2 py-1 rounded-lg">5 min</span>
            </div>
          </Link>

          <div className="pt-2">
            <Link to="/gwp-2026/prompt-pack" className="block">
              <div className="card p-4 flex items-center gap-4 group border-cyan-400/20">
                <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-sm">Take-Home Toolkit</h3>
                  <p className="text-slate-500 text-xs">Your saved prompts and results</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
              </div>
            </Link>
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            How this works
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { step: '1', label: 'Scan', color: 'cyan' },
              { step: '2', label: 'Fill blanks', color: 'teal' },
              { step: '3', label: 'Generate', color: 'wine' },
              { step: '4', label: 'Save', color: 'cyan' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className={`w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center font-bold text-lg
                  ${item.color === 'cyan' ? 'bg-cyan-400/10 border border-cyan-400/30 text-cyan-400' : ''}
                  ${item.color === 'teal' ? 'bg-teal-400/10 border border-teal-400/30 text-teal-400' : ''}
                  ${item.color === 'wine' ? 'bg-wine-400/10 border border-wine-400/30 text-wine-400' : ''}
                `}>
                  {item.step}
                </div>
                <span className="text-xs text-slate-400 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card overflow-hidden">
          <button
            onClick={() => setTroubleshootOpen(!troubleshootOpen)}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
          >
            <span className="text-slate-300 font-semibold">Need help?</span>
            {troubleshootOpen ? (
              <ChevronUp className="w-5 h-5 text-slate-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-500" />
            )}
          </button>

          {troubleshootOpen && (
            <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Wifi className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">No signal?</p>
                  <p className="text-slate-500 text-sm">Use "Sample" buttons. They work offline.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Running behind?</p>
                  <p className="text-slate-500 text-sm">Skip ahead. Catch up later in the Toolkit.</p>
                </div>
              </div>

            </div>
          )}
        </div>

        <div className="text-center pt-4 pb-8">
          <p className="text-slate-600 text-sm font-medium">
            AI drafts. You decide.
          </p>
        </div>
      </div>
    </div>
  );
}
