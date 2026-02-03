import { getWineryContext } from './taskStore';

export function getWineryName(): string {
  const context = getWineryContext();
  return context?.wineryName || 'Sample Winery';
}

export function personalizeText(text: string, wineryName?: string): string {
  const name = wineryName || getWineryName();
  return text
    .replace(/\[Winery\]/g, name)
    .replace(/\[Your Winery\]/g, name)
    .replace(/\[Winery Name\]/g, name);
}

export function getPersonalizedFallback<T extends keyof typeof fallbackData>(
  key: T,
  wineryName?: string
): typeof fallbackData[T] {
  const data = JSON.parse(JSON.stringify(fallbackData[key]));
  const name = wineryName || getWineryName();

  function personalizeObject(obj: unknown): unknown {
    if (typeof obj === 'string') {
      return personalizeText(obj, name);
    }
    if (Array.isArray(obj)) {
      return obj.map(item => personalizeObject(item));
    }
    if (obj && typeof obj === 'object') {
      const result: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(obj)) {
        result[k] = personalizeObject(v);
      }
      return result;
    }
    return obj;
  }

  return personalizeObject(data) as typeof fallbackData[T];
}

export const sampleWineryContext = {
  wineryName: 'Willow Creek Vineyards',
  location: 'North Georgia',
  description: 'A family-owned winery specializing in estate-grown wines',
  wines: ['Chardonnay', 'Muscadine', 'Red Blend'],
  grapeVarieties: ['Muscadine', 'Chardonnay', 'Petit Manseng'],
  wineStyles: ['Dry', 'Semi-sweet', 'Sweet'],
};

export const fallbackData = {
  'tasting-notes': {
    websiteNote: `This [Winery] red blend opens with inviting aromas of ripe blackberry and subtle hints of cedar. On the palate, you'll find layers of dark cherry and plum, supported by soft tannins and a touch of vanilla from oak aging. The wine finishes with pleasant length and a gentle spice note. Perfect alongside grilled meats, hearty pasta dishes, or aged cheeses. Serve at cellar temperature and consider decanting for 20 minutes to allow the flavors to fully express themselves.`,
    menuNote: `A fruit-forward [Winery] red blend with blackberry, cherry, and soft tannins. Pairs beautifully with grilled meats and aged cheeses.`,
    staffBullets: [
      'Fruit-forward with blackberry and cherry notes',
      'Soft tannins make it approachable for new wine drinkers',
      'Great pairing: try it with our cheese board or the pulled pork'
    ]
  },

  'owner-analysis': {
    topWines: [
      { name: '[Winery] Muscadine Sweet', revenue: '$22,000', insight: 'Consistent crowd favorite' },
      { name: '[Winery] Rose', revenue: '$15,800', insight: 'Strong seasonal performance' },
      { name: '[Winery] Chardonnay', revenue: '$12,500', insight: 'Solid year-round seller' },
    ],
    bottomWines: [
      { name: '[Winery] Cab Franc', revenue: '$6,100', insight: 'Consider positioning as premium' },
      { name: '[Winery] Merlot', revenue: '$8,200', insight: 'May need better visibility' },
    ],
    whatThisMeans: [
      '[Winery] sweet wines drive traffic - lean into this for tourist season',
      'Dry reds may need better staff training or food pairing suggestions',
      'Rose shows seasonal strength - plan [Winery] inventory for spring/summer'
    ],
    decisionsThisWeek: [
      { action: 'Restock [Winery] Muscadine - running low before peak season', category: 'inventory' },
      { action: 'Create a Cab Franc food pairing flight to increase trial', category: 'promo' },
      { action: 'Review [Winery] Merlot pricing against local competitors', category: 'pricing' }
    ]
  },

  'vineyard-planning': {
    weeklyChecklist: [
      { day: 'Monday', tasks: ['Morning walk-through for pest pressure', 'Check irrigation lines'] },
      { day: 'Tuesday', tasks: ['Canopy management in Block A', 'Record growth measurements'] },
      { day: 'Wednesday', tasks: ['Equipment maintenance', 'Review weather forecast update'] },
      { day: 'Thursday', tasks: ['Rain prep if forecast holds', 'Check drainage paths'] },
      { day: 'Friday', tasks: ['Leaf pulling for sun exposure', 'Team planning for weekend'] },
      { day: 'Saturday', tasks: ['Light monitoring only', 'Document any issues found'] },
      { day: 'Sunday', tasks: ['Rest day - emergency response only'] }
    ],
    decisionTree: [
      { condition: 'If rain exceeds 1 inch', action: 'Check for standing water and fungal pressure next day' },
      { condition: 'If temps drop below 60F at night', action: 'Delay any spray applications' },
      { condition: 'If humidity stays above 80%', action: 'Increase canopy monitoring frequency' }
    ],
    questionsForExpert: [
      'Given current veraison timing, what harvest date range should we plan for?',
      'Are there any specific nutrient deficiencies I should test for right now?',
      'Should we adjust our spray schedule given the extended humid forecast?'
    ],
    disclaimer: 'Planning support only. Validate with your viticulture expert and local requirements.'
  },

  'tasting-room-scripts': {
    scripts: {
      firstTime: `Welcome to [Winery]! Is this your first visit with us? Wonderful! Let me tell you a little about what makes [Winery] wines special. We're one of Georgia's small family-owned wineries, and everything you'll taste today was grown and made right here. I'll walk you through about five wines today - we'll start light and work our way to the fuller reds. Feel free to ask any questions along the way. Ready to get started?`,
      browsing: `Take your time and enjoy [Winery]! I'm here if you have any questions. If you'd like, I can point out a couple of our most popular bottles, or if you tell me what you usually enjoy, I can make a recommendation. No pressure at all - just here to help if you need me.`,
      clubCandidate: `I noticed you really enjoyed that wine. That's actually one of our [Winery] club exclusive releases - we only made 200 cases. Our club members get first access to wines like that, plus 20% off everything and invites to our member-only events. Would you like me to tell you more about how it works? There's no pressure, but I can answer any questions.`
    },
    cheatSheet: [
      'Always greet within 30 seconds of arrival',
      'Ask about their wine experience level before starting',
      'Mention one food pairing per wine',
      'Watch for signs of interest - lingering, questions, returning to a wine',
      'Never assume they want to buy - let them come to you'
    ],
    objectionResponses: [
      { objection: 'I don\'t drink much wine', response: 'That\'s perfectly fine! Many [Winery] guests are just starting their wine journey. We have some lighter, sweeter options that are very approachable.' },
      { objection: 'Your wines are too expensive', response: 'I understand. Keep in mind [Winery] wines are small-batch and made entirely on-site. If you\'re looking for value, our house blend is a great everyday option.' },
      { objection: 'I\'m not interested in the club', response: 'No problem at all. If you change your mind, you can always sign up for the [Winery] club online later. In the meantime, can I help you pick a bottle or two to take home?' }
    ]
  },

  'event-marketing': {
    instagramShort: `Live music this Saturday at [Winery]. Local artist, great wine, Georgia sunset. See you there.`,
    instagramLong: `This Saturday, we're turning up the volume at [Winery]. Join us for an evening of live music, local wine, and those Georgia sunsets you can't get anywhere else.\n\nBring a blanket, grab a glass, and unwind with us.\n\nReservations recommended - link in bio.\n\n#GeorgiaWine #LiveMusic #WineryEvents #WeekendVibes #SupportLocal`,
    emailInvite: `Subject: Live Music Saturday at [Winery] - Save Your Spot\n\nHi there,\n\nThis Saturday, we're hosting live music at [Winery] and we'd love to see you there.\n\nA great local artist will be playing from 5-8 PM, and we'll have all your [Winery] favorites available by the glass or bottle. The weather looks perfect - bring a blanket and settle in for a relaxed evening.\n\nSpace is limited, so if you'd like to guarantee a spot, reserve ahead. Walk-ins welcome as space allows.\n\n[RESERVE NOW]\n\nHope to see you Saturday!\n\nThe [Winery] Team`,
    staffScript: `Hey, just wanted to let you know we've got live music this Saturday evening at [Winery]. Great local artist, beautiful weather in the forecast. If you want to come back, I'd grab a reservation - we usually fill up for these. I can give you the link if you're interested.`
  },

  'numbers-to-action': {
    bestChart: 'Line chart showing [Winery] monthly trend with a clear upward trajectory highlighted',
    mainInsight: '[Winery] sales are growing 15% month-over-month, with April showing the strongest performance - likely driven by spring tourism.',
    actionThisWeek: 'Increase [Winery] weekend staffing by one person to handle the growing traffic without compromising service quality.',
    riskToWatch: 'If growth continues at this pace, [Winery] inventory may run short by June - review stock levels for top sellers now.'
  },

  'staff-training': {
    topicOverview: 'Handling wine questions from guests who may know more (or think they know more) than you do.',
    keyPoints: [
      'It\'s okay to say "I don\'t know, but let me find out" - honesty builds trust',
      'Redirect to what you do know: "I\'m not sure about that region, but I can tell you exactly how we made this wine"',
      'Ask questions back: "What draws you to that style?" - shows interest and buys time'
    ],
    practiceScenario: 'A guest asks about malolactic fermentation and whether your Chardonnay went through it. You\'re not sure. How do you respond?',
    quickReference: 'When stumped: Acknowledge, redirect to what you know, offer to find out.'
  },

  'labor-schedule': {
    recommendedSchedule: [
      { day: 'Monday', staff: 1, notes: 'Minimal traffic, focus on restocking' },
      { day: 'Tuesday', staff: 1, notes: 'Similar to Monday' },
      { day: 'Wednesday', staff: 1, notes: 'Midweek pickup starts' },
      { day: 'Thursday', staff: 2, notes: 'Pre-weekend increase' },
      { day: 'Friday', staff: 2, notes: 'Steady afternoon traffic' },
      { day: 'Saturday', staff: 3, notes: 'Peak day - full coverage' },
      { day: 'Sunday', staff: 2, notes: 'Strong but slower than Saturday' }
    ],
    peakTimes: ['Saturday 1-5 PM', 'Sunday 2-4 PM', 'Friday 4-6 PM'],
    considerations: [
      'Consider overlap during shift changes on peak days',
      'Have one person designated for restocking during slow periods'
    ]
  },

  'wine-club-campaign': {
    emailSubject: 'Your seat at the [Winery] table is waiting',
    emailBody: `Hi there,\n\nWe wanted to reach out personally because we think you'd be a great fit for the [Winery] wine club family.\n\nAs a member, you'll get quarterly shipments of our best [Winery] wines (including some you can't buy anywhere else), 20% off all purchases, and invites to member-only events throughout the year.\n\nBut honestly? The best part is being part of a community that genuinely loves what we do here at [Winery].\n\nNo pressure, no gimmicks - just great wine and good people.\n\nIf you're interested, you can sign up online or just reply to this email and we'll take care of it.\n\nCheers,\nThe [Winery] Team`,
    benefits: [
      'Quarterly shipments of hand-selected [Winery] wines',
      '20% discount on all purchases',
      'Exclusive access to limited releases',
      'Member-only events and harvest experiences at [Winery]'
    ],
    cta: 'Join the [Winery] Club'
  },

  'customer-sop': {
    title: 'Handling Customer Complaints',
    purpose: 'Turn negative experiences into opportunities to build loyalty through genuine care and quick resolution.',
    steps: [
      { step: 1, action: 'Listen fully without interrupting', note: 'Let them finish before responding' },
      { step: 2, action: 'Acknowledge their frustration', note: '"I understand why that would be frustrating"' },
      { step: 3, action: 'Apologize sincerely', note: 'Even if it wasn\'t your fault directly' },
      { step: 4, action: 'Offer a specific solution', note: 'Replacement, refund, or future credit' },
      { step: 5, action: 'Follow up if possible', note: 'A quick email or call goes a long way' }
    ],
    commonMistakes: [
      'Getting defensive or making excuses',
      'Offering a solution before fully understanding the problem',
      'Forgetting to document the complaint for future reference'
    ]
  },

  'job-description': {
    title: '[Winery] Tasting Room Associate',
    summary: 'Join our team as the welcoming face of [Winery]. You\'ll guide guests through wine tastings, share our story, and help visitors find their new favorite bottle.',
    responsibilities: [
      'Conduct engaging wine tastings for guests of all experience levels',
      'Share the story of [Winery] wines and winemaking process',
      'Process sales and wine club sign-ups',
      'Maintain a clean, welcoming tasting room environment',
      'Assist with [Winery] events and special occasions'
    ],
    qualifications: [
      'Genuine enthusiasm for hospitality and customer service',
      'Ability to stand for extended periods',
      'Weekend and holiday availability required',
      'Wine knowledge a plus but not required - we\'ll train you'
    ],
    benefits: [
      '[Winery] employee wine discount',
      'Tips',
      'Flexible scheduling',
      'Learn about winemaking from the ground up'
    ]
  },

  'cogs-model': {
    summary: 'At a $28 bottle price with known costs of $11/bottle, your gross margin is approximately 60%, which is healthy for a small winery.',
    costBreakdown: [
      { category: 'Grapes/Fruit', percentage: '29%', note: '$8 per bottle' },
      { category: 'Bottling & Packaging', percentage: '11%', note: '$3 per bottle' },
      { category: 'Overhead (est.)', percentage: '15%', note: 'Labor, facility, utilities' },
      { category: 'Marketing (est.)', percentage: '5%', note: 'Typical for small operations' },
      { category: 'Gross Margin', percentage: '40%', note: 'After direct costs' }
    ],
    marginAnalysis: 'Your margins are solid for a small producer. The key is maintaining volume to cover fixed overhead costs.',
    recommendations: [
      'Track actual overhead costs monthly to refine this estimate',
      'Consider whether club sales (at 20% discount) still hit target margins'
    ]
  },

  'compliance-checklist': {
    checklist: [
      { item: 'Label alcohol content matches actual ABV', status: 'to verify' },
      { item: 'Vintage date claims meet 85% threshold', status: 'to verify' },
      { item: 'State and federal warning statements present', status: 'to verify' },
      { item: 'Producer name and address correct', status: 'to verify' },
      { item: 'Net contents properly displayed', status: 'to verify' }
    ],
    questionsForAttorney: [
      'Do we need a new COLA for this label variation?',
      'What are the specific Georgia state requirements beyond TTB federal rules?'
    ],
    resourceLinks: ['TTB.gov', 'Georgia Department of Revenue'],
    disclaimer: 'Not legal advice. Consult with your attorney and compliance expert.'
  },

  'vine-triage': {
    possibleIssues: [
      'Nutrient deficiency (nitrogen or iron most common with yellowing)',
      'Root stress from excess moisture near creek',
      'Early sign of disease pressure (monitor closely)'
    ],
    whatToCheckNext: [
      'Look for patterns - is it affecting certain rows or random vines?',
      'Check soil moisture levels in affected area vs. healthy areas',
      'Examine leaf undersides for any spots, insects, or unusual texture',
      'Note whether yellowing is between veins (interveinal) or uniform'
    ],
    whoToContact: [
      'Your viticulture consultant for a field visit',
      'Local UGA Extension office for soil testing',
      'Neighboring vineyards to see if they\'re seeing similar issues'
    ],
    disclaimer: 'This is not a diagnosis. Validate with your viticulture expert and local extension office.'
  },

  'winery-faq': {
    faqs: [
      { question: 'Do I need a reservation to visit [Winery]?', answer: 'Reservations are recommended on weekends but not required. Walk-ins are welcome on weekdays. For groups of 8 or more, please call ahead so we can ensure the best experience for your party.' },
      { question: 'What wines can I taste at [Winery]?', answer: 'Our tasting flight includes 5-6 wines, typically featuring our estate Chardonnay, Muscadine varieties, and seasonal red blends. We rotate selections based on availability.' },
      { question: 'Is [Winery] family-friendly?', answer: 'Yes! We welcome families. Children can enjoy our outdoor areas while parents taste. We offer grape juice for the little ones and have lawn games available.' },
      { question: 'Can I bring food to [Winery]?', answer: 'Absolutely. We encourage picnics on our grounds. We also offer cheese boards and snacks for purchase. No outside alcohol, please.' },
      { question: 'How do I join the [Winery] Wine Club?', answer: 'Ask any team member during your visit or sign up online. Members receive quarterly shipments, 20% off purchases, and exclusive event invitations.' }
    ],
    staffTips: [
      'For first-time visitors, start with our most approachable wine and work toward bolder options',
      'If guests mention a special occasion, mention our private tasting options'
    ]
  },

  'social-calendar': {
    weeklyPlan: [
      { day: 'Monday', postType: 'Behind the scenes', topic: 'Vineyard or cellar work happening this week', caption: 'Monday motivation from the vines. Our team is [activity] this week as we prepare for [season/event]. #[Winery] #GeorgiaWine' },
      { day: 'Wednesday', postType: 'Wine education', topic: 'Feature a grape variety or winemaking technique', caption: 'Did you know? Our [wine variety] gets its unique character from [technique/terroir]. Stop by this weekend to taste the difference. #WineEducation' },
      { day: 'Friday', postType: 'Weekend invitation', topic: 'What to expect this weekend', caption: 'Your weekend plans just got better. Join us Saturday & Sunday for tastings, [activity], and beautiful views. See you soon! #WeekendVibes #[Winery]' },
      { day: 'Saturday', postType: 'Real-time/Stories', topic: 'Live content from the tasting room', caption: 'Happening now at [Winery]! [describe scene]. Come be part of the moment. #LiveFrom[Winery]' }
    ],
    hashtagSets: {
      local: ['#GeorgiaWine', '#NorthGeorgia', '#GeorgiaWineries', '#ExploreGeorgia'],
      wine: ['#WineTasting', '#WineLovers', '#WineTime', '#WineCountry'],
      lifestyle: ['#WeekendVibes', '#DateNight', '#GirlsTrip', '#SupportLocal']
    },
    contentTips: [
      'Post between 6-8pm on weekdays, 11am-1pm on weekends for best engagement',
      'Stories perform well for real-time content; save polished posts for the feed'
    ]
  },

  'thank-you-email': {
    subject: 'Thanks for visiting [Winery]!',
    body: `Hi there,

Thank you for spending time with us at [Winery] yesterday. We hope you enjoyed your tasting and found some new favorites to take home.

If you have any questions about the wines you tried or want recommendations for food pairings, just reply to this email - we love to help.

Don't forget: if you joined our wine club, your member discount is already active for your next visit or online order.

We'd love to see you again soon. Our next event is coming up, and we think you'd enjoy it.

Cheers,
The [Winery] Team

P.S. If you had a great time, we'd be grateful for a review on Google or Yelp. It really helps other wine lovers find us!`,
    clubMemberVersion: `Hi there,

Welcome to the [Winery] family! We're thrilled you decided to join our wine club during your visit yesterday.

Your member benefits are now active:
- 20% off all purchases (in-store and online)
- First access to new releases
- Exclusive member events
- Quarterly shipments of our best wines

Your first shipment will arrive in [month]. In the meantime, stop by anytime - your discount is ready to use.

Cheers to many more tastings together,
The [Winery] Team`,
    followUpTiming: 'Send within 24 hours of visit for best engagement'
  }
};
