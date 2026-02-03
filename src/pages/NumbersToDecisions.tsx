import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, BarChart2, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import MobileLayout from '../components/MobileLayout';
import { ChipGroup, LoadingState, CompletionModal, Toast, MicroPoll, ErrorCard, NextButton } from '../components/shared';
import { generateWithClaude, saveToToolkit, saveToPoll } from '../lib/supabase';
import { fallbackData, getPersonalizedFallback } from '../lib/fallbackData';

const focusOptions = ['Inventory', 'Pricing', 'Conversion', 'Club signups'];

interface NumbersResult {
  bestChart: string;
  mainInsight: string;
  actionThisWeek: string;
  riskToWatch: string;
}

export default function NumbersToDecisions() {
  const navigate = useNavigate();
  const [useSample, setUseSample] = useState(true);
  const [pastedData, setPastedData] = useState('');
  const [focus, setFocus] = useState('Inventory');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<NumbersResult | null>(null);
  const [error, setError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [pollSubmitted, setPollSubmitted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(false);

    const response = await generateWithClaude('numbers-to-action', {
      data: useSample ? undefined : pastedData,
      focus,
    });

    setIsLoading(false);

    if (response.success && response.result) {
      setResult(response.result as NumbersResult);
    } else if (response.fallback) {
      setResult(getPersonalizedFallback('numbers-to-action') as NumbersResult);
    } else {
      setError(true);
    }
  };

  const handleUseSample = () => {
    setUseSample(true);
    setResult(getPersonalizedFallback('numbers-to-action') as NumbersResult);
    setError(false);
  };

  const handleCopy = () => {
    if (result) {
      const text = `Best Chart: ${result.bestChart}\n\nMain Insight: ${result.mainInsight}\n\nAction This Week: ${result.actionThisWeek}\n\nRisk to Watch: ${result.riskToWatch}`;
      navigator.clipboard.writeText(text);
    }
  };

  const handleSave = async () => {
    if (result) {
      saveToToolkit('Numbers to Decisions', 'Data Analysis', result as unknown as Record<string, unknown>, 'numbers-analysis');
      setIsSaved(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  const handlePollResponse = async (response: string) => {
    await saveToPoll('numbers-to-action', response);
    setPollSubmitted(true);
  };

  return (
    <MobileLayout title="Numbers to One Action">
      {!result && !isLoading && !error && (
        <>
          <div className="card p-6 space-y-6">
            <div>
              <h3 className="text-white font-semibold mb-3">Your data</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setUseSample(true)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    useSample ? 'border-cyan-400/50 bg-cyan-400/10' : 'border-white/10 bg-white/5'
                  }`}
                >
                  <span className={useSample ? 'text-cyan-400 font-medium' : 'text-slate-300'}>Use sample data</span>
                  <p className="text-slate-500 text-xs mt-1">Monthly sales: Jan $45K, Feb $38K, Mar $52K, Apr $61K</p>
                </button>

                <div>
                  <button
                    onClick={() => setUseSample(false)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      !useSample ? 'border-cyan-400/50 bg-cyan-400/10' : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <span className={!useSample ? 'text-cyan-400 font-medium' : 'text-slate-300'}>Paste your numbers</span>
                  </button>

                  {!useSample && (
                    <textarea
                      value={pastedData}
                      onChange={(e) => setPastedData(e.target.value)}
                      placeholder="Paste any numbers - sales, inventory, conversions..."
                      className="textarea-field mt-3 h-28"
                    />
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Focus area</h3>
              <ChipGroup options={focusOptions} selected={focus} onChange={setFocus} />
            </div>
          </div>

          <button onClick={handleGenerate} className="btn-primary flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Generate with Vineyard AI
          </button>
        </>
      )}

      {isLoading && <LoadingState message="Analyzing your numbers" />}

      {error && (
        <ErrorCard
          onRetry={handleGenerate}
          onUseSample={handleUseSample}
          onBack={() => navigate('/gwp-2026')}
        />
      )}

      {result && !isLoading && !error && (
        <>
          <div className="space-y-4">
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <BarChart2 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide">Best Chart</p>
                  <p className="text-white font-medium">{result.bestChart}</p>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide">Main Insight</p>
                </div>
              </div>
              <p className="text-slate-300">{result.mainInsight}</p>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide">One Action This Week</p>
                </div>
              </div>
              <p className="text-slate-300">{result.actionThisWeek}</p>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide">Risk to Watch</p>
                </div>
              </div>
              <p className="text-slate-300">{result.riskToWatch}</p>
            </div>
          </div>

          {isSaved && (
            <MicroPoll
              question="Would you use this monthly?"
              onResponse={handlePollResponse}
              submitted={pollSubmitted}
            />
          )}

          {pollSubmitted && (
            <Link to="/gwp-2026/beta" className="block card-glow p-4 text-center">
              <p className="text-cyan-400 text-sm font-medium">Want early access to the Winery AI Beta?</p>
            </Link>
          )}

          {!showCompletionModal && (
            <NextButton onClick={() => setShowCompletionModal(true)} />
          )}

          {showCompletionModal && (
            <CompletionModal
              onSave={() => { handleSave(); setIsSaved(true); }}
              onCopy={handleCopy}
              onSkip={() => navigate('/gwp-2026/5-lightning-lab')}
              isSaved={isSaved}
              nextPath="/gwp-2026/5-lightning-lab"
            />
          )}
        </>
      )}

      <Toast message="Saved to Toolkit" visible={showToast} />
    </MobileLayout>
  );
}
