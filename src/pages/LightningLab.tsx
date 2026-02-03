import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Clock, Wine, Users, FileText, DollarSign, Shield, Leaf, Sparkles, ArrowLeft, HelpCircle, Calendar, Mail } from 'lucide-react';
import MobileLayout from '../components/MobileLayout';
import { LoadingState, ResultCard, CompletionModal, Toast, ErrorCard, NextButton } from '../components/shared';
import { generateWithClaude, saveToToolkit, getAccumulatedContext } from '../lib/supabase';
import { fallbackData, getPersonalizedFallback } from '../lib/fallbackData';

type LabTool = 'winery-faq' | 'social-calendar' | 'thank-you-email' | 'staff-training' | 'labor-schedule' | 'wine-club-campaign' | 'customer-sop' | 'job-description' | 'cogs-model' | 'compliance-checklist' | 'vine-triage' | null;

const labTools = [
  { id: 'winery-faq', label: 'Winery FAQ', icon: HelpCircle, color: 'cyan', contextAware: true },
  { id: 'social-calendar', label: 'Social Calendar', icon: Calendar, color: 'blue', contextAware: true },
  { id: 'thank-you-email', label: 'Thank You Email', icon: Mail, color: 'teal', contextAware: true },
  { id: 'staff-training', label: 'Staff Training', icon: GraduationCap, color: 'amber' },
  { id: 'labor-schedule', label: 'Labor Schedule', icon: Clock, color: 'slate' },
  { id: 'wine-club-campaign', label: 'Wine Club Campaign', icon: Wine, color: 'wine' },
  { id: 'customer-sop', label: 'Customer SOP', icon: Users, color: 'orange' },
  { id: 'job-description', label: 'Job Description', icon: FileText, color: 'slate' },
  { id: 'cogs-model', label: 'COGS / Revenue', icon: DollarSign, color: 'lime' },
  { id: 'compliance-checklist', label: 'Compliance Checklist', icon: Shield, color: 'orange' },
  { id: 'vine-triage', label: 'Vine Issue Triage', icon: Leaf, color: 'lime' },
];

const colorClasses: Record<string, string> = {
  blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  wine: 'bg-wine-500/10 border-wine-500/20 text-wine-400',
  teal: 'bg-teal-500/10 border-teal-500/20 text-teal-400',
  slate: 'bg-slate-500/10 border-slate-500/20 text-slate-400',
  cyan: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
  orange: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
  lime: 'bg-lime-500/10 border-lime-500/20 text-lime-400',
};

export default function LightningLab() {
  const [selectedTool, setSelectedTool] = useState<LabTool>(null);

  return (
    <MobileLayout
      title="Lightning Lab"
      showDisclaimer={selectedTool === 'vine-triage' ? 'vineyard' : selectedTool === 'compliance-checklist' ? 'compliance' : null}
    >
      {!selectedTool ? (
        <div className="space-y-4">
          <p className="text-slate-400 text-center text-sm mb-2">
            Quick tools for common winery tasks. Pick one and try it.
          </p>

          {getAccumulatedContext() && (
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 mb-4">
              <p className="text-cyan-400 text-xs font-medium">Context loaded from your session</p>
              <p className="text-slate-400 text-xs mt-1">Tools marked with a star will use your winery data to personalize results.</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {labTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id as LabTool)}
                className={`card p-4 flex flex-col items-center gap-3 hover:border-cyan-400/30 transition-all relative ${
                  'contextAware' in tool && tool.contextAware ? 'border-cyan-500/30' : ''
                }`}
              >
                {'contextAware' in tool && tool.contextAware && (
                  <div className="absolute top-2 right-2">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                  </div>
                )}
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${colorClasses[tool.color]}`}>
                  <tool.icon className="w-6 h-6" />
                </div>
                <span className="text-white text-sm font-medium text-center leading-tight">{tool.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <ToolPanel tool={selectedTool} onBack={() => setSelectedTool(null)} />
      )}
    </MobileLayout>
  );
}

function ToolPanel({ tool, onBack }: { tool: LabTool; onBack: () => void }) {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const toolConfig: Record<string, { title: string; fields: { key: string; label: string; placeholder: string }[]; category: string; contextAware?: boolean }> = {
    'winery-faq': {
      title: 'Winery FAQ Generator',
      fields: [{ key: 'focus', label: 'Focus areas (optional)', placeholder: 'e.g., Visiting, wine club, events' }],
      category: 'Lightning Lab',
      contextAware: true,
    },
    'social-calendar': {
      title: 'Social Media Calendar',
      fields: [{ key: 'goals', label: 'Goals (optional)', placeholder: 'e.g., Increase visits, promote events' }],
      category: 'Lightning Lab',
      contextAware: true,
    },
    'thank-you-email': {
      title: 'Thank You Email',
      fields: [{ key: 'visitType', label: 'Visit type (optional)', placeholder: 'e.g., Tasting, event, purchase' }],
      category: 'Lightning Lab',
      contextAware: true,
    },
    'staff-training': {
      title: 'Staff Training Material',
      fields: [{ key: 'topic', label: 'Training topic', placeholder: 'e.g., Handling wine questions' }],
      category: 'Lightning Lab',
    },
    'labor-schedule': {
      title: 'Labor Schedule',
      fields: [
        { key: 'visitors', label: 'Expected visitors', placeholder: 'e.g., 200-300 per weekend' },
        { key: 'events', label: 'Events this week', placeholder: 'e.g., Live music Saturday' },
      ],
      category: 'Lightning Lab',
    },
    'wine-club-campaign': {
      title: 'Wine Club Campaign',
      fields: [
        { key: 'goal', label: 'Campaign goal', placeholder: 'e.g., New member acquisition' },
        { key: 'benefits', label: 'Current benefits', placeholder: 'e.g., 20% discount, exclusive events' },
      ],
      category: 'Lightning Lab',
    },
    'customer-sop': {
      title: 'Customer SOP',
      fields: [{ key: 'scenario', label: 'Scenario', placeholder: 'e.g., Handling customer complaints' }],
      category: 'Lightning Lab',
    },
    'job-description': {
      title: 'Job Description',
      fields: [
        { key: 'position', label: 'Position', placeholder: 'e.g., Tasting Room Associate' },
        { key: 'hours', label: 'Hours', placeholder: 'e.g., Part-time weekends' },
      ],
      category: 'Lightning Lab',
    },
    'cogs-model': {
      title: 'COGS Analysis',
      fields: [
        { key: 'wineType', label: 'Wine type', placeholder: 'e.g., Red blend' },
        { key: 'price', label: 'Bottle price', placeholder: 'e.g., $28' },
        { key: 'costs', label: 'Known costs', placeholder: 'e.g., Grapes $8, bottling $3' },
      ],
      category: 'Lightning Lab',
    },
    'compliance-checklist': {
      title: 'Compliance Questions',
      fields: [{ key: 'area', label: 'Compliance area', placeholder: 'e.g., TTB label approval' }],
      category: 'Lightning Lab',
    },
    'vine-triage': {
      title: 'Vine Issue Triage',
      fields: [
        { key: 'symptoms', label: 'What you see', placeholder: 'e.g., Yellowing leaves' },
        { key: 'location', label: 'Location', placeholder: 'e.g., Lower section near creek' },
      ],
      category: 'Lightning Lab',
    },
  };

  const config = toolConfig[tool!];
  const fallbackKey = tool as keyof typeof fallbackData;

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(false);

    const response = await generateWithClaude(tool!, inputs);

    setIsLoading(false);

    if (response.success && response.result) {
      setResult(response.result as Record<string, unknown>);
    } else if (response.fallback && fallbackData[fallbackKey]) {
      setResult(getPersonalizedFallback(fallbackKey) as Record<string, unknown>);
    } else {
      setError(true);
    }
  };

  const handleUseSample = () => {
    if (fallbackData[fallbackKey]) {
      setResult(getPersonalizedFallback(fallbackKey) as Record<string, unknown>);
      setError(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    }
  };

  const handleSave = () => {
    if (result) {
      saveToToolkit(config.category, config.title, result, 'lightning-lab');
      setIsSaved(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  if (isLoading) return <LoadingState message={`Creating ${config.title.toLowerCase()}`} />;

  if (error) {
    return (
      <ErrorCard
        onRetry={handleGenerate}
        onUseSample={handleUseSample}
        onBack={() => navigate('/gwp-2026')}
      />
    );
  }

  if (result) {
    return (
      <>
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 text-sm mb-4 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          Back to tools
        </button>

        <div className="space-y-4">
          {Object.entries(result).map(([key, value]) => {
            if (key === 'disclaimer') {
              return (
                <div key={key} className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                  <p className="text-amber-400 text-xs">{String(value)}</p>
                </div>
              );
            }

            const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

            if (Array.isArray(value)) {
              return (
                <ResultCard key={key} title={title}>
                  {typeof value[0] === 'object' ? (
                    <div className="space-y-2">
                      {value.map((item, i) => (
                        <div key={i} className="bg-white/5 p-2 rounded-lg text-sm">
                          {Object.entries(item as Record<string, unknown>).map(([k, v]) => (
                            <p key={k}><span className="text-slate-500">{k}:</span> {String(v)}</p>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ul className="space-y-1">
                      {value.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-cyan-400">-</span>
                          <span>{String(item)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </ResultCard>
              );
            }

            if (typeof value === 'object' && value !== null) {
              return (
                <ResultCard key={key} title={title}>
                  <div className="space-y-2">
                    {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
                      <div key={k}>
                        <p className="text-cyan-400 text-xs font-medium">{k}</p>
                        <p>{String(v)}</p>
                      </div>
                    ))}
                  </div>
                </ResultCard>
              );
            }

            return (
              <ResultCard key={key} title={title}>
                <p>{String(value)}</p>
              </ResultCard>
            );
          })}
        </div>

        {!showCompletionModal && (
          <NextButton onClick={() => setShowCompletionModal(true)} />
        )}

        {showCompletionModal && (
          <CompletionModal
            onSave={() => { handleSave(); setIsSaved(true); }}
            onCopy={handleCopy}
            onSkip={() => navigate('/gwp-2026/prompt-pack')}
            isSaved={isSaved}
            nextPath="/gwp-2026/prompt-pack"
          />
        )}
        <Toast message="Saved to Toolkit" visible={showToast} />
      </>
    );
  }

  const hasContext = getAccumulatedContext().length > 0;

  return (
    <>
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 text-sm mb-4 hover:text-white">
        <ArrowLeft className="w-4 h-4" />
        Back to tools
      </button>

      <div className="card p-6 space-y-5">
        <h3 className="text-white font-semibold">{config.title}</h3>

        {config.contextAware && hasContext && (
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3">
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium mb-1">
              <Sparkles className="w-4 h-4" />
              Using your session data
            </div>
            <p className="text-slate-400 text-xs">
              This tool will use your winery info, tasting notes, and other content you've created to generate personalized results.
            </p>
          </div>
        )}

        {config.contextAware && !hasContext && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
            <p className="text-amber-400 text-xs">
              Complete earlier exercises first to get personalized results. This tool works best with your winery data.
            </p>
          </div>
        )}

        {config.fields.map((field) => (
          <div key={field.key}>
            <label className="text-slate-400 text-sm block mb-2">{field.label}</label>
            <input
              type="text"
              value={inputs[field.key] || ''}
              onChange={(e) => setInputs({ ...inputs, [field.key]: e.target.value })}
              placeholder={field.placeholder}
              className="input-field"
            />
          </div>
        ))}

        {!config.contextAware && (
          <button onClick={handleUseSample} className="text-slate-500 text-sm hover:text-cyan-400 transition-colors">
            Or use sample inputs
          </button>
        )}
      </div>

      <button onClick={handleGenerate} className="btn-primary flex items-center justify-center gap-2">
        <Sparkles className="w-5 h-5" />
        Generate with Vineyard AI
      </button>
    </>
  );
}
