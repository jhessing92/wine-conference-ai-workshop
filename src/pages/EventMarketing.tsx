import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import MobileLayout from '../components/MobileLayout';
import { ChipGroup, LoadingState, ResultCard, CompletionModal, Toast, MicroPoll, ErrorCard, NextButton } from '../components/shared';
import { generateWithClaude, saveToToolkit, saveToPoll } from '../lib/supabase';
import { fallbackData, getPersonalizedFallback } from '../lib/fallbackData';
import { getWineryContext, type WineryContext } from '../lib/taskStore';

const eventTypes = ['Live music', 'Pairing', 'Release', 'Pickup party', 'Seasonal festival'];
const audienceOptions = ['Locals', 'Tourists', 'Club', 'Younger visitors'];
const offerOptions = ['Ticket', 'Discount', 'Bundle', 'Reservation only'];

interface EventResult {
  instagramShort: string;
  instagramLong: string;
  emailInvite: string;
  staffScript: string;
}

export default function EventMarketing() {
  const navigate = useNavigate();
  const [wineryContext, setWineryContext] = useState<WineryContext | null>(null);
  const [eventType, setEventType] = useState('Live music');
  const [eventDate, setEventDate] = useState('');
  const [audience, setAudience] = useState('Locals');
  const [offer, setOffer] = useState('Ticket');
  const [avoidGimmicky, setAvoidGimmicky] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EventResult | null>(null);
  const [error, setError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [pollSubmitted, setPollSubmitted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  useEffect(() => {
    const context = getWineryContext();
    if (context) {
      setWineryContext(context);
    }
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Saturday, March 15';
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(false);

    const response = await generateWithClaude('event-marketing', {
      eventType,
      date: formatDate(eventDate),
      audience,
      offer,
      wineryName: wineryContext?.wineryName,
      wineryLocation: wineryContext?.location,
    });

    setIsLoading(false);

    if (response.success && response.result) {
      setResult(response.result as EventResult);
    } else if (response.fallback) {
      setResult(getPersonalizedFallback('event-marketing') as EventResult);
    } else {
      setError(true);
    }
  };

  const handleUseSample = () => {
    setResult(getPersonalizedFallback('event-marketing') as EventResult);
    setError(false);
  };

  const handleCopy = () => {
    if (result) {
      const text = `Instagram (Short):\n${result.instagramShort}\n\nInstagram (Long):\n${result.instagramLong}\n\nEmail:\n${result.emailInvite}\n\nStaff Script:\n${result.staffScript}`;
      navigator.clipboard.writeText(text);
    }
  };

  const handleSave = async () => {
    if (result) {
      saveToToolkit('Event Marketing', `${eventType} Marketing Kit`, result as unknown as Record<string, unknown>, 'event-marketing');
      setIsSaved(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  const handlePollResponse = async (response: string) => {
    await saveToPoll('event-marketing', response);
    setPollSubmitted(true);
  };

  return (
    <MobileLayout title="Event Marketing Kit">
      {!result && !isLoading && !error && (
        <>
          <div className="card p-6 space-y-6">
            <div>
              <h3 className="text-white font-semibold mb-3">Event type</h3>
              <ChipGroup options={eventTypes} selected={eventType} onChange={setEventType} />
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Event date</h3>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="input-field cursor-pointer [color-scheme:dark]"
              />
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Target audience</h3>
              <ChipGroup options={audienceOptions} selected={audience} onChange={setAudience} />
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Offer type</h3>
              <ChipGroup options={offerOptions} selected={offer} onChange={setOffer} />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setAvoidGimmicky(!avoidGimmicky)}
                className={`w-12 h-7 rounded-full transition-colors ${
                  avoidGimmicky ? 'bg-cyan-500' : 'bg-white/20'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  avoidGimmicky ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
              <span className="text-slate-400 text-sm">Avoid anything gimmicky</span>
            </div>
          </div>

          <button onClick={handleGenerate} className="btn-primary flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Generate with Vineyard AI
          </button>
        </>
      )}

      {isLoading && <LoadingState message="Creating your marketing kit" />}

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
            <ResultCard title="Instagram Caption (Short)">
              <p>{result.instagramShort}</p>
            </ResultCard>

            <ResultCard title="Instagram Caption (Long)">
              <p className="whitespace-pre-wrap">{result.instagramLong}</p>
            </ResultCard>

            <ResultCard title="Email Invite">
              <p className="whitespace-pre-wrap">{result.emailInvite}</p>
            </ResultCard>

            <ResultCard title="Staff Invite Script (15 sec)">
              <p className="italic text-slate-400">"{result.staffScript}"</p>
            </ResultCard>
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
              onSkip={() => navigate('/gwp-2026/4-numbers-to-decisions')}
              isSaved={isSaved}
              nextPath="/gwp-2026/4-numbers-to-decisions"
            />
          )}
        </>
      )}

      <Toast message="Saved to Toolkit" visible={showToast} />
    </MobileLayout>
  );
}
