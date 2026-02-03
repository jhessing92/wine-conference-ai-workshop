import { ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Copy, Save, RefreshCw, Minimize2, Sparkles } from 'lucide-react';

interface ChipGroupProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

export function ChipGroup({ options, selected, onChange }: ChipGroupProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`chip ${selected === option ? 'active' : ''}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

interface LoadingStateProps {
  message?: string;
  startTime?: number;
}

export function LoadingState({ message = 'Drafting', startTime }: LoadingStateProps) {
  const [showExtended, setShowExtended] = useState(false);

  useEffect(() => {
    if (startTime) {
      const timer = setTimeout(() => setShowExtended(true), 12000);
      return () => clearTimeout(timer);
    }
  }, [startTime]);

  return (
    <div className="card p-8 space-y-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative">
          <div className="loader-ring" />
          <Sparkles className="w-5 h-5 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div>
          <p className="text-white font-semibold text-lg">{message}</p>
          <p className="text-slate-400 text-sm mt-1">
            {showExtended ? 'Still working, almost there...' : 'This takes 5-10 seconds'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="shimmer-loader h-3 rounded-lg" style={{ width: `${100 - i * 20}%` }} />
        ))}
      </div>
    </div>
  );
}

interface ResultCardProps {
  title: string;
  children: ReactNode;
}

export function ResultCard({ title, children }: ResultCardProps) {
  return (
    <div className="result-card">
      <h4>{title}</h4>
      <div className="text-slate-300 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

interface ActionBarProps {
  onCopy: () => void;
  onSave: () => void;
  onSimplify?: () => void;
  onShorter?: () => void;
  onRetry: () => void;
  isSaved?: boolean;
}

export function ActionBar({
  onCopy,
  onSave,
  onSimplify,
  onShorter,
  onRetry,
  isSaved = false
}: ActionBarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-16 left-0 right-0 z-30 px-4 py-3 bg-shoofly-900/95 backdrop-blur-md border-t border-white/5">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          <button onClick={handleCopy} className="btn-secondary flex items-center gap-1.5 whitespace-nowrap">
            {copied ? <Check className="w-4 h-4 text-cyan-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>

          <button
            onClick={onSave}
            className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
              isSaved
                ? 'bg-cyan-400/10 border border-cyan-400/30 text-cyan-400'
                : 'btn-secondary'
            }`}
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {isSaved ? 'Saved' : 'Save to Toolkit'}
          </button>

          {onSimplify && (
            <button onClick={onSimplify} className="btn-secondary whitespace-nowrap">
              Simpler
            </button>
          )}

          {onShorter && (
            <button onClick={onShorter} className="btn-secondary flex items-center gap-1.5 whitespace-nowrap">
              <Minimize2 className="w-4 h-4" />
              Shorter
            </button>
          )}

          <button onClick={onRetry} className="btn-secondary flex items-center gap-1.5 whitespace-nowrap">
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}

interface ToastProps {
  message: string;
  visible: boolean;
}

export function Toast({ message, visible }: ToastProps) {
  if (!visible) return null;
  return (
    <div className="toast">
      <div className="flex items-center gap-2">
        <Check className="w-4 h-4" />
        {message}
      </div>
    </div>
  );
}

interface MicroPollProps {
  question: string;
  onResponse: (response: string) => void;
  submitted: boolean;
}

export function MicroPoll({ question, onResponse, submitted }: MicroPollProps) {
  if (submitted) {
    return (
      <div className="card-glow p-5 text-center">
        <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-cyan-400/20 flex items-center justify-center">
          <Check className="w-5 h-5 text-cyan-400" />
        </div>
        <p className="text-slate-300 text-sm font-medium">Thanks for your feedback!</p>
      </div>
    );
  }

  return (
    <div className="card p-5 space-y-4">
      <p className="text-slate-300 text-sm font-medium text-center">{question}</p>
      <div className="flex gap-2">
        {['Yes', 'Maybe', 'No'].map((option) => (
          <button
            key={option}
            onClick={() => onResponse(option)}
            className="chip flex-1 text-center justify-center"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

interface ErrorCardProps {
  onRetry: () => void;
  onUseSample: () => void;
  onBack: () => void;
}

export function ErrorCard({ onRetry, onUseSample, onBack }: ErrorCardProps) {
  return (
    <div className="card p-8 text-center space-y-5">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
        <span className="text-2xl text-amber-400">!</span>
      </div>
      <div>
        <p className="text-white font-semibold text-lg">No worries</p>
        <p className="text-slate-400 text-sm mt-1">Let's try that again.</p>
      </div>
      <div className="flex flex-col gap-3">
        <button onClick={onRetry} className="btn-primary">
          Retry
        </button>
        <button onClick={onUseSample} className="btn-secondary w-full py-3.5">
          Use sample instead
        </button>
        <button onClick={onBack} className="text-slate-500 text-sm py-2 hover:text-slate-300 transition-colors">
          Back to Hub
        </button>
      </div>
    </div>
  );
}

interface CompletionModalProps {
  onSave: () => void;
  onCopy: () => void;
  onSkip: () => void;
  isSaved?: boolean;
  nextPath?: string;
}

export function CompletionModal({ onSave, onCopy, onSkip, isSaved = false, nextPath }: CompletionModalProps) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const goToNext = () => {
    if (nextPath) {
      navigate(nextPath);
    } else {
      onSkip();
    }
  };

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => goToNext(), 800);
  };

  const handleSave = () => {
    onSave();
    setTimeout(() => goToNext(), 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-6">
      <div className="w-full max-w-sm bg-shoofly-800 border border-white/10 rounded-3xl p-6 space-y-5 animate-slide-up">
        <div className="text-center space-y-2">
          <h3 className="text-white font-semibold text-lg">What would you like to do?</h3>
          <p className="text-slate-400 text-sm">Save this to your toolkit, copy it, or continue to the next task.</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`w-full py-3.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
              isSaved
                ? 'bg-cyan-400/10 border border-cyan-400/30 text-cyan-400'
                : 'bg-cyan-500 text-shoofly-900 hover:bg-cyan-400'
            }`}
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {isSaved ? 'Saved!' : 'Save to Toolkit'}
          </button>

          <button
            onClick={handleCopy}
            className="w-full py-3.5 rounded-xl font-medium text-sm bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-cyan-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>

          <button
            onClick={goToNext}
            className="w-full py-3 text-slate-500 text-sm hover:text-slate-300 transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}

interface NextButtonProps {
  onClick: () => void;
}

export function NextButton({ onClick }: NextButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full py-4 mt-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 text-shoofly-900 font-semibold text-base transition-all hover:from-cyan-400 hover:to-teal-400 active:scale-[0.98]"
    >
      Next
    </button>
  );
}

interface PhotoModalProps {
  onTakePhoto: () => void;
  onUpload: () => void;
  onUseSample: () => void;
  onClose: () => void;
}

export function PhotoModal({ onTakePhoto, onUpload, onUseSample, onClose }: PhotoModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-shoofly-800 border-t border-white/10 rounded-t-3xl p-6 space-y-5 animate-slide-up">
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto" />
        <div className="text-center space-y-2">
          <h3 className="text-white font-semibold text-lg">Add a Photo</h3>
          <p className="text-slate-400 text-sm">
            We only use your photo to draft content. You control what you keep.
          </p>
        </div>

        <div className="space-y-3">
          <button onClick={onTakePhoto} className="btn-primary">
            Take photo
          </button>
          <button onClick={onUpload} className="btn-secondary w-full py-3.5">
            Upload from library
          </button>
          <button onClick={onUseSample} className="btn-secondary w-full py-3.5">
            Use sample instead
          </button>
        </div>

        <button onClick={onClose} className="w-full py-2 text-slate-500 text-sm hover:text-slate-300 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}
