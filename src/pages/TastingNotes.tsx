import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, Wine, Sparkles, Loader2 } from 'lucide-react';
import MobileLayout from '../components/MobileLayout';
import { ChipGroup, LoadingState, ResultCard, CompletionModal, Toast, MicroPoll, ErrorCard, NextButton } from '../components/shared';
import { generateWithClaude, saveToToolkit, saveToPoll, scrapeWebsite } from '../lib/supabase';
import { fallbackData, getPersonalizedFallback, sampleWineryContext } from '../lib/fallbackData';
import { saveWineryContext } from '../lib/taskStore';

const toneOptions = ['Classic', 'Modern', 'Warm', 'Elevated'];
const audienceOptions = ['Traditional wine drinkers', 'Younger visitors', 'Tourists'];

interface TastingResult {
  websiteNote: string;
  menuNote: string;
  staffBullets: string[];
}

interface ScrapedWineInfo {
  wineryName?: string;
  wines?: string[];
  tastingNotes?: string;
  wineStyles?: string[];
  grapeVarieties?: string[];
  description?: string;
  location?: string;
  yearFounded?: string;
}

export default function TastingNotes() {
  const navigate = useNavigate();
  const [inputMethod, setInputMethod] = useState<'website' | 'sample' | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [scrapedInfo, setScrapedInfo] = useState<ScrapedWineInfo | null>(null);
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const [tone, setTone] = useState('Classic');
  const [audience, setAudience] = useState('Traditional wine drinkers');
  const [isLoading, setIsLoading] = useState(false);
  const [loadStartTime, setLoadStartTime] = useState<number | null>(null);
  const [result, setResult] = useState<TastingResult | null>(null);
  const [error, setError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [pollSubmitted, setPollSubmitted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const canGenerate = inputMethod === 'sample' || (inputMethod === 'website' && scrapedInfo !== null);

  const handleScrapeWebsite = async () => {
    if (!websiteUrl) return;
    setIsScraping(true);
    setScrapeError(null);

    const response = await scrapeWebsite(websiteUrl, 'wine-info');

    setIsScraping(false);

    if (response.success && response.result) {
      const info = response.result as ScrapedWineInfo;
      setScrapedInfo(info);
      setScrapeError(null);
      saveWineryContext({
        wineryName: info.wineryName,
        location: info.location,
        yearFounded: info.yearFounded,
        description: info.description,
        wines: info.wines,
        grapeVarieties: info.grapeVarieties,
        wineStyles: info.wineStyles,
      });
    } else {
      setScrapedInfo(null);
      setScrapeError(response.error || 'Could not fetch website info. Try again or use sample data.');
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(false);
    setLoadStartTime(Date.now());

    let wineInfo = 'Georgia red wine blend, estate grown';

    if (inputMethod === 'website' && scrapedInfo) {
      const parts = [];
      if (scrapedInfo.wineryName) parts.push(`Winery: ${scrapedInfo.wineryName}`);
      if (scrapedInfo.wines?.length) parts.push(`Wines: ${scrapedInfo.wines.join(', ')}`);
      if (scrapedInfo.tastingNotes) parts.push(`Notes: ${scrapedInfo.tastingNotes}`);
      if (scrapedInfo.wineStyles?.length) parts.push(`Styles: ${scrapedInfo.wineStyles.join(', ')}`);
      if (scrapedInfo.grapeVarieties?.length) parts.push(`Varieties: ${scrapedInfo.grapeVarieties.join(', ')}`);
      wineInfo = parts.join('. ') || wineInfo;
    }

    const response = await generateWithClaude('tasting-notes', {
      wineInfo,
      tone,
      audience,
    });

    setIsLoading(false);
    setLoadStartTime(null);

    if (response.success && response.result) {
      setResult(response.result as TastingResult);
    } else if (response.fallback) {
      if (inputMethod === 'sample' || !scrapedInfo) {
        saveWineryContext(sampleWineryContext);
        setResult(getPersonalizedFallback('tasting-notes', sampleWineryContext.wineryName) as TastingResult);
      } else {
        setResult(getPersonalizedFallback('tasting-notes') as TastingResult);
      }
    } else {
      setError(true);
    }
  };

  const handleUseSample = () => {
    setInputMethod('sample');
    setScrapedInfo(null);
    saveWineryContext(sampleWineryContext);
    setResult(getPersonalizedFallback('tasting-notes', sampleWineryContext.wineryName) as TastingResult);
    setError(false);
  };

  const handleCopy = () => {
    if (result) {
      const text = `Website Note:\n${result.websiteNote}\n\nMenu Note:\n${result.menuNote}\n\nStaff Bullets:\n${result.staffBullets.map(b => `- ${b}`).join('\n')}`;
      navigator.clipboard.writeText(text);
    }
  };

  const handleSave = async () => {
    if (result) {
      saveToToolkit('Tasting Notes', 'Tasting Notes', result as unknown as Record<string, unknown>, 'tasting-notes');
      setIsSaved(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  const handlePollResponse = async (response: string) => {
    await saveToPoll('tasting-notes', response);
    setPollSubmitted(true);
  };

  const handleRetry = () => {
    setResult(null);
    setError(false);
    handleGenerate();
  };

  const handleModify = (modification: 'simpler' | 'shorter') => {
    if (!result) return;
    if (modification === 'simpler') {
      setResult({
        ...result,
        websiteNote: result.websiteNote.split('.').slice(0, 3).join('.') + '.',
        menuNote: result.menuNote.split('.')[0] + '.',
      });
    } else {
      setResult({
        ...result,
        websiteNote: result.websiteNote.split('.').slice(0, 2).join('.') + '.',
        staffBullets: result.staffBullets.slice(0, 2),
      });
    }
  };

  return (
    <MobileLayout title="Tasting Notes">
      {!result && !isLoading && !error && (
        <>
          <div className="card p-6 space-y-6">
            <div>
              <h3 className="text-white font-semibold mb-4">Choose input method</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { setInputMethod('website'); setScrapedInfo(null); setScrapeError(null); }}
                  className={`p-5 rounded-2xl border transition-all text-center ${
                    inputMethod === 'website'
                      ? 'border-cyan-400/50 bg-cyan-400/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className={`w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center ${
                    inputMethod === 'website' ? 'bg-cyan-400/20' : 'bg-white/10'
                  }`}>
                    <Globe className={`w-7 h-7 ${inputMethod === 'website' ? 'text-cyan-400' : 'text-slate-400'}`} />
                  </div>
                  <span className={`text-sm font-medium ${inputMethod === 'website' ? 'text-cyan-400' : 'text-slate-300'}`}>
                    Your website
                  </span>
                </button>

                <button
                  onClick={() => setInputMethod('sample')}
                  className={`p-5 rounded-2xl border transition-all text-center ${
                    inputMethod === 'sample'
                      ? 'border-cyan-400/50 bg-cyan-400/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className={`w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center ${
                    inputMethod === 'sample' ? 'bg-cyan-400/20' : 'bg-white/10'
                  }`}>
                    <Wine className={`w-7 h-7 ${inputMethod === 'sample' ? 'text-cyan-400' : 'text-slate-400'}`} />
                  </div>
                  <span className={`text-sm font-medium ${inputMethod === 'sample' ? 'text-cyan-400' : 'text-slate-300'}`}>
                    Use sample
                  </span>
                </button>
              </div>

              {inputMethod === 'sample' && (
                <div className="mt-4 p-4 rounded-xl bg-slate-800/50 border border-white/5">
                  <p className="text-slate-500 text-xs uppercase tracking-wide mb-2">Sample Wine Info</p>
                  <div className="space-y-1 text-sm">
                    <p className="text-slate-300">Georgia Red Wine Blend</p>
                    <p className="text-slate-500">Estate grown, hand-harvested grapes</p>
                    <p className="text-slate-500">Notes of dark cherry and spice</p>
                  </div>
                </div>
              )}

              {inputMethod === 'website' && (
                <div className="mt-4 space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://yourwinery.com"
                      className="input-field flex-1"
                    />
                    <button
                      onClick={handleScrapeWebsite}
                      disabled={!websiteUrl || isScraping}
                      className="px-4 py-3 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 font-medium text-sm disabled:opacity-50 transition-all hover:bg-cyan-400/20"
                    >
                      {isScraping ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Fetch'}
                    </button>
                  </div>
                  <p className="text-slate-500 text-xs">
                    We'll pull basic info from your website
                  </p>

                  {scrapeError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                      <p className="text-red-400 text-sm">{scrapeError}</p>
                    </div>
                  )}

                  {scrapedInfo && (
                    <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 space-y-4">
                      <p className="text-teal-400 text-xs font-medium uppercase tracking-wide">Found Info</p>

                      {scrapedInfo.wineryName && (
                        <div>
                          <p className="text-white font-semibold text-lg">{scrapedInfo.wineryName}</p>
                          <div className="flex items-center gap-2 mt-1 text-slate-400 text-sm">
                            {scrapedInfo.location && <span>{scrapedInfo.location}</span>}
                            {scrapedInfo.location && scrapedInfo.yearFounded && <span className="text-slate-600">|</span>}
                            {scrapedInfo.yearFounded && <span>Est. {scrapedInfo.yearFounded}</span>}
                          </div>
                        </div>
                      )}

                      {scrapedInfo.description && (
                        <p className="text-slate-300 text-sm leading-relaxed">{scrapedInfo.description}</p>
                      )}

                      {scrapedInfo.wines && scrapedInfo.wines.length > 0 && (
                        <div>
                          <p className="text-slate-500 text-xs uppercase tracking-wide mb-1.5">Wines</p>
                          <p className="text-slate-300 text-sm">
                            {scrapedInfo.wines.slice(0, 4).join(', ')}
                            {scrapedInfo.wines.length > 4 && ` +${scrapedInfo.wines.length - 4} more`}
                          </p>
                        </div>
                      )}

                      {scrapedInfo.grapeVarieties && scrapedInfo.grapeVarieties.length > 0 && (
                        <div>
                          <p className="text-slate-500 text-xs uppercase tracking-wide mb-1.5">Varieties</p>
                          <p className="text-slate-300 text-sm capitalize">{scrapedInfo.grapeVarieties.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Tone</h3>
              <ChipGroup options={toneOptions} selected={tone} onChange={setTone} />
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Target audience</h3>
              <ChipGroup options={audienceOptions} selected={audience} onChange={setAudience} />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Generate with Vineyard AI
          </button>
        </>
      )}

      {isLoading && <LoadingState message="Drafting tasting notes" startTime={loadStartTime || undefined} />}

      {error && (
        <ErrorCard
          onRetry={handleRetry}
          onUseSample={handleUseSample}
          onBack={() => navigate('/gwp-2026')}
        />
      )}

      {result && !isLoading && !error && (
        <>
          <div className="space-y-4">
            <ResultCard title="Website Tasting Note">
              <p>{result.websiteNote}</p>
            </ResultCard>

            <ResultCard title="Menu Note">
              <p>{result.menuNote}</p>
            </ResultCard>

            <ResultCard title="Staff Bullets">
              <ul className="space-y-2">
                {result.staffBullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-0.5">-</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
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
            <Link
              to="/gwp-2026/beta"
              className="block card-glow p-4 text-center"
            >
              <p className="text-cyan-400 text-sm font-medium">
                Want early access to the Winery AI Beta?
              </p>
            </Link>
          )}

          {!showCompletionModal && (
            <NextButton onClick={() => setShowCompletionModal(true)} />
          )}

          {showCompletionModal && (
            <CompletionModal
              onSave={() => { handleSave(); setIsSaved(true); }}
              onCopy={handleCopy}
              onSkip={() => navigate('/gwp-2026')}
              isSaved={isSaved}
              nextPath="/gwp-2026/2-role-track"
            />
          )}
        </>
      )}

      <Toast message="Saved to Toolkit" visible={showToast} />
    </MobileLayout>
  );
}
