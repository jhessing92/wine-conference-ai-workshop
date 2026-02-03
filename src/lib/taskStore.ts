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
  if (content.subject) {
    lines.push(`SUBJECT: ${content.subject}`);
    lines.push('');
  }
  if (content.body) {
    lines.push('EMAIL BODY');
    lines.push(String(content.body));
  }
  return lines.join('\n');
}

function formatRoleTrackVineyard(content: Record<string, unknown>): string {
  const lines: string[] = [];
  if (content.checklistTitle) {
    lines.push(`CHECKLIST: ${content.checklistTitle}`);
    lines.push('');
  }
  if (content.items && Array.isArray(content.items)) {
    content.items.forEach((item: { task: string; priority: string; notes?: string }) => {
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
  if (content.headline) {
    lines.push('HEADLINE');
    lines.push(String(content.headline));
    lines.push('');
  }
  if (content.body) {
    lines.push('DESCRIPTION');
    lines.push(String(content.body));
    lines.push('');
  }
  if (content.cta) {
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
  if (content.concept) {
    lines.push('CONCEPT');
    lines.push(String(content.concept));
    lines.push('');
  }
  if (content.headline) {
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
    content.nextSteps.forEach((step: string) => {
      lines.push(`  - ${step}`);
    });
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
  const lines: string[] = [];

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

      lines.push('─'.repeat(60));
      lines.push(`  ${category.toUpperCase()}`);
      lines.push('─'.repeat(60));
      lines.push('');

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

      lines.push('─'.repeat(60));
      lines.push(`  ${category.toUpperCase()}`);
      lines.push('─'.repeat(60));
      lines.push('');

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

  // Shoofly branding
  doc.setTextColor(...tealColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('shoofly', margin, yPos + 5);
  doc.setTextColor(...textLight);
  doc.setFontSize(10);
  doc.text('ai', margin + 22, yPos + 5);

  yPos += 20;

  // Main title
  doc.setTextColor(...textLight);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('AI Can Do That', margin, yPos);

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

      checkNewPage(25);

      // Category header
      doc.setFillColor(...tealColor);
      doc.rect(margin, yPos, contentWidth, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(category.toUpperCase(), margin + 3, yPos + 5.5);

      yPos += 12;

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
        if (content.instagramShort) formatField('Instagram (Short)', String(content.instagramShort));
        if (content.instagramLong) formatField('Instagram (Long)', String(content.instagramLong));
        if (content.emailInvite) formatField('Email Invite', String(content.emailInvite));
        if (content.staffScript) formatField('Staff Script', String(content.staffScript));
        if (content.mainInsight) formatField('Main Insight', String(content.mainInsight));
        if (content.actionThisWeek) formatField('Action This Week', String(content.actionThisWeek));
        if (content.riskToWatch) formatField('Risk to Watch', String(content.riskToWatch));
        if (content.summary) formatField('Summary', String(content.summary));

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
  const wineryName = wineryContext?.wineryName ? `-${wineryContext.wineryName.replace(/\s+/g, '-')}` : '';
  doc.save(`AI-Can-Do-That${wineryName}-${new Date().toISOString().split('T')[0]}.pdf`);
}
