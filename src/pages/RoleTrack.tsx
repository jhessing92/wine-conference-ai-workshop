import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Leaf, Users, Sparkles, ChevronRight } from 'lucide-react';
import MobileLayout from '../components/MobileLayout';
import { ChipGroup, LoadingState, ResultCard, CompletionModal, Toast, MicroPoll, ErrorCard, NextButton } from '../components/shared';
import { generateWithClaude, saveToToolkit, saveToPoll } from '../lib/supabase';
import { fallbackData, getPersonalizedFallback } from '../lib/fallbackData';

type Role = 'owner' | 'vineyard' | 'tasting-room' | null;

const roleOptions = [
  { id: 'owner', label: 'Owner', sublabel: 'Numbers to decisions', icon: TrendingUp, color: 'amber' },
  { id: 'vineyard', label: 'Vineyard', sublabel: '7-day plan', icon: Leaf, color: 'teal' },
  { id: 'tasting-room', label: 'Tasting Room', sublabel: 'Scripts that protect the brand', icon: Users, color: 'wine' },
];

export default function RoleTrack() {
  const [selectedRole, setSelectedRole] = useState<Role>(null);

  return (
    <MobileLayout
      title="Pick your seat"
      showDisclaimer={selectedRole === 'vineyard' ? 'vineyard' : null}
    >
      {!selectedRole ? (
        <div className="space-y-4">
          <p className="text-slate-400 text-center text-sm mb-6">
            Everyone does this step at the same time. Pick the role that fits you best today.
          </p>

          {roleOptions.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id as Role)}
              className="w-full card p-5 flex items-center gap-4 group"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center
                ${role.color === 'amber' ? 'bg-amber-500/10 border border-amber-500/20' : ''}
                ${role.color === 'teal' ? 'bg-teal-500/10 border border-teal-500/20' : ''}
                ${role.color === 'wine' ? 'bg-wine-500/10 border border-wine-500/20' : ''}
              `}>
                <role.icon className={`w-7 h-7
                  ${role.color === 'amber' ? 'text-amber-400' : ''}
                  ${role.color === 'teal' ? 'text-teal-400' : ''}
                  ${role.color === 'wine' ? 'text-wine-400' : ''}
                `} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-white font-semibold text-lg">{role.label}</h3>
                <p className="text-slate-500 text-sm">{role.sublabel}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
            </button>
          ))}
        </div>
      ) : selectedRole === 'owner' ? (
        <OwnerLane onBack={() => setSelectedRole(null)} />
      ) : selectedRole === 'vineyard' ? (
        <VineyardLane onBack={() => setSelectedRole(null)} />
      ) : (
        <TastingRoomLane onBack={() => setSelectedRole(null)} />
      )}
    </MobileLayout>
  );
}

function OwnerLane({ onBack }: { onBack: () => void }) {
  const [useSample, setUseSample] = useState(true);
  const [pastedData, setPastedData] = useState('');
  const [focus, setFocus] = useState('General overview');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<typeof fallbackData['owner-analysis'] | null>(null);
  const [error, setError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [pollSubmitted, setPollSubmitted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const focusOptions = ['Inventory focus', 'Pricing focus', 'Club focus', 'General overview'];

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(false);

    const response = await generateWithClaude('owner-analysis', {
      data: useSample ? undefined : pastedData,
      focus,
    });

    setIsLoading(false);

    if (response.success && response.result) {
      setResult(response.result as typeof fallbackData['owner-analysis']);
    } else if (response.fallback) {
      setResult(getPersonalizedFallback('owner-analysis'));
    } else {
      setError(true);
    }
  };

  const handleCopy = () => {
    if (result) {
      const text = `Top Wines:\n${result.topWines.map(w => `${w.name}: ${w.revenue}`).join('\n')}\n\nInsights:\n${result.whatThisMeans.join('\n')}\n\nThis Week:\n${result.decisionsThisWeek.map(d => d.action).join('\n')}`;
      navigator.clipboard.writeText(text);
    }
  };

  const handleSave = async () => {
    if (result) {
      saveToToolkit('Owner', 'Sales Email', result, 'owner-email');
      setIsSaved(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  if (isLoading) return <LoadingState message="Analyzing your numbers" />;
  if (error) return (
    <ErrorCard
      onRetry={handleGenerate}
      onUseSample={() => { setUseSample(true); setResult(getPersonalizedFallback('owner-analysis')); setError(false); }}
      onBack={onBack}
    />
  );

  if (result) {
    return (
      <>
        <button onClick={onBack} className="text-slate-500 text-sm mb-4 hover:text-white transition-colors">
          Back to roles
        </button>

        <div className="space-y-4">
          <ResultCard title="Top 5 Performers">
            <div className="space-y-2">
              {result.topWines.map((wine, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-slate-300">{wine.name}</span>
                  <span className="text-teal-400 font-semibold">{wine.revenue}</span>
                </div>
              ))}
            </div>
          </ResultCard>

          <ResultCard title="Bottom Performers">
            <div className="space-y-2">
              {result.bottomWines.map((wine, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <div>
                    <span className="text-slate-300">{wine.name}</span>
                    <p className="text-xs text-slate-500">{wine.insight}</p>
                  </div>
                  <span className="text-amber-400 font-semibold">{wine.revenue}</span>
                </div>
              ))}
            </div>
          </ResultCard>

          <ResultCard title="What This Means">
            <ul className="space-y-2">
              {result.whatThisMeans.map((insight, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">-</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </ResultCard>

          <ResultCard title="3 Decisions This Week">
            <div className="space-y-3">
              {result.decisionsThisWeek.map((decision, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className={`text-xs px-2 py-1 rounded-lg font-medium ${
                    decision.category === 'inventory' ? 'bg-amber-500/20 text-amber-400' :
                    decision.category === 'pricing' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-teal-500/20 text-teal-400'
                  }`}>
                    {decision.category}
                  </span>
                  <span className="flex-1 text-slate-300">{decision.action}</span>
                </div>
              ))}
            </div>
          </ResultCard>
        </div>

        {isSaved && (
          <MicroPoll
            question="Would you use this monthly?"
            onResponse={(r) => { saveToPoll('owner-analysis', r); setPollSubmitted(true); }}
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
            onSkip={onBack}
            isSaved={isSaved}
            nextPath="/gwp-2026/3-event-marketing"
          />
        )}
        <Toast message="Saved to Toolkit" visible={showToast} />
      </>
    );
  }

  return (
    <>
      <button onClick={onBack} className="text-slate-500 text-sm mb-4 hover:text-white transition-colors">
        Back to roles
      </button>

      <div className="card p-6 space-y-6">
        <div>
          <h3 className="text-white font-semibold mb-3">Your sales data</h3>
          <div className="space-y-3">
            <button
              onClick={() => setUseSample(true)}
              className={`w-full p-4 rounded-xl border text-left transition-all ${
                useSample ? 'border-cyan-400/50 bg-cyan-400/10' : 'border-white/10 bg-white/5'
              }`}
            >
              <span className={useSample ? 'text-cyan-400 font-medium' : 'text-slate-300'}>Use sample data</span>
            </button>

            {useSample && (
              <div className="mt-3 p-4 rounded-xl bg-slate-800/50 border border-white/5">
                <p className="text-slate-500 text-xs uppercase tracking-wide mb-2">Sample Sales Data</p>
                <div className="space-y-1.5 text-sm text-slate-400">
                  <div className="flex justify-between"><span>Reserve Cab</span><span className="text-slate-300">$12,450</span></div>
                  <div className="flex justify-between"><span>Estate Chard</span><span className="text-slate-300">$8,200</span></div>
                  <div className="flex justify-between"><span>Rosé</span><span className="text-slate-300">$6,800</span></div>
                  <div className="flex justify-between"><span>Merlot</span><span className="text-slate-300">$4,100</span></div>
                  <div className="flex justify-between"><span>Late Harvest</span><span className="text-slate-300">$2,350</span></div>
                </div>
              </div>
            )}

            <div>
              <button
                onClick={() => setUseSample(false)}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  !useSample ? 'border-cyan-400/50 bg-cyan-400/10' : 'border-white/10 bg-white/5'
                }`}
              >
                <span className={!useSample ? 'text-cyan-400 font-medium' : 'text-slate-300'}>Paste your own</span>
              </button>

              {!useSample && (
                <textarea
                  value={pastedData}
                  onChange={(e) => setPastedData(e.target.value)}
                  placeholder="Paste sales data here (any format)"
                  className="textarea-field mt-3 h-24"
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
  );
}

function VineyardLane({ onBack }: { onBack: () => void }) {
  const [season, setSeason] = useState('Veraison');
  const [risks, setRisks] = useState('Normal conditions');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<typeof fallbackData['vineyard-planning'] | null>(null);
  const [error, setError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [pollSubmitted, setPollSubmitted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const seasonOptions = ['Dormant', 'Bud break', 'Bloom', 'Veraison', 'Harvest'];
  const riskOptions = ['Freeze', 'Rain', 'Mildew pressure', 'Heat', 'Normal conditions'];

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(false);

    const response = await generateWithClaude('vineyard-planning', { season, risks });

    setIsLoading(false);

    if (response.success && response.result) {
      setResult(response.result as typeof fallbackData['vineyard-planning']);
    } else if (response.fallback) {
      setResult(getPersonalizedFallback('vineyard-planning'));
    } else {
      setError(true);
    }
  };

  const handleCopy = () => {
    if (result) {
      const text = result.weeklyChecklist.map(d => `${d.day}: ${d.tasks.join(', ')}`).join('\n');
      navigator.clipboard.writeText(text);
    }
  };

  const handleSave = async () => {
    if (result) {
      saveToToolkit('Vineyard', '7-Day Checklist', result, 'vineyard-checklist');
      setIsSaved(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  if (isLoading) return <LoadingState message="Planning your week" />;
  if (error) return (
    <ErrorCard
      onRetry={handleGenerate}
      onUseSample={() => { setResult(getPersonalizedFallback('vineyard-planning')); setError(false); }}
      onBack={onBack}
    />
  );

  if (result) {
    return (
      <>
        <button onClick={onBack} className="text-slate-500 text-sm mb-4 hover:text-white">Back to roles</button>

        <div className="space-y-4">
          <ResultCard title="Weekly Checklist">
            <div className="space-y-3">
              {result.weeklyChecklist.map((day, i) => (
                <div key={i} className="border-b border-white/5 pb-3 last:border-0">
                  <p className="text-teal-400 font-medium text-sm">{day.day}</p>
                  <ul className="mt-1 space-y-1">
                    {day.tasks.map((task, j) => (
                      <li key={j} className="text-slate-400 text-sm flex items-start gap-2">
                        <span className="text-slate-600">-</span>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ResultCard>

          <ResultCard title="Decision Tree">
            <div className="space-y-2">
              {result.decisionTree.map((item, i) => (
                <div key={i} className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
                  <p className="text-amber-400 text-xs font-medium">{item.condition}</p>
                  <p className="text-slate-300 text-sm mt-1">Then: {item.action}</p>
                </div>
              ))}
            </div>
          </ResultCard>

          <ResultCard title="Questions for Your Expert">
            <ul className="space-y-2">
              {result.questionsForExpert.map((q, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-medium">{i + 1}.</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </ResultCard>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <p className="text-amber-400 text-xs">{result.disclaimer}</p>
          </div>
        </div>

        {isSaved && (
          <MicroPoll
            question="Would you use this monthly?"
            onResponse={(r) => { saveToPoll('vineyard-planning', r); setPollSubmitted(true); }}
            submitted={pollSubmitted}
          />
        )}

        {!showCompletionModal && (
          <NextButton onClick={() => setShowCompletionModal(true)} />
        )}

        {showCompletionModal && (
          <CompletionModal
            onSave={() => { handleSave(); setIsSaved(true); }}
            onCopy={handleCopy}
            onSkip={onBack}
            isSaved={isSaved}
            nextPath="/gwp-2026/3-event-marketing"
          />
        )}
        <Toast message="Saved to Toolkit" visible={showToast} />
      </>
    );
  }

  return (
    <>
      <button onClick={onBack} className="text-slate-500 text-sm mb-4 hover:text-white">Back to roles</button>

      <div className="card p-6 space-y-6">
        <div>
          <h3 className="text-white font-semibold mb-3">Season stage</h3>
          <ChipGroup options={seasonOptions} selected={season} onChange={setSeason} />
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Risk factors</h3>
          <ChipGroup options={riskOptions} selected={risks} onChange={setRisks} />
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">7-day forecast</h3>
          <button
            className="w-full p-4 rounded-xl border border-cyan-400/50 bg-cyan-400/10 text-left"
          >
            <span className="text-cyan-400 font-medium">Using sample forecast</span>
          </button>
          <div className="mt-3 p-4 rounded-xl bg-slate-800/50 border border-white/5">
            <p className="text-slate-500 text-xs uppercase tracking-wide mb-2">Sample 7-Day Forecast</p>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              <div className="space-y-1">
                <span className="text-slate-500">Mon</span>
                <div className="text-amber-400">82°</div>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500">Tue</span>
                <div className="text-amber-400">85°</div>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500">Wed</span>
                <div className="text-cyan-400">78°</div>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500">Thu</span>
                <div className="text-cyan-400">72°</div>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500">Fri</span>
                <div className="text-cyan-400">75°</div>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500">Sat</span>
                <div className="text-amber-400">80°</div>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500">Sun</span>
                <div className="text-amber-400">84°</div>
              </div>
            </div>
            <p className="text-slate-500 text-xs mt-2 text-center">Partly cloudy, 10% rain chance Wed</p>
          </div>
        </div>
      </div>

      <button onClick={handleGenerate} className="btn-primary flex items-center justify-center gap-2">
        <Sparkles className="w-5 h-5" />
        Generate with Vineyard AI
      </button>
    </>
  );
}

function TastingRoomLane({ onBack }: { onBack: () => void }) {
  const [vibe, setVibe] = useState('Casual');
  const [featuredWines, setFeaturedWines] = useState('');
  const [clubOffer, setClubOffer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<typeof fallbackData['tasting-room-scripts'] | null>(null);
  const [error, setError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [pollSubmitted, setPollSubmitted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const vibeOptions = ['Casual', 'Upscale', 'Family-friendly'];

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(false);

    const response = await generateWithClaude('tasting-room-scripts', {
      vibe,
      featuredWines: featuredWines || 'Chardonnay, Merlot, Muscadine',
      clubOffer: clubOffer || 'Quarterly shipments with 20% discount',
    });

    setIsLoading(false);

    if (response.success && response.result) {
      setResult(response.result as typeof fallbackData['tasting-room-scripts']);
    } else if (response.fallback) {
      setResult(getPersonalizedFallback('tasting-room-scripts'));
    } else {
      setError(true);
    }
  };

  const handleCopy = () => {
    if (result) {
      const text = `Scripts:\n\nFirst-time visitors:\n${result.scripts.firstTime}\n\nJust browsing:\n${result.scripts.browsing}\n\nClub candidates:\n${result.scripts.clubCandidate}`;
      navigator.clipboard.writeText(text);
    }
  };

  const handleSave = async () => {
    if (result) {
      saveToToolkit('Tasting Room', 'Promo Copy', result, 'tasting-room-promo');
      setIsSaved(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  if (isLoading) return <LoadingState message="Writing your scripts" />;
  if (error) return (
    <ErrorCard
      onRetry={handleGenerate}
      onUseSample={() => { setResult(getPersonalizedFallback('tasting-room-scripts')); setError(false); }}
      onBack={onBack}
    />
  );

  if (result) {
    return (
      <>
        <button onClick={onBack} className="text-slate-500 text-sm mb-4 hover:text-white">Back to roles</button>

        <div className="space-y-4">
          <ResultCard title="First-time Visitors">
            <p className="italic text-slate-400">"{result.scripts.firstTime}"</p>
          </ResultCard>

          <ResultCard title="Just Browsing">
            <p className="italic text-slate-400">"{result.scripts.browsing}"</p>
          </ResultCard>

          <ResultCard title="Club Candidates">
            <p className="italic text-slate-400">"{result.scripts.clubCandidate}"</p>
          </ResultCard>

          <ResultCard title="Staff Cheat Sheet">
            <ul className="space-y-2">
              {result.cheatSheet.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-cyan-400">-</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </ResultCard>

          <ResultCard title="Objection Responses">
            <div className="space-y-3">
              {result.objectionResponses.map((item, i) => (
                <div key={i} className="border-b border-white/5 pb-3 last:border-0">
                  <p className="text-wine-400 text-sm font-medium">"{item.objection}"</p>
                  <p className="text-slate-400 text-sm mt-1">Response: {item.response}</p>
                </div>
              ))}
            </div>
          </ResultCard>
        </div>

        {isSaved && (
          <MicroPoll
            question="Would you use this monthly?"
            onResponse={(r) => { saveToPoll('tasting-room-scripts', r); setPollSubmitted(true); }}
            submitted={pollSubmitted}
          />
        )}

        {!showCompletionModal && (
          <NextButton onClick={() => setShowCompletionModal(true)} />
        )}

        {showCompletionModal && (
          <CompletionModal
            onSave={() => { handleSave(); setIsSaved(true); }}
            onCopy={handleCopy}
            onSkip={onBack}
            isSaved={isSaved}
            nextPath="/gwp-2026/3-event-marketing"
          />
        )}
        <Toast message="Saved to Toolkit" visible={showToast} />
      </>
    );
  }

  return (
    <>
      <button onClick={onBack} className="text-slate-500 text-sm mb-4 hover:text-white">Back to roles</button>

      <div className="card p-6 space-y-6">
        <div>
          <h3 className="text-white font-semibold mb-3">Tasting room vibe</h3>
          <ChipGroup options={vibeOptions} selected={vibe} onChange={setVibe} />
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Featured wines (optional)</h3>
          <input
            type="text"
            value={featuredWines}
            onChange={(e) => setFeaturedWines(e.target.value)}
            placeholder="e.g., Chardonnay, Merlot, Muscadine"
            className="input-field"
          />
          {!featuredWines && (
            <p className="text-slate-500 text-xs mt-2">Will use: Chardonnay, Merlot, Muscadine</p>
          )}
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Club offer (optional)</h3>
          <input
            type="text"
            value={clubOffer}
            onChange={(e) => setClubOffer(e.target.value)}
            placeholder="e.g., Quarterly shipments, 20% discount"
            className="input-field"
          />
          {!clubOffer && (
            <p className="text-slate-500 text-xs mt-2">Will use: Quarterly shipments with 20% discount</p>
          )}
        </div>
      </div>

      <button onClick={handleGenerate} className="btn-primary flex items-center justify-center gap-2">
        <Sparkles className="w-5 h-5" />
        Generate with Vineyard AI
      </button>
    </>
  );
}
