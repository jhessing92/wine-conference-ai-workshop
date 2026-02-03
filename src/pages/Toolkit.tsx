import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Copy, RefreshCw, Download, TrendingUp, Leaf, Users, Megaphone, Settings, ChevronDown, ChevronUp, Check } from 'lucide-react';
import MobileLayout from '../components/MobileLayout';
import { getSavedItems } from '../lib/supabase';
import { downloadReport, type SavedItem } from '../lib/taskStore';

const categoryIcons: Record<string, typeof TrendingUp> = {
  Owner: TrendingUp,
  Vineyard: Leaf,
  'Tasting Room': Users,
  'Tasting Notes': Megaphone,
  'Event Marketing': Megaphone,
  'Numbers to Decisions': Settings,
  'Lightning Lab': Settings,
};

const categoryColors: Record<string, string> = {
  Owner: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  Vineyard: 'bg-teal-500/10 border-teal-500/20 text-teal-400',
  'Tasting Room': 'bg-wine-500/10 border-wine-500/20 text-wine-400',
  'Tasting Notes': 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  'Event Marketing': 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
  'Numbers to Decisions': 'bg-slate-500/10 border-slate-500/20 text-slate-400',
  'Lightning Lab': 'bg-purple-500/10 border-purple-500/20 text-purple-400',
};

function formatContentPreview(content: Record<string, unknown>): string {
  if (content.websiteNote) return String(content.websiteNote).slice(0, 100) + '...';
  if (content.subject) return `Subject: ${content.subject}`;
  if (content.checklistTitle) return String(content.checklistTitle);
  if (content.headline) return String(content.headline);
  if (content.eventName) return String(content.eventName);
  if (content.summary) return String(content.summary).slice(0, 100) + '...';
  if (content.concept) return String(content.concept).slice(0, 100) + '...';
  return 'Saved content';
}

export default function Toolkit() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    const data = getSavedItems();
    setItems(data);

    const categories = [...new Set(data.map((item) => item.category))];
    const expanded: Record<string, boolean> = {};
    categories.forEach(cat => { expanded[cat] = true; });
    setExpandedCategories(expanded);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const handleCopy = (item: SavedItem) => {
    const text = formatFullContent(item);
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = async () => {
    await downloadReport();
  };

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, SavedItem[]>);

  const categories = Object.keys(groupedItems);

  return (
    <MobileLayout title="Your Take-Home Toolkit" hideProgress>
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-teal-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Your Workshop Results</h2>
          <p className="text-slate-500 text-sm">
            Everything you created during the session
          </p>
        </div>

        {items.length === 0 ? (
          <div className="card p-6 text-center space-y-4">
            <p className="text-slate-400">No saved items yet.</p>
            <p className="text-slate-500 text-sm">
              Complete exercises and tap "Save to Toolkit" to build your collection.
            </p>
            <Link to="/gwp-2026" className="btn-secondary inline-block">
              Go to exercises
            </Link>
          </div>
        ) : (
          <>
            <button
              onClick={handleDownload}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Full Report
            </button>

            <div className="space-y-4">
              {categories.map((category) => {
                const Icon = categoryIcons[category] || Settings;
                const colorClass = categoryColors[category] || 'bg-slate-500/10 border-slate-500/20 text-slate-400';
                const isExpanded = expandedCategories[category];

                return (
                  <div key={category} className="card overflow-hidden">
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colorClass}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-white font-medium">
                          {category}
                        </span>
                        <span className="text-slate-500 text-sm">
                          ({groupedItems[category].length})
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-500" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-3">
                        {groupedItems[category].map((item) => (
                          <div key={item.id} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h4 className="text-white font-medium">{item.title}</h4>
                                <p className="text-slate-500 text-xs mt-1 truncate">
                                  {formatContentPreview(item.content)}
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Link
                                to={`/gwp-2026/${getExercisePath(item.exerciseType)}`}
                                className="btn-secondary text-xs flex items-center gap-1"
                              >
                                <RefreshCw className="w-3 h-3" />
                                Run again
                              </Link>
                              <button
                                onClick={() => handleCopy(item)}
                                className="btn-secondary text-xs flex items-center gap-1"
                              >
                                {copiedId === item.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-cyan-400" />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    Copy
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="text-center text-slate-500 text-xs">
              {items.length} item{items.length !== 1 ? 's' : ''} saved
            </p>
          </>
        )}

        <Link
          to="/gwp-2026/beta"
          className="block card-glow p-5 text-center"
        >
          <p className="text-cyan-400 font-medium mb-1">
            Want more tools like this?
          </p>
          <p className="text-slate-500 text-sm">
            Join the Winery AI Beta waitlist
          </p>
        </Link>
      </div>
    </MobileLayout>
  );
}

function getExercisePath(exerciseType: string): string {
  const paths: Record<string, string> = {
    'tasting-notes': '1-tasting-notes',
    'owner-email': '2-role-track',
    'vineyard-checklist': '2-role-track',
    'tasting-room-promo': '2-role-track',
    'event-marketing': '3-event-marketing',
    'numbers-analysis': '4-numbers-to-decisions',
    'lightning-lab': '5-lightning-lab',
  };
  return paths[exerciseType] || '5-lightning-lab';
}

function formatFullContent(item: SavedItem): string {
  const content = item.content;
  const lines: string[] = [`=== ${item.title} ===\n`];

  if (content.websiteNote) {
    lines.push('Website Note:');
    lines.push(String(content.websiteNote));
    lines.push('');
  }
  if (content.menuNote) {
    lines.push('Menu Note:');
    lines.push(String(content.menuNote));
    lines.push('');
  }
  if (content.staffBullets && Array.isArray(content.staffBullets)) {
    lines.push('Staff Talking Points:');
    content.staffBullets.forEach((b: string) => lines.push(`- ${b}`));
    lines.push('');
  }
  if (content.subject) {
    lines.push(`Subject: ${content.subject}`);
    lines.push('');
  }
  if (content.body) {
    lines.push(String(content.body));
    lines.push('');
  }
  if (content.checklistTitle) {
    lines.push(String(content.checklistTitle));
    lines.push('');
  }
  if (content.items && Array.isArray(content.items)) {
    content.items.forEach((item: { task: string; priority: string }) => {
      lines.push(`[ ] ${item.task} (${item.priority})`);
    });
    lines.push('');
  }
  if (content.headline) {
    lines.push(`Headline: ${content.headline}`);
    lines.push('');
  }
  if (content.cta) {
    lines.push(`CTA: ${content.cta}`);
    lines.push('');
  }
  if (content.eventName) {
    lines.push(`Event: ${content.eventName}`);
    lines.push('');
  }
  if (content.tagline) {
    lines.push(`Tagline: ${content.tagline}`);
    lines.push('');
  }
  if (content.emailSubject) {
    lines.push(`Email Subject: ${content.emailSubject}`);
    lines.push('');
  }
  if (content.emailBody) {
    lines.push('Email:');
    lines.push(String(content.emailBody));
    lines.push('');
  }
  if (content.socialPost) {
    lines.push('Social Post:');
    lines.push(String(content.socialPost));
    lines.push('');
  }
  if (content.summary) {
    lines.push('Summary:');
    lines.push(String(content.summary));
    lines.push('');
  }
  if (content.insights && Array.isArray(content.insights)) {
    lines.push('Insights:');
    content.insights.forEach((i: string) => lines.push(`- ${i}`));
    lines.push('');
  }
  if (content.recommendations && Array.isArray(content.recommendations)) {
    lines.push('Recommendations:');
    content.recommendations.forEach((r: string) => lines.push(`- ${r}`));
    lines.push('');
  }
  if (content.concept) {
    lines.push('Concept:');
    lines.push(String(content.concept));
    lines.push('');
  }
  if (content.nextSteps && Array.isArray(content.nextSteps)) {
    lines.push('Next Steps:');
    content.nextSteps.forEach((s: string) => lines.push(`- ${s}`));
    lines.push('');
  }

  return lines.join('\n');
}
