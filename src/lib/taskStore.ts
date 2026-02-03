export interface SavedItem {
  id: string;
  category: string;
  title: string;
  content: Record<string, unknown>;
  exerciseType: string;
  createdAt: string;
}

export interface WineryContext {
  wineryName?: string;
  location?: string;
  yearFounded?: string;
  description?: string;
  wines?: string[];
  grapeVarieties?: string[];
  wineStyles?: string[];
}

const STORAGE_KEY = 'gwp_saved_items';
const WINERY_CONTEXT_KEY = 'gwp_winery_context';

export function saveWineryContext(context: WineryContext): void {
  localStorage.setItem(WINERY_CONTEXT_KEY, JSON.stringify(context));
}

export function getWineryContext(): WineryContext | null {
  const stored = localStorage.getItem(WINERY_CONTEXT_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function saveToLocalToolkit(
  category: string,
  title: string,
  content: Record<string, unknown>,
  exerciseType: string
): void {
  const items = getLocalSavedItems();
  const newItem: SavedItem = {
    id: crypto.randomUUID(),
    category,
    title,
    content,
    exerciseType,
    createdAt: new Date().toISOString(),
  };
  items.push(newItem);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getLocalSavedItems(): SavedItem[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function clearLocalSavedItems(): void {
  localStorage.removeItem(STORAGE_KEY);
}

function formatTastingNotes(content: Record<string, unknown>): string {
  const lines: string[] = [];
  if (content.websiteNote) {
    lines.push('WEBSITE TASTING NOTE');
    lines.push(String(content.websiteNote));
    lines.push('');
  }
  if (content.menuNote) {
    lines.push('MENU NOTE');
    lines.push(String(content.menuNote));
    lines.push('');
  }
  if (content.staffBullets && Array.isArray(content.staffBullets)) {
    lines.push('STAFF TALKING POINTS');
    content.staffBullets.forEach((bullet: string) => {
      lines.push(`  - ${bullet}`);
    });
  }
  return lines.join('\n');
}

function formatRoleTrackOwner(content: Record<string, unknown>): string {
  const lines: string[] = [];
  
  // Handle owner-analysis data structure
  if (content.topWines && Array.isArray(content.topWines)) {
    lines.push('TOP PERFORMERS');
    (content.topWines as Array<{ name: string; revenue: string; insight?: string }>).forEach((wine) => {
      lines.push(`  ${wine.name}: ${wine.revenue}`);
      if (wine.insight) lines.push(`    → ${wine.insight}`);
    });
    lines.push('');
  }
  
  if (content.bottomWines && Array.isArray(content.bottomWines)) {
    lines.push('BOTTOM PERFORMERS');
    (content.bottomWines as Array<{ name: string; revenue: string; insight?: string }>).forEach((wine) => {
      lines.push(`  ${wine.name}: ${wine.revenue}`);
      if (wine.insight) lines.push(`    → ${wine.insight}`);
    });
    lines.push('');
  }
  
  if (content.whatThisMeans && Array.isArray(content.whatThisMeans)) {
    lines.push('WHAT THIS MEANS');
    (content.whatThisMeans as string[]).forEach((insight) => {
      lines.push(`  - ${insight}`);
    });
    lines.push('');
  }
  
  if (content.decisionsThisWeek && Array.isArray(content.decisionsThisWeek)) {
    lines.push('DECISIONS THIS WEEK');
    (content.decisionsThisWeek as Array<{ action: string; category: string }>).forEach((decision) => {
      lines.push(`  [${decision.category.toUpperCase()}] ${decision.action}`);
    });
    lines.push('');
  }
  
  // Fallback for old subject/body format
  if (content.subject) {
    lines.push(`SUBJECT: ${content.subject}`);
    lines.push('');
  }
  if (content.body && !content.topWines) {
    lines.push('EMAIL BODY');
    lines.push(String(content.body));
  }
  return lines.join('\n');
}

function formatRoleTrackVineyard(content: Record<string, unknown>): string {
  const lines: string[] = [];
  
  // Handle vineyard-planning data structure
  if (content.weeklyChecklist && Array.isArray(content.weeklyChecklist)) {
    lines.push('WEEKLY CHECKLIST');
    (content.weeklyChecklist as Array<{ day: string; tasks: string[] }>).forEach((day) => {
      lines.push(`  ${day.day.toUpperCase()}`);
      day.tasks.forEach((task) => {
        lines.push(`    [ ] ${task}`);
      });
    });
    lines.push('');
  }
  
  if (content.decisionTree && Array.isArray(content.decisionTree)) {
    lines.push('DECISION TREE');
    (content.decisionTree as Array<{ condition: string; action: string }>).forEach((item) => {
      lines.push(`  IF: ${item.condition}`);
      lines.push(`  THEN: ${item.action}`);
      lines.push('');
    });
  }
  
  if (content.questionsForExpert && Array.isArray(content.questionsForExpert)) {
    lines.push('QUESTIONS FOR YOUR EXPERT');
    (content.questionsForExpert as string[]).forEach((q, i) => {
      lines.push(`  ${i + 1}. ${q}`);
    });
    lines.push('');
  }
  
  if (content.disclaimer) {
    lines.push('⚠️ DISCLAIMER');
    lines.push(`  ${content.disclaimer}`);
    lines.push('');
  }
  
  // Fallback for old format
  if (content.checklistTitle) {
    lines.push(`CHECKLIST: ${content.checklistTitle}`);
    lines.push('');
  }
  if (content.items && Array.isArray(content.items)) {
    (content.items as Array<{ task: string; priority: string; notes?: string }>).forEach((item) => {
      lines.push(`[ ] ${item.task}`);
      lines.push(`    Priority: ${item.priority}`);
      if (item.notes) lines.push(`    Notes: ${item.notes}`);
      lines.push('');
    });
  }
  return lines.join('\n');
}

function formatRoleTrackTastingRoom(content: Record<string, unknown>): string {
  const lines: string[] = [];
  
  // Handle tasting-room-scripts data structure
  if (content.scripts && typeof content.scripts === 'object') {
    const scripts = content.scripts as { firstTime?: string; browsing?: string; clubCandidate?: string };
    
    if (scripts.firstTime) {
      lines.push('SCRIPT: FIRST-TIME VISITORS');
      lines.push(`  "${scripts.firstTime}"`);
      lines.push('');
    }
    
    if (scripts.browsing) {
      lines.push('SCRIPT: JUST BROWSING');
      lines.push(`  "${scripts.browsing}"`);
      lines.push('');
    }
    
    if (scripts.clubCandidate) {
      lines.push('SCRIPT: CLUB CANDIDATES');
      lines.push(`  "${scripts.clubCandidate}"`);
      lines.push('');
    }
  }
  
  if (content.cheatSheet && Array.isArray(content.cheatSheet)) {
    lines.push('STAFF CHEAT SHEET');
    (content.cheatSheet as string[]).forEach((tip) => {
      lines.push(`  - ${tip}`);
    });
    lines.push('');
  }
  
  if (content.objectionResponses && Array.isArray(content.objectionResponses)) {
    lines.push('OBJECTION RESPONSES');
    (content.objectionResponses as Array<{ objection: string; response: string }>).forEach((item) => {
      lines.push(`  Customer: "${item.objection}"`);
      lines.push(`  Response: "${item.response}"`);
      lines.push('');
    });
  }
  
  // Fallback for old headline/body/cta format
  if (content.headline && !content.scripts) {
    lines.push('HEADLINE');
    lines.push(String(content.headline));
    lines.push('');
  }
  if (content.body && !content.scripts) {
    lines.push('DESCRIPTION');
    lines.push(String(content.body));
    lines.push('');
  }
  if (content.cta && !content.scripts) {
    lines.push(`CALL TO ACTION: ${content.cta}`);
  }
  return lines.join('\n');
}

function formatEventMarketing(content: Record<string, unknown>): string {
  const lines: string[] = [];
  if (content.eventName) {
    lines.push(`EVENT: ${content.eventName}`);
    lines.push('');
  }
  if (content.tagline) {
    lines.push(`TAGLINE: ${content.tagline}`);
    lines.push('');
  }
  if (content.emailSubject) {
    lines.push(`EMAIL SUBJECT: ${content.emailSubject}`);
    lines.push('');
  }
  if (content.emailBody) {
    lines.push('EMAIL BODY');
    lines.push(String(content.emailBody));
    lines.push('');
  }
  if (content.socialPost) {
    lines.push('SOCIAL MEDIA POST');
    lines.push(String(content.socialPost));
  }
  return lines.join('\n');
}

function formatNumbers(content: Record<string, unknown>): string {
  const lines: string[] = [];
  if (content.summary) {
    lines.push('SUMMARY');
    lines.push(String(content.summary));
    lines.push('');
  }
  if (content.insights && Array.isArray(content.insights)) {
    lines.push('KEY INSIGHTS');
    content.insights.forEach((insight: string) => {
      lines.push(`  - ${insight}`);
    });
    lines.push('');
  }
  if (content.recommendations && Array.isArray(content.recommendations)) {
    lines.push('RECOMMENDATIONS');
    content.recommendations.forEach((rec: string) => {
      lines.push(`  - ${rec}`);
    });
  }
  return lines.join('\n');
}

function formatLightningLab(content: Record<string, unknown>): string {
  const lines: string[] = [];
  
  // Handle FAQ content
  if (content.faqs && Array.isArray(content.faqs)) {
    lines.push('FREQUENTLY ASKED QUESTIONS');
    (content.faqs as Array<{ question: string; answer: string }>).forEach((faq, idx) => {
      lines.push(`  Q${idx + 1}: ${faq.question}`);
      lines.push(`  A: ${faq.answer}`);
      lines.push('');
    });
  }
  
  // Handle social calendar
  if (content.weeklyPlan && Array.isArray(content.weeklyPlan)) {
    lines.push('WEEKLY SOCIAL MEDIA PLAN');
    (content.weeklyPlan as Array<{ day: string; postType: string; topic: string; caption: string }>).forEach((day) => {
      lines.push(`  ${day.day.toUpperCase()} - ${day.postType}`);
      lines.push(`  Topic: ${day.topic}`);
      lines.push(`  Caption: ${day.caption}`);
      lines.push('');
    });
  }
  
  // Handle thank you email
  if (content.subject && content.body) {
    lines.push(`SUBJECT: ${content.subject}`);
    lines.push('');
    lines.push('EMAIL BODY');
    lines.push(String(content.body));
    lines.push('');
  }
  
  // Handle training content
  if (content.topicOverview) {
    lines.push('TOPIC OVERVIEW');
    lines.push(String(content.topicOverview));
    lines.push('');
  }
  if (content.keyPoints && Array.isArray(content.keyPoints)) {
    lines.push('KEY POINTS');
    (content.keyPoints as string[]).forEach((point) => {
      lines.push(`  - ${point}`);
    });
    lines.push('');
  }
  if (content.practiceScenario) {
    lines.push('PRACTICE SCENARIO');
    lines.push(String(content.practiceScenario));
    lines.push('');
  }
  
  // Handle labor schedule
  if (content.recommendedSchedule && Array.isArray(content.recommendedSchedule)) {
    lines.push('RECOMMENDED SCHEDULE');
    (content.recommendedSchedule as Array<{ day: string; staff: number; notes: string }>).forEach((day) => {
      lines.push(`  ${day.day}: ${day.staff} staff - ${day.notes}`);
    });
    lines.push('');
  }
  if (content.peakTimes && Array.isArray(content.peakTimes)) {
    lines.push('PEAK TIMES');
    (content.peakTimes as string[]).forEach((time) => {
      lines.push(`  - ${time}`);
    });
    lines.push('');
  }
  
  // Handle wine club campaign
  if (content.emailSubject) {
    lines.push(`EMAIL SUBJECT: ${content.emailSubject}`);
    lines.push('');
  }
  if (content.emailBody) {
    lines.push('EMAIL BODY');
    lines.push(String(content.emailBody));
    lines.push('');
  }
  if (content.benefits && Array.isArray(content.benefits)) {
    lines.push('BENEFITS');
    (content.benefits as string[]).forEach((benefit) => {
      lines.push(`  - ${benefit}`);
    });
    lines.push('');
  }
  if (content.cta) {
    lines.push(`CALL TO ACTION: ${content.cta}`);
    lines.push('');
  }
  
  // Handle SOP content
  if (content.title && content.purpose) {
    lines.push(`SOP: ${content.title}`);
    lines.push('');
    lines.push('PURPOSE');
    lines.push(String(content.purpose));
    lines.push('');
  }
  if (content.steps && Array.isArray(content.steps)) {
    lines.push('STEPS');
    (content.steps as Array<{ step: number; action: string; note?: string }>).forEach((s) => {
      lines.push(`  ${s.step}. ${s.action}`);
      if (s.note) lines.push(`     Note: ${s.note}`);
    });
    lines.push('');
  }
  
  // Handle job description
  if (content.title && content.summary && !content.purpose) {
    lines.push(`POSITION: ${content.title}`);
    lines.push('');
    lines.push('SUMMARY');
    lines.push(String(content.summary));
    lines.push('');
  }
  if (content.responsibilities && Array.isArray(content.responsibilities)) {
    lines.push('RESPONSIBILITIES');
    (content.responsibilities as string[]).forEach((r) => {
      lines.push(`  - ${r}`);
    });
    lines.push('');
  }
  if (content.qualifications && Array.isArray(content.qualifications)) {
    lines.push('QUALIFICATIONS');
    (content.qualifications as string[]).forEach((q) => {
      lines.push(`  - ${q}`);
    });
    lines.push('');
  }
  
  // Handle COGS model
  if (content.costBreakdown && Array.isArray(content.costBreakdown)) {
    lines.push('COST BREAKDOWN');
    (content.costBreakdown as Array<{ category: string; percentage: string; note: string }>).forEach((c) => {
      lines.push(`  ${c.category}: ${c.percentage} - ${c.note}`);
    });
    lines.push('');
  }
  if (content.marginAnalysis) {
    lines.push('MARGIN ANALYSIS');
    lines.push(String(content.marginAnalysis));
    lines.push('');
  }
  
  // Handle compliance checklist
  if (content.checklist && Array.isArray(content.checklist)) {
    lines.push('COMPLIANCE CHECKLIST');
    (content.checklist as Array<{ item: string; status: string }>).forEach((c) => {
      lines.push(`  [ ] ${c.item} (${c.status})`);
    });
    lines.push('');
  }
  if (content.questionsForAttorney && Array.isArray(content.questionsForAttorney)) {
    lines.push('QUESTIONS FOR YOUR ATTORNEY');
    (content.questionsForAttorney as string[]).forEach((q) => {
      lines.push(`  - ${q}`);
    });
    lines.push('');
  }
  
  // Handle vine triage
  if (content.possibleIssues && Array.isArray(content.possibleIssues)) {
    lines.push('POSSIBLE ISSUES');
    (content.possibleIssues as string[]).forEach((i) => {
      lines.push(`  - ${i}`);
    });
    lines.push('');
  }
  if (content.whatToCheckNext && Array.isArray(content.whatToCheckNext)) {
    lines.push('WHAT TO CHECK NEXT');
    (content.whatToCheckNext as string[]).forEach((c) => {
      lines.push(`  - ${c}`);
    });
    lines.push('');
  }
  if (content.whoToContact && Array.isArray(content.whoToContact)) {
    lines.push('WHO TO CONTACT');
    (content.whoToContact as string[]).forEach((c) => {
      lines.push(`  - ${c}`);
    });
    lines.push('');
  }
  
  // Handle generic content (fallback for other fields)
  if (content.concept) {
    lines.push('CONCEPT');
    lines.push(String(content.concept));
    lines.push('');
  }
  if (content.headline && !content.body) {
    lines.push(`HEADLINE: ${content.headline}`);
    lines.push('');
  }
  if (content.description) {
    lines.push('DESCRIPTION');
    lines.push(String(content.description));
    lines.push('');
  }
  if (content.nextSteps && Array.isArray(content.nextSteps)) {
    lines.push('NEXT STEPS');
    (content.nextSteps as string[]).forEach((step) => {
      lines.push(`  - ${step}`);
    });
    lines.push('');
  }
  if (content.recommendations && Array.isArray(content.recommendations)) {
    lines.push('RECOMMENDATIONS');
    (content.recommendations as string[]).forEach((r) => {
      lines.push(`  - ${r}`);
    });
    lines.push('');
  }
  if (content.staffTips && Array.isArray(content.staffTips)) {
    lines.push('STAFF TIPS');
    (content.staffTips as string[]).forEach((t) => {
      lines.push(`  - ${t}`);
    });
    lines.push('');
  }
  if (content.hashtagSets && typeof content.hashtagSets === 'object') {
    lines.push('HASHTAG SETS');
    const sets = content.hashtagSets as Record<string, string[]>;
    Object.entries(sets).forEach(([category, tags]) => {
      lines.push(`  ${category}: ${tags.join(' ')}`);
    });
    lines.push('');
  }
  if (content.contentTips && Array.isArray(content.contentTips)) {
    lines.push('CONTENT TIPS');
    (content.contentTips as string[]).forEach((t) => {
      lines.push(`  - ${t}`);
    });
    lines.push('');
  }
  
  // Handle disclaimer
  if (content.disclaimer) {
    lines.push('⚠️ DISCLAIMER');
    lines.push(String(content.disclaimer));
    lines.push('');
  }
  
  return lines.join('\n');
}

function formatItemContent(item: SavedItem): string {
  switch (item.exerciseType) {
    case 'tasting-notes':
      return formatTastingNotes(item.content);
    case 'owner-email':
      return formatRoleTrackOwner(item.content);
    case 'vineyard-checklist':
      return formatRoleTrackVineyard(item.content);
    case 'tasting-room-promo':
      return formatRoleTrackTastingRoom(item.content);
    case 'event-marketing':
      return formatEventMarketing(item.content);
    case 'numbers-analysis':
      return formatNumbers(item.content);
    case 'lightning-lab':
      return formatLightningLab(item.content);
    default:
      return JSON.stringify(item.content, null, 2);
  }
}

export function generateReport(): string {
  const items = getLocalSavedItems();
  const wineryContext = getWineryContext();
  const lines: string[] = [];
  const wineryName = wineryContext?.wineryName || 'Your Winery';

  lines.push('═'.repeat(60));
  lines.push('');
  lines.push('        GEORGIA WINE PRODUCERS');
  lines.push('        AI WORKSHOP RESULTS');
  lines.push('        2026 Annual Conference');
  lines.push('');
  lines.push('═'.repeat(60));
  lines.push('');
  lines.push(`Generated: ${new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })}`);
  lines.push('');
  lines.push('');

  // Intro section
  lines.push('─'.repeat(60));
  lines.push(`  WORKSHOP RESULTS FOR ${wineryName.toUpperCase()}`);
  lines.push('─'.repeat(60));
  lines.push('');
  lines.push(`This report contains all the AI-generated content you created`);
  lines.push(`during the "AI Can Do That" workshop at the Georgia Wine`);
  lines.push(`Festival 2026. Each section below represents work you completed`);
  lines.push(`- from tasting notes to marketing materials to operational`);
  lines.push(`insights. These are your starting points: copy them into your`);
  lines.push(`systems, refine them to match your voice, and put them to`);
  lines.push(`work for ${wineryName}.`);
  lines.push('');
  lines.push('');

  // Winery context section
  if (wineryContext && (wineryContext.wineryName || wineryContext.location || wineryContext.description)) {
    lines.push('─'.repeat(60));
    lines.push('  YOUR WINERY PROFILE');
    lines.push('─'.repeat(60));
    lines.push('');
    lines.push('This is the context that personalized your AI-generated');
    lines.push('content throughout the workshop.');
    lines.push('');
    if (wineryContext.wineryName) lines.push(`Winery: ${wineryContext.wineryName}`);
    if (wineryContext.location) lines.push(`Location: ${wineryContext.location}`);
    if (wineryContext.yearFounded) lines.push(`Founded: ${wineryContext.yearFounded}`);
    if (wineryContext.description) lines.push(`About: ${wineryContext.description}`);
    if (wineryContext.wines?.length) lines.push(`Wines: ${wineryContext.wines.join(', ')}`);
    if (wineryContext.grapeVarieties?.length) lines.push(`Grape Varieties: ${wineryContext.grapeVarieties.join(', ')}`);
    if (wineryContext.wineStyles?.length) lines.push(`Wine Styles: ${wineryContext.wineStyles.join(', ')}`);
    lines.push('');
    lines.push('');
  }

  // Section descriptions
  const sectionDescriptions: Record<string, string> = {
    'Tasting Notes': 'Professional wine descriptions for your website, menus, and staff training.',
    'Role Track - Owner': 'Strategic insights and action items based on your business data.',
    'Role Track - Vineyard': 'Planning checklists and decision frameworks for vineyard management.',
    'Role Track - Tasting Room': 'Customer-facing content and staff scripts to elevate guest experiences.',
    'Owner': 'Strategic insights and action items based on your business data.',
    'Vineyard': 'Planning checklists and decision frameworks for vineyard management.',
    'Tasting Room': 'Customer-facing content and staff scripts to elevate guest experiences.',
    'Event Marketing': 'Ready-to-use marketing content for your events.',
    'Numbers to Decisions': 'Data analysis translated into actionable insights.',
    'Lightning Lab': 'Quick-turn content generated from our rapid AI tools.',
  };
  
  // Map old category names to new Role Track names
  const categoryDisplayNames: Record<string, string> = {
    'Owner': 'Role Track - Owner',
    'Vineyard': 'Role Track - Vineyard',
    'Tasting Room': 'Role Track - Tasting Room',
  };

  if (items.length === 0) {
    lines.push('No items saved during this session.');
    lines.push('');
    lines.push('Complete the workshop exercises and save your results');
    lines.push('to build your personalized AI-generated content toolkit.');
  } else {
    const grouped: Record<string, SavedItem[]> = {};
    items.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });

    const categoryOrder = [
      'Tasting Notes',
      'Owner',
      'Vineyard',
      'Tasting Room',
      'Event Marketing',
      'Numbers to Decisions',
      'Lightning Lab',
    ];

    categoryOrder.forEach((category) => {
      const categoryItems = grouped[category];
      if (!categoryItems || categoryItems.length === 0) return;

      // Get display name for category (e.g., "Owner" -> "Role Track - Owner")
      const displayCategory = categoryDisplayNames[category] || category;
      const descriptionKey = categoryDisplayNames[category] || category;

      lines.push('─'.repeat(60));
      lines.push(`  ${displayCategory.toUpperCase()}`);
      lines.push('─'.repeat(60));
      lines.push('');
      
      // Add section description
      if (sectionDescriptions[descriptionKey]) {
        lines.push(`[${sectionDescriptions[descriptionKey]}]`);
        lines.push('');
      }

      categoryItems.forEach((item, idx) => {
        if (categoryItems.length > 1) {
          lines.push(`--- ${item.title} (${idx + 1}) ---`);
          lines.push('');
        }
        lines.push(formatItemContent(item));
        lines.push('');
        lines.push('');
      });
    });

    Object.keys(grouped).forEach((category) => {
      if (categoryOrder.includes(category)) return;
      const categoryItems = grouped[category];
      if (!categoryItems || categoryItems.length === 0) return;

      // Get display name for category
      const displayCategory = categoryDisplayNames[category] || category;
      const descriptionKey = categoryDisplayNames[category] || category;

      lines.push('─'.repeat(60));
      lines.push(`  ${displayCategory.toUpperCase()}`);
      lines.push('─'.repeat(60));
      lines.push('');
      
      // Add section description if available
      if (sectionDescriptions[descriptionKey]) {
        lines.push(`[${sectionDescriptions[descriptionKey]}]`);
        lines.push('');
      }

      categoryItems.forEach((item) => {
        lines.push(formatItemContent(item));
        lines.push('');
        lines.push('');
      });
    });
  }

  lines.push('');
  lines.push('');
  lines.push('═'.repeat(60));
  lines.push('');
  lines.push('        AI USAGE TIPS & PROMPT TEMPLATES');
  lines.push('');
  lines.push('═'.repeat(60));
  lines.push('');
  lines.push('');
  lines.push('HOW TO USE AI EFFECTIVELY');
  lines.push('─'.repeat(40));
  lines.push('');
  lines.push('1. BE SPECIFIC: Include details like wine variety,');
  lines.push('   audience, and tone in your prompts');
  lines.push('');
  lines.push('2. ITERATE: AI drafts are starting points.');
  lines.push('   Edit and refine to match your voice');
  lines.push('');
  lines.push('3. VERIFY: Always double-check facts, dates,');
  lines.push('   and compliance details before publishing');
  lines.push('');
  lines.push('4. PERSONALIZE: Add your winery\'s unique story');
  lines.push('   and personality to AI-generated content');
  lines.push('');
  lines.push('');
  lines.push('COPY-PASTE PROMPT TEMPLATES');
  lines.push('─'.repeat(40));
  lines.push('');
  lines.push('TASTING NOTES:');
  lines.push('"Write 3 tasting note versions for [wine name]:');
  lines.push(' 1) Website description (100 words)');
  lines.push(' 2) Menu note (25 words)');
  lines.push(' 3) Staff talking points (3 bullets)');
  lines.push(' Tone: [casual/elevated]. Audience: [tourists/locals]."');
  lines.push('');
  lines.push('');
  lines.push('EVENT MARKETING:');
  lines.push('"Create a marketing kit for our [event type] on [date]:');
  lines.push(' - Instagram caption (short)');
  lines.push(' - Instagram caption (long with hashtags)');
  lines.push(' - Email invitation');
  lines.push(' - 15-second staff invite script');
  lines.push(' Target: [audience]. Offer: [ticket/discount/bundle]."');
  lines.push('');
  lines.push('');
  lines.push('WEEKLY OWNER SUMMARY:');
  lines.push('"Analyze these numbers and give me one action item:');
  lines.push(' - This week sales: $[X]');
  lines.push(' - Last week sales: $[Y]');
  lines.push(' - Top seller: [wine]');
  lines.push(' - Inventory concern: [item]');
  lines.push(' Focus area: [pricing/inventory/club retention]."');
  lines.push('');
  lines.push('');
  lines.push('VINEYARD PLANNING:');
  lines.push('"Create a 7-day priority checklist for my vineyard:');
  lines.push(' - Current stage: [dormant/bud break/bloom/etc]');
  lines.push(' - Weather risk: [frost/rain/heat]');
  lines.push(' - Acres: [X]');
  lines.push(' - Main concern: [specific issue]"');
  lines.push('');
  lines.push('');
  lines.push('STAFF TRAINING:');
  lines.push('"Write a 5-minute training script for staff on:');
  lines.push(' [handling difficult questions / upselling wine club /');
  lines.push(' describing our terroir / wine food pairings].');
  lines.push(' Keep it conversational and include practice scenarios."');
  lines.push('');
  lines.push('');
  lines.push('RECOMMENDED AI TOOLS');
  lines.push('─'.repeat(40));
  lines.push('');
  lines.push('ChatGPT (chat.openai.com)');
  lines.push('  Best for: Writing, brainstorming, general tasks');
  lines.push('');
  lines.push('Claude (claude.ai)');
  lines.push('  Best for: Longer documents, nuanced writing');
  lines.push('');
  lines.push('Perplexity (perplexity.ai)');
  lines.push('  Best for: Research with source citations');
  lines.push('');
  lines.push('');
  lines.push('KEY REMINDERS');
  lines.push('─'.repeat(40));
  lines.push('');
  lines.push('- AI drafts. You decide.');
  lines.push('- Start simple, add complexity as needed');
  lines.push('- Save prompts that work well for you');
  lines.push('- AI is a tool, not a replacement for expertise');
  lines.push('- Always review for accuracy before publishing');
  lines.push('');
  lines.push('');
  lines.push('═'.repeat(60));
  lines.push('');
  lines.push('  Thank you for attending the AI Workshop!');
  lines.push('');
  lines.push('  Questions? Contact: workshop@georgiawine.com');
  lines.push('');
  lines.push('═'.repeat(60));

  return lines.join('\n');
}

export async function downloadReport(): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const items = getLocalSavedItems();
  const wineryContext = getWineryContext();

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPos = margin;

  // Colors
  const tealColor: [number, number, number] = [6, 182, 212]; // cyan-500
  const darkBg: [number, number, number] = [15, 23, 42]; // slate-900
  const textLight: [number, number, number] = [248, 250, 252]; // slate-50
  const textMuted: [number, number, number] = [148, 163, 184]; // slate-400

  // Header background
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, pageWidth, 70, 'F');

  // Try to load and add logo image
  try {
    const logoResponse = await fetch('/Asset 2@3x.png');
    if (logoResponse.ok) {
      const logoBlob = await logoResponse.blob();
      const logoBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(logoBlob);
      });
      // Logo dimensions: original is 2164x508, scale to fit nicely (about 50mm wide)
      const logoWidth = 50;
      const logoHeight = logoWidth * (508 / 2164); // maintain aspect ratio
      doc.addImage(logoBase64, 'PNG', margin, yPos, logoWidth, logoHeight);
      yPos += logoHeight + 5;
    } else {
      // Fallback to text logo if image fails
      doc.setFillColor(...tealColor);
      doc.roundedRect(margin, yPos, 40, 12, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('shoofly.ai', margin + 5, yPos + 8);
      yPos += 20;
    }
  } catch {
    // Fallback to text logo if image loading fails
    doc.setFillColor(...tealColor);
    doc.roundedRect(margin, yPos, 40, 12, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('shoofly.ai', margin + 5, yPos + 8);
    yPos += 20;
  }

  // Main title with quotes
  doc.setTextColor(...textLight);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('"AI Can Do That"', margin, yPos);

  yPos += 12;

  // Event name
  doc.setTextColor(...tealColor);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Georgia Wine Festival 2026', margin, yPos);

  yPos += 6;

  doc.setTextColor(...textMuted);
  doc.setFontSize(11);
  doc.text('Forsyth, Georgia', margin, yPos);

  yPos += 25;

  // Reset for body content
  doc.setTextColor(50, 50, 50);

  // Intro message from ShooflyAI
  doc.setFillColor(240, 249, 255); // light cyan bg
  doc.roundedRect(margin, yPos, contentWidth, 45, 3, 3, 'F');

  yPos += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...tealColor);
  doc.text('A Note from ShooflyAI', margin + 5, yPos);

  yPos += 7;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);

  const introText = "This is what's possible when you put AI to work for your winery. Everything in this report was generated during our workshop using simple prompts and your real business context. These are starting points - edit, refine, and make them yours. AI drafts. You decide.";
  const introLines = doc.splitTextToSize(introText, contentWidth - 10);
  doc.text(introLines, margin + 5, yPos);

  yPos += 40;

  // Helper to add new page if needed
  const checkNewPage = (neededSpace: number) => {
    if (yPos + neededSpace > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  // Section descriptions - explains what each section is and how it helps
  const sectionDescriptions: Record<string, string> = {
    'Tasting Notes': 'Professional wine descriptions for your website, menus, and staff training. Use these to maintain consistent, compelling messaging across all touchpoints.',
    'Role Track - Owner': 'Strategic insights and action items based on your business data. Review weekly to stay on top of trends and make informed decisions.',
    'Role Track - Vineyard': 'Planning checklists and decision frameworks for vineyard management. These help prioritize tasks and prepare questions for your viticulture expert.',
    'Role Track - Tasting Room': 'Customer-facing content and staff scripts to elevate guest experiences. Train your team with these talking points and promotional materials.',
    'Owner': 'Strategic insights and action items based on your business data. Review weekly to stay on top of trends and make informed decisions.',
    'Vineyard': 'Planning checklists and decision frameworks for vineyard management. These help prioritize tasks and prepare questions for your viticulture expert.',
    'Tasting Room': 'Customer-facing content and staff scripts to elevate guest experiences. Train your team with these talking points and promotional materials.',
    'Event Marketing': 'Ready-to-use marketing content for your events including social posts, emails, and staff scripts. Copy, customize, and publish.',
    'Numbers to Decisions': 'Data analysis translated into actionable insights. These summaries help you spot opportunities and risks without getting lost in spreadsheets.',
    'Lightning Lab': 'Quick-turn content generated from our rapid AI tools. Everything here is a starting point - edit and refine to match your voice and needs.',
  };
  
  // Map old category names to new Role Track names
  const categoryDisplayNames: Record<string, string> = {
    'Owner': 'Role Track - Owner',
    'Vineyard': 'Role Track - Vineyard',
    'Tasting Room': 'Role Track - Tasting Room',
  };

  // Add personalized intro section with winery context
  const wineryName = wineryContext?.wineryName || 'Your Winery';
  
  checkNewPage(60);
  
  // Intro section box
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(...tealColor);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, yPos, contentWidth, 50, 3, 3, 'FD');
  
  yPos += 8;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...tealColor);
  doc.text(`Workshop Results for ${wineryName}`, margin + 5, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  
  const wineryIntroText = `This report contains all the AI-generated content you created during the "AI Can Do That" workshop at the Georgia Wine Festival 2026. Each section below represents work you completed - from tasting notes to marketing materials to operational insights. These are your starting points: copy them into your systems, refine them to match your voice, and put them to work for ${wineryName}.`;
  const wineryIntroLines = doc.splitTextToSize(wineryIntroText, contentWidth - 10);
  doc.text(wineryIntroLines, margin + 5, yPos);
  
  yPos += 45;
  
  // Add winery context section if available
  if (wineryContext && (wineryContext.wineryName || wineryContext.location || wineryContext.description)) {
    checkNewPage(45);
    
    doc.setFillColor(...tealColor);
    doc.rect(margin, yPos, contentWidth, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('YOUR WINERY PROFILE', margin + 3, yPos + 5.5);
    
    yPos += 12;
    
    // Description of section
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('This is the context that personalized your AI-generated content throughout the workshop.', margin, yPos);
    yPos += 6;
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    
    if (wineryContext.wineryName) {
      doc.setFont('helvetica', 'bold');
      doc.text('Winery:', margin, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(wineryContext.wineryName, margin + 20, yPos);
      yPos += 5;
    }
    if (wineryContext.location) {
      doc.setFont('helvetica', 'bold');
      doc.text('Location:', margin, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(wineryContext.location, margin + 22, yPos);
      yPos += 5;
    }
    if (wineryContext.yearFounded) {
      doc.setFont('helvetica', 'bold');
      doc.text('Founded:', margin, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(wineryContext.yearFounded, margin + 22, yPos);
      yPos += 5;
    }
    if (wineryContext.description) {
      doc.setFont('helvetica', 'bold');
      doc.text('About:', margin, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 5;
      const descLines = doc.splitTextToSize(wineryContext.description, contentWidth - 5);
      doc.text(descLines, margin + 2, yPos);
      yPos += (descLines.length * 4) + 2;
    }
    if (wineryContext.wines && wineryContext.wines.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Wines:', margin, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(wineryContext.wines.join(', '), margin + 18, yPos);
      yPos += 5;
    }
    if (wineryContext.grapeVarieties && wineryContext.grapeVarieties.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Varieties:', margin, yPos);
      doc.setFont('helvetica', 'normal');
      const varietiesText = doc.splitTextToSize(wineryContext.grapeVarieties.join(', '), contentWidth - 25);
      doc.text(varietiesText, margin + 22, yPos);
      yPos += (varietiesText.length * 4) + 2;
    }
    
    yPos += 10;
  }

  // Content sections
  if (items.length === 0) {
    checkNewPage(30);
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('No items were saved during this session.', margin, yPos);
    yPos += 8;
    doc.setFontSize(10);
    doc.text('Complete the workshop exercises and tap "Save to Toolkit" to capture your AI-generated content.', margin, yPos);
  } else {
    // Group items by category
    const grouped: Record<string, SavedItem[]> = {};
    items.forEach((item) => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });

    const categoryOrder = ['Tasting Notes', 'Owner', 'Vineyard', 'Tasting Room', 'Event Marketing', 'Numbers to Decisions', 'Lightning Lab'];

    categoryOrder.forEach((category) => {
      const categoryItems = grouped[category];
      if (!categoryItems || categoryItems.length === 0) return;

      checkNewPage(35);

      // Get display name for category (e.g., "Owner" -> "Role Track - Owner")
      const displayCategory = categoryDisplayNames[category] || category;
      const descriptionKey = categoryDisplayNames[category] || category;

      // Category header
      doc.setFillColor(...tealColor);
      doc.rect(margin, yPos, contentWidth, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(displayCategory.toUpperCase(), margin + 3, yPos + 5.5);

      yPos += 12;
      
      // Section description
      if (sectionDescriptions[descriptionKey]) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 100, 100);
        const descLines = doc.splitTextToSize(sectionDescriptions[descriptionKey], contentWidth - 5);
        doc.text(descLines, margin, yPos);
        yPos += (descLines.length * 4) + 4;
      }

      categoryItems.forEach((item) => {
        checkNewPage(20);

        // Item title
        doc.setTextColor(...tealColor);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(item.title, margin, yPos);
        yPos += 5;

        // Item content
        doc.setTextColor(60, 60, 60);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);

        const content = item.content;
        const formatField = (label: string, value: string) => {
          checkNewPage(15);
          doc.setFont('helvetica', 'bold');
          doc.text(label + ':', margin, yPos);
          doc.setFont('helvetica', 'normal');
          const lines = doc.splitTextToSize(value, contentWidth - 5);
          yPos += 4;
          doc.text(lines, margin + 2, yPos);
          yPos += (lines.length * 4) + 3;
        };

        // Format based on content type
        
        // Tasting Notes
        if (content.websiteNote) formatField('Website Note', String(content.websiteNote));
        if (content.menuNote) formatField('Menu Note', String(content.menuNote));
        if (content.staffBullets && Array.isArray(content.staffBullets)) {
          doc.setFont('helvetica', 'bold');
          doc.text('Staff Talking Points:', margin, yPos);
          yPos += 4;
          doc.setFont('helvetica', 'normal');
          (content.staffBullets as string[]).forEach((bullet) => {
            checkNewPage(8);
            const bulletLines = doc.splitTextToSize('• ' + bullet, contentWidth - 10);
            doc.text(bulletLines, margin + 2, yPos);
            yPos += (bulletLines.length * 4) + 1;
          });
          yPos += 2;
        }
        
        // Owner Analysis (Role Track - Owner)
        if (content.topWines && Array.isArray(content.topWines)) {
          doc.setFont('helvetica', 'bold');
          doc.text('Top Performers:', margin, yPos);
          yPos += 4;
          doc.setFont('helvetica', 'normal');
          (content.topWines as Array<{ name: string; revenue: string; insight?: string }>).forEach((wine) => {
            checkNewPage(8);
            doc.text(`• ${wine.name}: ${wine.revenue}`, margin + 2, yPos);
            yPos += 4;
            if (wine.insight) {
              doc.setTextColor(100, 100, 100);
              doc.text(`  → ${wine.insight}`, margin + 4, yPos);
              doc.setTextColor(60, 60, 60);
              yPos += 4;
            }
          });
          yPos += 2;
        }
        if (content.bottomWines && Array.isArray(content.bottomWines)) {
          doc.setFont('helvetica', 'bold');
          doc.text('Bottom Performers:', margin, yPos);
          yPos += 4;
          doc.setFont('helvetica', 'normal');
          (content.bottomWines as Array<{ name: string; revenue: string; insight?: string }>).forEach((wine) => {
            checkNewPage(8);
            doc.text(`• ${wine.name}: ${wine.revenue}`, margin + 2, yPos);
            yPos += 4;
            if (wine.insight) {
              doc.setTextColor(100, 100, 100);
              doc.text(`  → ${wine.insight}`, margin + 4, yPos);
              doc.setTextColor(60, 60, 60);
              yPos += 4;
            }
          });
          yPos += 2;
        }
        if (content.whatThisMeans && Array.isArray(content.whatThisMeans)) {
          doc.setFont('helvetica', 'bold');
          doc.text('What This Means:', margin, yPos);
          yPos += 4;
          doc.setFont('helvetica', 'normal');
          (content.whatThisMeans as string[]).forEach((insight) => {
            checkNewPage(8);
            const insightLines = doc.splitTextToSize('• ' + insight, contentWidth - 10);
            doc.text(insightLines, margin + 2, yPos);
            yPos += (insightLines.length * 4) + 1;
          });
          yPos += 2;
        }
        if (content.decisionsThisWeek && Array.isArray(content.decisionsThisWeek)) {
          doc.setFont('helvetica', 'bold');
          doc.text('Decisions This Week:', margin, yPos);
          yPos += 4;
          doc.setFont('helvetica', 'normal');
          (content.decisionsThisWeek as Array<{ action: string; category: string }>).forEach((decision) => {
            checkNewPage(8);
            const decisionLines = doc.splitTextToSize(`[${decision.category.toUpperCase()}] ${decision.action}`, contentWidth - 10);
            doc.text(decisionLines, margin + 2, yPos);
            yPos += (decisionLines.length * 4) + 1;
          });
          yPos += 2;
        }
        
        // Vineyard Planning (Role Track - Vineyard)
        if (content.weeklyChecklist && Array.isArray(content.weeklyChecklist)) {
          doc.setFont('helvetica', 'bold');
          doc.text('Weekly Checklist:', margin, yPos);
          yPos += 4;
          doc.setFont('helvetica', 'normal');
          (content.weeklyChecklist as Array<{ day: string; tasks: string[] }>).forEach((day) => {
            checkNewPage(12);
            doc.setFont('helvetica', 'bold');
            doc.text(day.day, margin + 2, yPos);
            doc.setFont('helvetica', 'normal');
            yPos += 4;
            day.tasks.forEach((task) => {
              const taskLines = doc.splitTextToSize('□ ' + task, contentWidth - 15);
              doc.text(taskLines, margin + 6, yPos);
              yPos += (taskLines.length * 4) + 1;
            });
          });
          yPos += 2;
        }
        if (content.decisionTree && Array.isArray(content.decisionTree)) {
          doc.setFont('helvetica', 'bold');
          doc.text('Decision Tree:', margin, yPos);
          yPos += 4;
          doc.setFont('helvetica', 'normal');
          (content.decisionTree as Array<{ condition: string; action: string }>).forEach((item) => {
            checkNewPage(10);
            doc.text(`IF: ${item.condition}`, margin + 2, yPos);
            yPos += 4;
            doc.text(`THEN: ${item.action}`, margin + 2, yPos);
            yPos += 5;
          });
          yPos += 2;
        }
        if (content.questionsForExpert && Array.isArray(content.questionsForExpert)) {
          doc.setFont('helvetica', 'bold');
          doc.text('Questions for Your Expert:', margin, yPos);
          yPos += 4;
          doc.setFont('helvetica', 'normal');
          (content.questionsForExpert as string[]).forEach((q, i) => {
            checkNewPage(8);
            const qLines = doc.splitTextToSize(`${i + 1}. ${q}`, contentWidth - 10);
            doc.text(qLines, margin + 2, yPos);
            yPos += (qLines.length * 4) + 1;
          });
          yPos += 2;
        }
        
        // Tasting Room Scripts (Role Track - Tasting Room)
        if (content.scripts && typeof content.scripts === 'object') {
          const scripts = content.scripts as { firstTime?: string; browsing?: string; clubCandidate?: string };
          if (scripts.firstTime) {
            doc.setFont('helvetica', 'bold');
            doc.text('Script - First-Time Visitors:', margin, yPos);
            yPos += 4;
            doc.setFont('helvetica', 'italic');
            const scriptLines = doc.splitTextToSize(`"${scripts.firstTime}"`, contentWidth - 10);
            doc.text(scriptLines, margin + 2, yPos);
            yPos += (scriptLines.length * 4) + 3;
            doc.setFont('helvetica', 'normal');
          }
          if (scripts.browsing) {
            checkNewPage(15);
            doc.setFont('helvetica', 'bold');
            doc.text('Script - Just Browsing:', margin, yPos);
            yPos += 4;
            doc.setFont('helvetica', 'italic');
            const scriptLines = doc.splitTextToSize(`"${scripts.browsing}"`, contentWidth - 10);
            doc.text(scriptLines, margin + 2, yPos);
            yPos += (scriptLines.length * 4) + 3;
            doc.setFont('helvetica', 'normal');
          }
          if (scripts.clubCandidate) {
            checkNewPage(15);
            doc.setFont('helvetica', 'bold');
            doc.text('Script - Club Candidates:', margin, yPos);
            yPos += 4;
            doc.setFont('helvetica', 'italic');
            const scriptLines = doc.splitTextToSize(`"${scripts.clubCandidate}"`, contentWidth - 10);
            doc.text(scriptLines, margin + 2, yPos);
            yPos += (scriptLines.length * 4) + 3;
            doc.setFont('helvetica', 'normal');
          }
        }
        if (content.cheatSheet && Array.isArray(content.cheatSheet)) {
          doc.setFont('helvetica', 'bold');
          doc.text('Staff Cheat Sheet:', margin, yPos);
          yPos += 4;
          doc.setFont('helvetica', 'normal');
          (content.cheatSheet as string[]).forEach((tip) => {
            checkNewPage(8);
            const tipLines = doc.splitTextToSize('• ' + tip, contentWidth - 10);
            doc.text(tipLines, margin + 2, yPos);
            yPos += (tipLines.length * 4) + 1;
          });
          yPos += 2;
        }
        if (content.objectionResponses && Array.isArray(content.objectionResponses)) {
          doc.setFont('helvetica', 'bold');
          doc.text('Objection Responses:', margin, yPos);
          yPos += 4;
          doc.setFont('helvetica', 'normal');
          (content.objectionResponses as Array<{ objection: string; response: string }>).forEach((item) => {
            checkNewPage(12);
            doc.setFont('helvetica', 'italic');
            doc.text(`"${item.objection}"`, margin + 2, yPos);
            yPos += 4;
            doc.setFont('helvetica', 'normal');
            const respLines = doc.splitTextToSize(`Response: ${item.response}`, contentWidth - 10);
            doc.text(respLines, margin + 2, yPos);
            yPos += (respLines.length * 4) + 3;
          });
          yPos += 2;
        }
        
        // Event Marketing
        if (content.instagramShort) formatField('Instagram (Short)', String(content.instagramShort));
        if (content.instagramLong) formatField('Instagram (Long)', String(content.instagramLong));
        if (content.emailInvite) formatField('Email Invite', String(content.emailInvite));
        if (content.staffScript) formatField('Staff Script', String(content.staffScript));
        
        // Numbers to Decisions
        if (content.mainInsight) formatField('Main Insight', String(content.mainInsight));
        if (content.actionThisWeek) formatField('Action This Week', String(content.actionThisWeek));
        if (content.riskToWatch) formatField('Risk to Watch', String(content.riskToWatch));
        if (content.summary) formatField('Summary', String(content.summary));
        
        // Disclaimer if present
        if (content.disclaimer) {
          checkNewPage(10);
          doc.setFillColor(255, 243, 205); // amber tint
          doc.roundedRect(margin, yPos, contentWidth, 10, 2, 2, 'F');
          doc.setFontSize(8);
          doc.setTextColor(180, 83, 9);
          const disclaimerLines = doc.splitTextToSize('⚠️ ' + String(content.disclaimer), contentWidth - 6);
          doc.text(disclaimerLines, margin + 3, yPos + 6);
          yPos += 12;
          doc.setFontSize(9);
          doc.setTextColor(60, 60, 60);
        }

        yPos += 5;
      });

      yPos += 5;
    });
  }

  // Footer on last page
  checkNewPage(35);
  yPos = pageHeight - 30;

  doc.setDrawColor(...tealColor);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);

  yPos += 8;
  doc.setTextColor(...tealColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('AI drafts. You decide.', margin, yPos);

  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Generated by ShooflyAI Workshop Tools', pageWidth - margin - 55, yPos);

  yPos += 5;
  doc.text('Learn more at shoofly.ai', pageWidth - margin - 35, yPos);

  // Save
  const filenameSuffix = wineryContext?.wineryName ? `-${wineryContext.wineryName.replace(/\s+/g, '-')}` : '';
  doc.save(`AI-Can-Do-That${filenameSuffix}-${new Date().toISOString().split('T')[0]}.pdf`);
}
