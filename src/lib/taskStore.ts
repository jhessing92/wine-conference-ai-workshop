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

// Load mock data for testing PDF generation
export function loadMockDataAndDownload(): void {
  // Mock winery context
  const mockContext: WineryContext = {
    wineryName: 'Willow Creek Vineyards',
    location: 'Dahlonega, Georgia',
    yearFounded: '2015',
    description: 'A family-owned boutique winery nestled in the North Georgia mountains, specializing in estate-grown wines with a focus on sustainability and authentic Georgia terroir.',
    wines: ['Reserve Chardonnay', 'Mountain Red Blend', 'Sweet Muscadine', 'Estate Rosé'],
    grapeVarieties: ['Chardonnay', 'Muscadine', 'Petit Manseng', 'Cabernet Franc'],
    wineStyles: ['Dry', 'Semi-sweet', 'Sweet']
  };
  saveWineryContext(mockContext);

  // Mock saved items from various exercises
  const mockItems: SavedItem[] = [
    {
      id: crypto.randomUUID(),
      category: 'Tasting Notes',
      title: 'Reserve Chardonnay Notes',
      exerciseType: 'tasting-notes',
      createdAt: new Date().toISOString(),
      content: {
        websiteNote: 'Our Reserve Chardonnay opens with bright notes of green apple and Meyer lemon, layered with subtle hints of vanilla and toasted oak from careful barrel aging. On the palate, expect a creamy texture balanced by crisp acidity, leading to a long, elegant finish. Estate-grown in our North Georgia vineyard at 1,800 feet elevation.',
        menuNote: 'Crisp and elegant with green apple, citrus, and a touch of oak. Perfect with seafood or creamy pasta dishes.',
        staffBullets: [
          'Barrel-aged 8 months in French oak - gives it that creamy texture',
          'Pairs beautifully with our cheese board or the smoked trout',
          'Our most awarded wine - 3 gold medals at the Georgia Wine Competition'
        ]
      }
    },
    {
      id: crypto.randomUUID(),
      category: 'Owner',
      title: 'Weekly Sales Analysis',
      exerciseType: 'owner-email',
      createdAt: new Date().toISOString(),
      content: {
        topWines: [
          { name: 'Sweet Muscadine', revenue: '$28,500', insight: 'Tourist favorite - drives 40% of weekend traffic' },
          { name: 'Estate Rosé', revenue: '$18,200', insight: 'Strong seasonal performer, up 25% from last month' },
          { name: 'Reserve Chardonnay', revenue: '$15,800', insight: 'Premium positioning working well' }
        ],
        bottomWines: [
          { name: 'Cabernet Franc', revenue: '$6,400', insight: 'Consider food pairing promotions to increase trial' },
          { name: 'Petit Manseng', revenue: '$5,100', insight: 'Staff may need more training on how to describe it' }
        ],
        whatThisMeans: [
          'Sweet wines drive traffic - lean into this for tourist season marketing',
          'Premium dry wines need better positioning and dedicated staff education',
          'Rosé momentum suggests expanding spring/summer inventory by 20%'
        ],
        decisionsThisWeek: [
          { action: 'Restock Muscadine before Memorial Day weekend - we\'ll run out at current pace', category: 'inventory' },
          { action: 'Create a Cab Franc food pairing flight with cheese to increase trial', category: 'promo' },
          { action: 'Schedule 15-min staff huddle on Petit Manseng talking points', category: 'training' }
        ]
      }
    },
    {
      id: crypto.randomUUID(),
      category: 'Vineyard',
      title: '7-Day Planning Checklist',
      exerciseType: 'vineyard-checklist',
      createdAt: new Date().toISOString(),
      content: {
        weeklyChecklist: [
          { day: 'Monday', tasks: ['Morning walk-through for pest pressure', 'Check irrigation lines in Block A', 'Document vine growth stage'] },
          { day: 'Tuesday', tasks: ['Canopy management - leaf pulling east side', 'Record growth measurements for vineyard log'] },
          { day: 'Wednesday', tasks: ['Equipment maintenance - check sprayer', 'Review updated weather forecast', 'Order supplies if needed'] },
          { day: 'Thursday', tasks: ['Rain prep if forecast holds', 'Check drainage paths are clear', 'Move any sensitive equipment under cover'] },
          { day: 'Friday', tasks: ['Leaf pulling for sun exposure on Chardonnay block', 'Team planning meeting for weekend tasks'] },
          { day: 'Saturday', tasks: ['Light monitoring only', 'Document any issues found during walk-through'] },
          { day: 'Sunday', tasks: ['Rest day - emergency response only'] }
        ],
        decisionTree: [
          { condition: 'If rain exceeds 1 inch', action: 'Check for standing water and scout for fungal pressure next morning' },
          { condition: 'If temps drop below 60°F at night', action: 'Delay any spray applications until conditions improve' },
          { condition: 'If humidity stays above 80% for 3+ days', action: 'Increase canopy monitoring frequency and consider preventive fungicide' }
        ],
        questionsForExpert: [
          'Given current veraison timing, what harvest date range should we plan for?',
          'Are there any specific nutrient deficiencies I should test for at this stage?',
          'Should we adjust our spray schedule given the extended humid forecast?'
        ],
        disclaimer: 'Planning support only. Validate all decisions with your viticulture expert and local extension office.'
      }
    },
    {
      id: crypto.randomUUID(),
      category: 'Tasting Room',
      title: 'Staff Scripts & Training',
      exerciseType: 'tasting-room-promo',
      createdAt: new Date().toISOString(),
      content: {
        scripts: {
          firstTime: 'Welcome to Willow Creek! Is this your first visit with us? Wonderful! Let me tell you a little about what makes us special. We\'re a family-owned winery - everything you\'ll taste today was grown right here on our estate at 1,800 feet elevation. I\'ll walk you through about five wines - we\'ll start light and work our way to the fuller reds. Feel free to ask any questions along the way. Ready to get started?',
          browsing: 'Take your time and enjoy! I\'m here if you have any questions. If you\'d like, I can point out a couple of our most popular bottles, or if you tell me what you usually enjoy, I can make a recommendation. No pressure at all - just here to help when you need me.',
          clubCandidate: 'I noticed you really enjoyed that wine! That\'s actually one of our club exclusive releases - we only made 200 cases this year. Our club members get first access to wines like that, plus 20% off everything and invites to our member-only harvest events. Would you like me to tell you more about how it works? No pressure, but I\'m happy to answer any questions.'
        },
        cheatSheet: [
          'Always greet within 30 seconds of arrival - first impressions matter',
          'Ask about their wine experience level before starting the tasting',
          'Mention one food pairing suggestion for each wine',
          'Watch for buying signals - lingering on a wine, asking about price, returning for another taste',
          'Never assume they want to buy - let them come to you'
        ],
        objectionResponses: [
          { objection: 'I don\'t drink much wine', response: 'That\'s perfectly fine! Many of our guests are just starting their wine journey. We have some lighter, sweeter options that are very approachable - would you like to start there?' },
          { objection: 'Your wines are too expensive', response: 'I understand. Keep in mind our wines are small-batch and grown right here on our estate. If you\'re looking for value, our house blend is a great everyday option at $18.' },
          { objection: 'I\'m not interested in the club', response: 'No problem at all! If you change your mind, you can always sign up online later. In the meantime, can I help you pick a bottle or two to take home today?' }
        ]
      }
    },
    {
      id: crypto.randomUUID(),
      category: 'Event Marketing',
      title: 'Summer Concert Series',
      exerciseType: 'event-marketing',
      createdAt: new Date().toISOString(),
      content: {
        instagramShort: 'Live music Saturday at Willow Creek. Local artist, great wine, mountain sunset. See you there. 🎵🍷',
        instagramLong: 'This Saturday, we\'re turning up the volume at Willow Creek Vineyards! 🎶\n\nJoin us for an evening of live music, local wine, and those Georgia mountain sunsets you can\'t get anywhere else.\n\nBring a blanket, grab a glass of our Estate Rosé, and unwind with us.\n\n📍 Willow Creek Vineyards, Dahlonega\n🕐 5-8 PM\n🎟️ Reservations recommended - link in bio\n\n#GeorgiaWine #LiveMusic #DahlonegaWineries #WineryEvents #NorthGeorgia #WeekendVibes #WineCountry',
        emailInvite: 'Subject: Live Music Saturday at Willow Creek - Save Your Spot\n\nHi there,\n\nThis Saturday, we\'re hosting live music at the vineyard and we\'d love to see you there.\n\nA fantastic local artist will be playing from 5-8 PM, and we\'ll have all your Willow Creek favorites available by the glass or bottle. The weather forecast looks perfect - bring a blanket and settle in for a relaxed evening under the stars.\n\nSpace is limited, so if you\'d like to guarantee a spot, we recommend reserving ahead. Walk-ins welcome as space allows.\n\n[RESERVE YOUR SPOT]\n\nHope to see you Saturday!\n\nCheers,\nThe Willow Creek Team',
        staffScript: 'Hey, just wanted to let you know we\'ve got live music this Saturday evening! Great local artist, and the weather forecast looks perfect. If you want to come back, I\'d grab a reservation - we usually fill up for these events. Want me to give you the link?'
      }
    },
    {
      id: crypto.randomUUID(),
      category: 'Lightning Lab',
      title: 'Winery FAQ Generator',
      exerciseType: 'lightning-lab',
      createdAt: new Date().toISOString(),
      content: {
        faqs: [
          { question: 'Do I need a reservation to visit Willow Creek?', answer: 'Reservations are recommended on weekends but not required. Walk-ins are always welcome on weekdays. For groups of 8 or more, please call ahead so we can ensure the best experience for your party.' },
          { question: 'What wines can I taste at Willow Creek?', answer: 'Our tasting flight includes 5-6 wines and typically features our Reserve Chardonnay, Sweet Muscadine, Estate Rosé, and Mountain Red Blend. We rotate selections based on seasonal availability.' },
          { question: 'Is Willow Creek family-friendly?', answer: 'Yes! We welcome families. Children can enjoy our outdoor lawn area and mountain views while parents taste. We offer grape juice for the little ones and have lawn games available on weekends.' },
          { question: 'Can I bring food to the winery?', answer: 'Absolutely! Picnics are encouraged on our grounds - it\'s one of the best ways to enjoy the view. We also offer cheese boards and local snacks for purchase. Outside alcohol is not permitted.' },
          { question: 'How do I join the Willow Creek Wine Club?', answer: 'Just ask any team member during your visit or sign up on our website. Members receive quarterly shipments of our best wines, 20% off all purchases, and exclusive invitations to harvest events and member tastings.' }
        ],
        staffTips: [
          'For first-time visitors, start with our most approachable wine (Sweet Muscadine) and work toward dryer options',
          'If guests mention a special occasion, let them know about our private tasting room option'
        ]
      }
    },
    {
      id: crypto.randomUUID(),
      category: 'Lightning Lab',
      title: 'Social Media Calendar',
      exerciseType: 'lightning-lab',
      createdAt: new Date().toISOString(),
      content: {
        weeklyPlan: [
          { day: 'Monday', postType: 'Behind the scenes', topic: 'Vineyard work this week', caption: 'Monday motivation from the vines! Our team is doing canopy management this week as we prepare for harvest season. #WillowCreekVineyards #GeorgiaWine' },
          { day: 'Wednesday', postType: 'Wine education', topic: 'Featured grape variety', caption: 'Did you know? Our Petit Manseng gets its unique honeyed character from the mountain terroir. Stop by this weekend to taste the difference elevation makes. #WineEducation' },
          { day: 'Friday', postType: 'Weekend invitation', topic: 'What to expect this weekend', caption: 'Your weekend plans just got better! Join us Saturday & Sunday for tastings, live music, and mountain views. See you soon! #WeekendVibes #WillowCreek' },
          { day: 'Saturday', postType: 'Real-time/Stories', topic: 'Live from the tasting room', caption: 'Happening now at Willow Creek! Perfect weather, great wine, happy guests. Come be part of the moment!' }
        ],
        hashtagSets: {
          local: ['#GeorgiaWine', '#Dahlonega', '#NorthGeorgia', '#ExploreGeorgia'],
          wine: ['#WineTasting', '#WineLovers', '#WineTime', '#WineCountry'],
          lifestyle: ['#WeekendVibes', '#DateNight', '#SupportLocal', '#MountainLife']
        },
        contentTips: [
          'Post between 6-8pm on weekdays for best engagement',
          'Stories perform well for real-time content; save polished posts for the feed',
          'Always respond to comments within 24 hours'
        ]
      }
    },
    {
      id: crypto.randomUUID(),
      category: 'Lightning Lab',
      title: 'Thank You Email',
      exerciseType: 'lightning-lab',
      createdAt: new Date().toISOString(),
      content: {
        subject: 'Thanks for visiting Willow Creek!',
        body: 'Hi there,\n\nThank you for spending time with us at Willow Creek Vineyards yesterday. We hope you enjoyed your tasting and found some new favorites to take home.\n\nIf you have any questions about the wines you tried or want recommendations for food pairings, just reply to this email - we love to help.\n\nWe\'d love to see you again soon. Our next live music event is coming up, and we think you\'d enjoy it.\n\nCheers,\nThe Willow Creek Team\n\nP.S. If you had a great time, we\'d be grateful for a review on Google or Yelp. It really helps other wine lovers find us!',
        clubMemberVersion: 'Welcome to the Willow Creek family! Your 20% member discount is now active. Your first shipment arrives next month.',
        followUpTiming: 'Send within 24 hours of visit for best engagement'
      }
    }
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockItems));
  
  console.log('Mock data loaded! Downloading PDF...');
  downloadReport();
}

// Expose to window for easy console access
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).loadMockDataAndDownload = loadMockDataAndDownload;
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
  let yPos = 10; // Start closer to top

  // Colors
  const tealColor: [number, number, number] = [6, 182, 212]; // cyan-500
  const darkBg: [number, number, number] = [15, 23, 42]; // slate-900
  const textLight: [number, number, number] = [248, 250, 252]; // slate-50
  const textMuted: [number, number, number] = [148, 163, 184]; // slate-400

  // Header background
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, pageWidth, 65, 'F');

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
      // Logo dimensions: original is 2164x508, scale to fit nicely (about 45mm wide)
      const logoWidth = 45;
      const logoHeight = logoWidth * (508 / 2164); // maintain aspect ratio
      doc.addImage(logoBase64, 'PNG', margin, yPos, logoWidth, logoHeight);
      yPos += logoHeight + 3;
    } else {
      // Fallback to text logo if image fails
      doc.setFillColor(...tealColor);
      doc.roundedRect(margin, yPos, 40, 10, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('shoofly.ai', margin + 5, yPos + 7);
      yPos += 15;
    }
  } catch {
    // Fallback to text logo if image loading fails
    doc.setFillColor(...tealColor);
    doc.roundedRect(margin, yPos, 40, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('shoofly.ai', margin + 5, yPos + 7);
    yPos += 15;
  }

  // Main title with quotes - left aligned
  doc.setTextColor(...textLight);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('"AI Can Do That"', margin, yPos);

  yPos += 10;

  // Event name - left aligned
  doc.setTextColor(...tealColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Georgia Wine Festival 2026', margin, yPos);

  yPos += 5;

  // Location - left aligned
  doc.setTextColor(...textMuted);
  doc.setFontSize(10);
  doc.text('Forsyth, Georgia', margin, yPos);

  yPos += 20;

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
            const bulletLines = doc.splitTextToSize('- ' + bullet, contentWidth - 10);
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
            doc.text(`- ${wine.name}: ${wine.revenue}`, margin + 2, yPos);
            yPos += 4;
            if (wine.insight) {
              doc.setTextColor(100, 100, 100);
              doc.text(`  > ${wine.insight}`, margin + 4, yPos);
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
            doc.text(`- ${wine.name}: ${wine.revenue}`, margin + 2, yPos);
            yPos += 4;
            if (wine.insight) {
              doc.setTextColor(100, 100, 100);
              doc.text(`  > ${wine.insight}`, margin + 4, yPos);
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
            const insightLines = doc.splitTextToSize('- ' + insight, contentWidth - 10);
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
              const taskLines = doc.splitTextToSize('[ ] ' + task, contentWidth - 15);
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
            const tipLines = doc.splitTextToSize('- ' + tip, contentWidth - 10);
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
        if (content.summary && !content.costBreakdown) formatField('Summary', String(content.summary));
        
        // Lightning Lab - FAQs
        if (content.faqs && Array.isArray(content.faqs)) {
          doc.setFont('helvetica', 'bold');
          doc.text('Frequently Asked Questions:', margin, yPos);
          yPos += 5;
          doc.setFont('helvetica', 'normal');
          (content.faqs as Array<{ question: string; answer: string }>).forEach((faq, idx) => {
            checkNewPage(15);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...tealColor);
            const qLines = doc.splitTextToSize(`Q${idx + 1}: ${faq.question}`, contentWidth - 10);
            doc.text(qLines, margin + 2, yPos);
            yPos += (qLines.length * 4) + 2;
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(60, 60, 60);
            const aLines = doc.splitTextToSize(`A: ${faq.answer}`, contentWidth - 10);
            doc.text(aLines, margin + 2, yPos);
            yPos += (aLines.length * 4) + 4;
          });
          yPos += 2;
        }
        
        // Lightning Lab - Social Calendar
        if (content.weeklyPlan && Array.isArray(content.weeklyPlan)) {
          doc.setFont('helvetica', 'bold');
          doc.text('Weekly Social Media Plan:', margin, yPos);
          yPos += 5;
          doc.setFont('helvetica', 'normal');
          (content.weeklyPlan as Array<{ day: string; postType: string; topic: string; caption: string }>).forEach((day) => {
            checkNewPage(20);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...tealColor);
            doc.text(`${day.day} - ${day.postType}`, margin + 2, yPos);
            yPos += 4;
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(60, 60, 60);
            doc.text(`Topic: ${day.topic}`, margin + 4, yPos);
            yPos += 4;
            const captionLines = doc.splitTextToSize(`Caption: ${day.caption}`, contentWidth - 15);
            doc.text(captionLines, margin + 4, yPos);
            yPos += (captionLines.length * 4) + 4;
          });
          yPos += 2;
        }
        if (content.hashtagSets && typeof content.hashtagSets === 'object') {
          doc.setFont('helvetica', 'bold');
          doc.text('Hashtag Sets:', margin, yPos);
          yPos += 4;
          doc.setFont('helvetica', 'normal');
          const sets = content.hashtagSets as Record<string, string[]>;
          Object.entries(sets).forEach(([category, tags]) => {
            checkNewPage(8);
            const tagLine = doc.splitTextToSize(`${category}: ${tags.join(' ')}`, contentWidth - 10);
            doc.text(tagLine, margin + 2, yPos);
            yPos += (tagLine.length * 4) + 1;
          });
          yPos += 2;
        }
        if (content.contentTips && Array.isArray(content.contentTips)) {
          doc.setFont('helvetica', 'bold');
          doc.text('Content Tips:', margin, yPos);
          yPos += 4;
          doc.setFont('helvetica', 'normal');
          (content.contentTips as string[]).forEach((tip) => {
            checkNewPage(8);
            const tipLines = doc.splitTextToSize('- ' + tip, contentWidth - 10);
            doc.text(tipLines, margin + 2, yPos);
            yPos += (tipLines.length * 4) + 1;
          });
          yPos += 2;
        }
        
        // Lightning Lab - Thank You Email
        if (content.subject && content.body) {
          formatField('Subject', String(content.subject));
          formatField('Email Body', String(content.body));
        }
        if (content.clubMemberVersion) {
          formatField('Club Member Version', String(content.clubMemberVersion));
        }
        if (content.followUpTiming) {
          formatField('Follow-up Timing', String(content.followUpTiming));
        }
        
        // Lightning Lab - Staff Training
        if (content.topicOverview) formatField('Topic Overview', String(content.topicOverview));
        if (content.keyPoints && Array.isArray(content.keyPoints)) {
          doc.setFont('helvetica', 'bold');
          doc.text('Key Points:', margin, yPos);
          yPos += 4;
          doc.setFont('helvetica', 'normal');
          (content.keyPoints as string[]).forEach((point) => {
            checkNewPage(8);
            const pointLines = doc.splitTextToSize('- ' + point, contentWidth - 10);
            doc.text(pointLines, margin + 2, yPos);
            yPos += (pointLines.length * 4) + 1;
          });
          yPos += 2;
        }
        if (content.practiceScenario) formatField('Practice Scenario', String(content.practiceScenario));
        if (content.quickReference) formatField('Quick Reference', String(content.quickReference));
        
        // Lightning Lab - Labor Schedule
        if (content.recommendedSchedule && Array.isArray(content.recommendedSchedule)) {
          doc.setFont('helvetica', 'bold');
          doc.text('Recommended Schedule:', margin, yPos);
          yPos += 4;
          doc.setFont('helvetica', 'normal');
          (content.recommendedSchedule as Array<{ day: string; staff: number; notes: string }>).forEach((day) => {
            checkNewPage(6);
            doc.text(`${day.day}: ${day.staff} staff - ${day.notes}`, margin + 2, yPos);
            yPos += 4;
          });
          yPos += 2;
        }
        if (content.peakTimes && Array.isArray(content.peakTimes)) {
          doc.setFont('helvetica', 'bold');
          doc.text('Peak Times:', margin, yPos);
          yPos += 4;
          doc.setFont('helvetica', 'normal');
          (content.peakTimes as string[]).forEach((time) => {
            doc.text('- ' + time, margin + 2, yPos);
            yPos += 4;
          });
          yPos += 2;
        }
        if (content.considerations && Array.isArray(content.considerations)) {
          doc.setFont('helvetica', 'bold');
          doc.text('Considerations:', margin, yPos);
          yPos += 4;
          doc.setFont('helvetica', 'normal');
          (content.considerations as string[]).forEach((c) => {
            checkNewPage(8);
            const cLines = doc.splitTextToSize('- ' + c, contentWidth - 10);
            doc.text(cLines, margin + 2, yPos);
            yPos += (cLines.length * 4) + 1;
          });
          yPos += 2;
        }
        
        // Lightning Lab - Wine Club Campaign
        if (content.emailSubject) formatField('Email Subject', String(content.emailSubject));
        if (content.emailBody) formatField('Email Body', String(content.emailBody));
        if (content.benefits && Array.isArray(content.benefits)) {
          doc.setFont('helvetica', 'bold');
          doc.text('Benefits:', margin, yPos);
          yPos += 4;
          doc.setFont('helvetica', 'normal');
          (content.benefits as string[]).forEach((b) => {
            checkNewPage(8);
            const bLines = doc.splitTextToSize('- ' + b, contentWidth - 10);
            doc.text(bLines, margin + 2, yPos);
            yPos += (bLines.length * 4) + 1;
          });
          yPos += 2;
        }
        if (content.cta) formatField('Call to Action', String(content.cta));
        
        // Lightning Lab - Customer SOP
        if (content.title && content.purpose) {
          formatField('SOP Title', String(content.title));
          formatField('Purpose', String(content.purpose));
        }
        if (content.steps && Array.isArray(content.steps)) {
          doc.setFont('helvetica', 'bold');
          doc.text('Steps:', margin, yPos);
          yPos += 4;
          doc.setFont('helvetica', 'normal');
          (content.steps as Array<{ step: number; action: string; note?: string }>).forEach((s) => {
            checkNewPage(10);
            doc.text(`${s.step}. ${s.action}`, margin + 2, yPos);
            yPos += 4;
            if (s.note) {
              doc.setTextColor(100, 100, 100);
              doc.text(`   Note: ${s.note}`, margin + 4, yPos);
              doc.setTextColor(60, 60, 60);
              yPos += 4;
            }
          });
          yPos += 2;
        }
        if (content.commonMistakes && Array.isArray(content.commonMistakes)) {
          doc.setFont('helvetica', 'bold');
          doc.text('Common Mistakes to Avoid:', margin, yPos);
          yPos += 4;
          doc.setFont('helvetica', 'normal');
          (content.commonMistakes as string[]).forEach((m) => {
            checkNewPage(8);
            const mLines = doc.splitTextToSize('- ' + m, contentWidth - 10);
            doc.text(mLines, margin + 2, yPos);
            yPos += (mLines.length * 4) + 1;
          });
          yPos += 2;
        }
        
        // Lightning Lab - Job Description
        if (content.title && content.summary && !content.purpose) {
          formatField('Position', String(content.title));
          formatField('Summary', String(content.summary));
        }
        if (content.responsibilities && Array.isArray(content.responsibilities)) {
          doc.setFont('helvetica', 'bold');
          doc.text('Responsibilities:', margin, yPos);
          yPos += 4;
          doc.setFont('helvetica', 'normal');
          (content.responsibilities as string[]).forEach((r) => {
            checkNewPage(8);
            const rLines = doc.splitTextToSize('- ' + r, contentWidth - 10);
            doc.text(rLines, margin + 2, yPos);
            yPos += (rLines.length * 4) + 1;
          });
          yPos += 2;
        }
        if (content.qualifications && Array.isArray(content.qualifications)) {
          doc.setFont('helvetica', 'bold');
          doc.text('Qualifications:', margin, yPos);
          yPos += 4;
          doc.setFont('helvetica', 'normal');
          (content.qualifications as string[]).forEach((q) => {
            checkNewPage(8);
            const qLines = doc.splitTextToSize('- ' + q, contentWidth - 10);
            doc.text(qLines, margin + 2, yPos);
            yPos += (qLines.length * 4) + 1;
          });
          yPos += 2;
        }
        
        // Lightning Lab - COGS Model
        if (content.costBreakdown && Array.isArray(content.costBreakdown)) {
          if (content.summary) formatField('Summary', String(content.summary));
          doc.setFont('helvetica', 'bold');
          doc.text('Cost Breakdown:', margin, yPos);
          yPos += 4;
          doc.setFont('helvetica', 'normal');
          (content.costBreakdown as Array<{ category: string; percentage: string; note: string }>).forEach((c) => {
            checkNewPage(6);
            doc.text(`${c.category}: ${c.percentage} - ${c.note}`, margin + 2, yPos);
            yPos += 4;
          });
          yPos += 2;
        }
        if (content.marginAnalysis) formatField('Margin Analysis', String(content.marginAnalysis));
        if (content.recommendations && Array.isArray(content.recommendations)) {
          doc.setFont('helvetica', 'bold');
          doc.text('Recommendations:', margin, yPos);
          yPos += 4;
          doc.setFont('helvetica', 'normal');
          (content.recommendations as string[]).forEach((r) => {
            checkNewPage(8);
            const rLines = doc.splitTextToSize('- ' + r, contentWidth - 10);
            doc.text(rLines, margin + 2, yPos);
            yPos += (rLines.length * 4) + 1;
          });
          yPos += 2;
        }
        
        // Lightning Lab - Compliance Checklist
        if (content.checklist && Array.isArray(content.checklist)) {
          doc.setFont('helvetica', 'bold');
          doc.text('Compliance Checklist:', margin, yPos);
          yPos += 4;
          doc.setFont('helvetica', 'normal');
          (content.checklist as Array<{ item: string; status: string }>).forEach((c) => {
            checkNewPage(6);
            doc.text(`[ ] ${c.item} (${c.status})`, margin + 2, yPos);
            yPos += 4;
          });
          yPos += 2;
        }
        if (content.questionsForAttorney && Array.isArray(content.questionsForAttorney)) {
          doc.setFont('helvetica', 'bold');
          doc.text('Questions for Your Attorney:', margin, yPos);
          yPos += 4;
          doc.setFont('helvetica', 'normal');
          (content.questionsForAttorney as string[]).forEach((q, i) => {
            checkNewPage(8);
            const qLines = doc.splitTextToSize(`${i + 1}. ${q}`, contentWidth - 10);
            doc.text(qLines, margin + 2, yPos);
            yPos += (qLines.length * 4) + 1;
          });
          yPos += 2;
        }
        if (content.resourceLinks && Array.isArray(content.resourceLinks)) {
          doc.setFont('helvetica', 'bold');
          doc.text('Resources:', margin, yPos);
          yPos += 4;
          doc.setFont('helvetica', 'normal');
          doc.text((content.resourceLinks as string[]).join(', '), margin + 2, yPos);
          yPos += 5;
        }
        
        // Lightning Lab - Vine Triage
        if (content.possibleIssues && Array.isArray(content.possibleIssues)) {
          doc.setFont('helvetica', 'bold');
          doc.text('Possible Issues:', margin, yPos);
          yPos += 4;
          doc.setFont('helvetica', 'normal');
          (content.possibleIssues as string[]).forEach((issue) => {
            checkNewPage(8);
            const iLines = doc.splitTextToSize('- ' + issue, contentWidth - 10);
            doc.text(iLines, margin + 2, yPos);
            yPos += (iLines.length * 4) + 1;
          });
          yPos += 2;
        }
        if (content.whatToCheckNext && Array.isArray(content.whatToCheckNext)) {
          doc.setFont('helvetica', 'bold');
          doc.text('What to Check Next:', margin, yPos);
          yPos += 4;
          doc.setFont('helvetica', 'normal');
          (content.whatToCheckNext as string[]).forEach((check) => {
            checkNewPage(8);
            const cLines = doc.splitTextToSize('- ' + check, contentWidth - 10);
            doc.text(cLines, margin + 2, yPos);
            yPos += (cLines.length * 4) + 1;
          });
          yPos += 2;
        }
        if (content.whoToContact && Array.isArray(content.whoToContact)) {
          doc.setFont('helvetica', 'bold');
          doc.text('Who to Contact:', margin, yPos);
          yPos += 4;
          doc.setFont('helvetica', 'normal');
          (content.whoToContact as string[]).forEach((contact) => {
            doc.text('- ' + contact, margin + 2, yPos);
            yPos += 4;
          });
          yPos += 2;
        }
        
        // Staff tips (used by multiple Lightning Lab tools)
        if (content.staffTips && Array.isArray(content.staffTips)) {
          doc.setFont('helvetica', 'bold');
          doc.text('Staff Tips:', margin, yPos);
          yPos += 4;
          doc.setFont('helvetica', 'normal');
          (content.staffTips as string[]).forEach((tip) => {
            checkNewPage(8);
            const tipLines = doc.splitTextToSize('- ' + tip, contentWidth - 10);
            doc.text(tipLines, margin + 2, yPos);
            yPos += (tipLines.length * 4) + 1;
          });
          yPos += 2;
        }
        
        // Disclaimer if present
        if (content.disclaimer) {
          checkNewPage(10);
          doc.setFillColor(255, 243, 205); // amber tint
          doc.roundedRect(margin, yPos, contentWidth, 10, 2, 2, 'F');
          doc.setFontSize(8);
          doc.setTextColor(180, 83, 9);
          const disclaimerLines = doc.splitTextToSize('NOTE: ' + String(content.disclaimer), contentWidth - 6);
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
