import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const steps = [
  { id: 'hub', label: 'Hub', path: '/gwp-2026' },
  { id: '1', label: 'Tasting Notes', path: '/gwp-2026/1-tasting-notes' },
  { id: '2', label: 'Role Track', path: '/gwp-2026/2-role-track' },
  { id: '3', label: 'Event Kit', path: '/gwp-2026/3-event-marketing' },
  { id: '4', label: 'Numbers', path: '/gwp-2026/4-numbers-to-decisions' },
  { id: '5', label: 'Lightning', path: '/gwp-2026/5-lightning-lab' },
  { id: 'toolkit', label: 'Toolkit', path: '/gwp-2026/prompt-pack' },
];

interface MobileLayoutProps {
  children: ReactNode;
  title: string;
  showDisclaimer?: 'vineyard' | 'compliance' | null;
  hideProgress?: boolean;
}

export default function MobileLayout({
  children,
  title,
  showDisclaimer = null,
  hideProgress = false
}: MobileLayoutProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const currentIndex = steps.findIndex(s => s.path === currentPath);
  const progress = ((currentIndex + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen page-bg">
      <div className="fixed top-0 left-0 right-0 z-50 bg-shoofly-900/95 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            to="/gwp-2026"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Hub</span>
          </Link>

          <div className="flex items-center gap-2">
            <img
              src="https://i.imgur.com/E6quH0d.png"
              alt="Shoofly"
              className="h-5"
            />
            <h1 className="text-white font-semibold text-base truncate max-w-[120px]">
              {title}
            </h1>
          </div>

        </div>

        {!hideProgress && (
          <div className="px-4 pb-3">
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-slate-500">Step {currentIndex + 1} of {steps.length}</span>
              <span className="text-xs text-cyan-400 font-medium">{steps[currentIndex]?.label}</span>
            </div>
          </div>
        )}
      </div>

      <main className={`${hideProgress ? 'pt-16' : 'pt-28'} pb-24 px-4`}>
        <div className="max-w-lg mx-auto space-y-5 animate-in">
          {children}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40">
        {showDisclaimer && (
          <div className="disclaimer-bar">
            <p>
              {showDisclaimer === 'vineyard'
                ? 'Planning support only. Validate with your viticulture expert.'
                : 'Not legal advice. Consult with your attorney.'}
            </p>
          </div>
        )}

        <div className="bg-shoofly-900/95 backdrop-blur-md border-t border-white/5 px-4 py-3 safe-bottom">
          <div className="flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <p className="text-xs text-slate-500">
              AI drafts. You decide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
