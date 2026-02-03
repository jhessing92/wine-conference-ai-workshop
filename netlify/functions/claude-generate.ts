import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

interface GenerateRequest {
  type: string;
  inputs: Record<string, unknown>;
  context?: string;
}

const systemPrompts: Record<string, string> = {
  'tasting-notes': `You are a professional wine copywriter helping wineries create tasting notes.

CRITICAL RULES:
- ONLY use the winery name, wines, varieties, and details provided in the input
- DO NOT invent or make up wine names, winery names, or details not provided
- If specific wines are listed, write about THOSE wines specifically
- If grape varieties are listed, focus on THOSE varieties
- Use the actual winery name provided, never a generic or made-up name

Generate content that is:
- Based ONLY on the actual information provided
- Authentic and grounded (no over-the-top marketing speak)
- Appropriate for the specified tone and audience
- Descriptive but accessible

Respond with valid JSON containing:
{
  "websiteNote": "Full tasting note for website (about 120 words) - use ACTUAL wines/details provided",
  "menuNote": "Concise note for menus (about 40 words) - use ACTUAL wines/details provided",
  "staffBullets": ["bullet about actual wines", "bullet about actual winery", "bullet about actual varieties"]
}`,

  'owner-analysis': `You are a data analyst helping small winery owners make better business decisions. Analyze their sales data and provide actionable insights. Be direct and practical - these are cost-conscious operators.

Respond with valid JSON containing:
{
  "topWines": [{"name": "wine name", "revenue": "$X,XXX", "insight": "brief note"}],
  "bottomWines": [{"name": "wine name", "revenue": "$X,XXX", "insight": "brief note"}],
  "whatThisMeans": ["insight 1", "insight 2", "insight 3"],
  "decisionsThisWeek": [{"action": "action", "category": "inventory|pricing|promo"}]
}`,

  'vineyard-planning': `You are a vineyard planning assistant. You help vineyard managers organize their work but DO NOT provide chemical prescriptions or diagnoses. Always remind them to validate with their viticulture expert.

Respond with valid JSON containing:
{
  "weeklyChecklist": [{"day": "Monday", "tasks": ["task 1", "task 2"]}],
  "decisionTree": [{"condition": "If rain expected", "action": "then do X"}],
  "questionsForExpert": ["question 1", "question 2", "question 3"],
  "disclaimer": "Planning support only. Validate with your viticulture expert and local requirements."
}`,

  'tasting-room-scripts': `You are a hospitality coach helping tasting room managers create warm, brand-consistent scripts. Scripts should be natural, not pushy, and under 45 seconds when spoken.

Respond with valid JSON containing:
{
  "scripts": {
    "firstTime": "Script for first-time visitors",
    "browsing": "Script for just-browsing guests",
    "clubCandidate": "Script for potential club members"
  },
  "cheatSheet": ["tip 1", "tip 2", "tip 3", "tip 4", "tip 5"],
  "objectionResponses": [{"objection": "objection", "response": "response"}]
}`,

  'event-marketing': `You are a marketing copywriter for small wineries. Create engaging but not gimmicky content for winery events. Keep it authentic to Georgia wine country.

CRITICAL RULES:
- If a winery name is provided, use that EXACT name in all content
- If a location is provided, reference it naturally where appropriate
- DO NOT make up or invent winery names - use the actual name provided
- If no winery name provided, use generic phrasing like "the vineyard" or "our winery"

Respond with valid JSON containing:
{
  "instagramShort": "Short Instagram caption (under 150 chars) - use actual winery name if provided",
  "instagramLong": "Longer Instagram caption with hashtags - use actual winery name if provided",
  "emailInvite": "Email invitation formatted as a proper email with: SUBJECT LINE on first line, then blank line, then greeting (Dear Wine Lovers, etc), then 2-3 short paragraphs with blank lines between them, then a call to action, then sign-off. Use \\n\\n for paragraph breaks. Total 150-200 words.",
  "staffScript": "15-second verbal invitation script - use actual winery name if provided"
}`,

  'numbers-to-action': `You are a business analyst helping winery owners turn messy data into one clear action. Be direct and practical.

Respond with valid JSON containing:
{
  "bestChart": "Type of chart to visualize this data",
  "mainInsight": "One sentence summary",
  "actionThisWeek": "Specific action to take",
  "riskToWatch": "One risk to monitor"
}`,

  'staff-training': `You are a hospitality trainer creating quick reference materials for winery staff. Keep it practical and memorable.

Respond with valid JSON containing:
{
  "topicOverview": "Brief overview",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "practiceScenario": "Role-play scenario",
  "quickReference": "One-liner to remember"
}`,

  'labor-schedule': `You are an operations assistant helping wineries optimize staff scheduling. Consider tasting room traffic patterns and event needs.

Respond with valid JSON containing:
{
  "recommendedSchedule": [{"day": "Saturday", "staff": 3, "notes": "Peak day"}],
  "peakTimes": ["time period 1", "time period 2"],
  "considerations": ["consideration 1", "consideration 2"]
}`,

  'wine-club-campaign': `You are a membership marketing specialist. Create wine club campaign content that emphasizes value and community, not pressure.

Respond with valid JSON containing:
{
  "emailSubject": "Subject line",
  "emailBody": "Email body (200 words)",
  "benefits": ["benefit 1", "benefit 2", "benefit 3"],
  "cta": "Call to action"
}`,

  'customer-sop': `You are an operations consultant creating simple, clear standard operating procedures for winery customer service.

Respond with valid JSON containing:
{
  "title": "SOP title",
  "purpose": "Why this matters",
  "steps": [{"step": 1, "action": "action", "note": "optional note"}],
  "commonMistakes": ["mistake to avoid"]
}`,

  'job-description': `You are an HR consultant creating job descriptions for small wineries. Keep it authentic and appealing to the right candidates.

Respond with valid JSON containing:
{
  "title": "Job title",
  "summary": "Role summary (2-3 sentences)",
  "responsibilities": ["responsibility 1", "responsibility 2"],
  "qualifications": ["qualification 1", "qualification 2"],
  "benefits": ["benefit 1", "benefit 2"]
}`,

  'cogs-model': `You are a financial analyst helping wineries understand their cost structure. Keep explanations simple for non-financial operators.

Respond with valid JSON containing:
{
  "summary": "High-level summary",
  "costBreakdown": [{"category": "category", "percentage": "X%", "note": "note"}],
  "marginAnalysis": "Margin insight",
  "recommendations": ["recommendation 1", "recommendation 2"]
}`,

  'compliance-checklist': `You are a compliance assistant helping wineries organize their regulatory questions. You provide QUESTIONS AND CHECKLISTS ONLY, not legal advice.

Respond with valid JSON containing:
{
  "checklist": [{"item": "item to check", "status": "to verify"}],
  "questionsForAttorney": ["question 1", "question 2"],
  "resourceLinks": ["TTB.gov", "Georgia Department of Revenue"],
  "disclaimer": "Not legal advice. Consult with your attorney and compliance expert."
}`,

  'vine-triage': `You are a vineyard observation assistant. You help identify POSSIBLE issues and WHAT TO CHECK NEXT, but you DO NOT diagnose or prescribe treatments.

Respond with valid JSON containing:
{
  "possibleIssues": ["possible issue 1", "possible issue 2"],
  "whatToCheckNext": ["check this", "look for that"],
  "whoToContact": ["Local extension office", "Viticulture consultant"],
  "disclaimer": "This is not a diagnosis. Validate with your viticulture expert and local extension office."
}`,

  'winery-faq': `You are a marketing expert creating FAQs for winery websites and staff training.

CRITICAL: You will be given context about this specific winery including their name, wines, tasting notes, events, and other details. USE THIS CONTEXT to create personalized, specific FAQs - not generic ones.

Create FAQs that:
- Reference the ACTUAL winery name, wines, and details from the context
- Answer questions visitors would actually ask about THIS specific winery
- Include specific details from their tasting notes, events, and offerings
- Feel authentic and personal to this winery

Respond with valid JSON containing:
{
  "faqs": [
    {"question": "Specific question about this winery", "answer": "Detailed answer using actual winery info"},
    {"question": "Question about their wines", "answer": "Answer referencing their actual wines and tasting notes"},
    {"question": "Question about visiting", "answer": "Answer with specific details about this location"},
    {"question": "Question about events/offerings", "answer": "Answer referencing their actual events"},
    {"question": "Question about their story", "answer": "Answer based on context provided"}
  ],
  "staffTips": ["Tip for staff using actual winery details", "Another contextual tip"]
}`,

  'social-calendar': `You are a social media strategist creating a content calendar for wineries.

CRITICAL: Use the context provided about this specific winery to create personalized content ideas that reference their actual wines, events, location, and brand voice.

Respond with valid JSON containing:
{
  "weeklyPlan": [
    {"day": "Monday", "postType": "type", "topic": "specific topic using winery context", "caption": "Draft caption"},
    {"day": "Wednesday", "postType": "type", "topic": "topic", "caption": "Draft caption"},
    {"day": "Friday", "postType": "type", "topic": "topic", "caption": "Draft caption"},
    {"day": "Saturday", "postType": "type", "topic": "topic", "caption": "Draft caption"}
  ],
  "hashtagSets": {
    "local": ["#hashtag1", "#hashtag2"],
    "wine": ["#hashtag3", "#hashtag4"],
    "lifestyle": ["#hashtag5", "#hashtag6"]
  },
  "contentTips": ["tip 1", "tip 2"]
}`,

  'thank-you-email': `You are a hospitality expert creating personalized thank-you emails for winery visitors.

CRITICAL: Use the context provided to reference the actual winery name, wines they may have tasted, and specific details that make this feel personal - not generic.

Respond with valid JSON containing:
{
  "subject": "Subject line mentioning winery name",
  "body": "Full email body (200 words) with specific references to their wines and experience",
  "clubMemberVersion": "Alternative version for wine club members with exclusive tone",
  "followUpTiming": "When to send this"
}`
};

function getUserPrompt(type: string, inputs: Record<string, unknown>): string {
  switch (type) {
    case 'tasting-notes':
      return `Create tasting notes using ONLY this information (do not invent details):

WINERY AND WINE DETAILS:
${inputs.wineInfo || 'Georgia red wine blend'}

Tone: ${inputs.tone || 'Classic'}
Target audience: ${inputs.audience || 'Traditional wine drinkers'}

Remember: Use the EXACT winery name and wine names provided above. Do not make up wines or details.`;
    
    case 'owner-analysis':
      return `Analyze this sales data and provide insights:
${inputs.data || 'Sample data: Chardonnay $12,500, Merlot $8,200, Rosé $15,800, Cab Franc $6,100, Muscadine $22,000'}
Focus area: ${inputs.focus || 'General overview'}`;
    
    case 'vineyard-planning':
      return `Create a 7-day planning checklist:
Season stage: ${inputs.season || 'Veraison'}
Risk factors: ${inputs.risks || 'Normal conditions'}
7-day forecast: ${inputs.forecast || 'Mixed sun and clouds, chance of rain Thursday'}`;
    
    case 'tasting-room-scripts':
      return `Create tasting room scripts:
Vibe: ${inputs.vibe || 'Casual'}
Featured wines: ${inputs.featuredWines || 'Chardonnay, Merlot, Muscadine'}
Club offer: ${inputs.clubOffer || 'Quarterly shipments with 20% discount'}`;
    
    case 'event-marketing':
      return `Create marketing content for this event:
Winery name: ${inputs.wineryName || 'Not specified - use generic phrasing'}
Winery location: ${inputs.wineryLocation || 'Georgia'}
Event type: ${inputs.eventType || 'Live music'}
Date: ${inputs.date || 'Saturday, March 15'}
Target audience: ${inputs.audience || 'Locals'}
Offer: ${inputs.offer || 'General admission'}`;
    
    case 'numbers-to-action':
      return `Analyze this data and recommend one action:
${inputs.data || 'Monthly sales: Jan $45K, Feb $38K, Mar $52K, Apr $61K'}
Focus: ${inputs.focus || 'General'}`;
    
    case 'staff-training':
      return `Create training material for: ${inputs.topic || 'Handling wine questions'}`;
    
    case 'labor-schedule':
      return `Create a staffing recommendation:
Expected visitors: ${inputs.visitors || '200-300 per weekend'}
Events this week: ${inputs.events || 'None'}
Current staff: ${inputs.staff || '4 part-time'}`;
    
    case 'wine-club-campaign':
      return `Create a wine club campaign:
Campaign goal: ${inputs.goal || 'New member acquisition'}
Current benefits: ${inputs.benefits || 'Quarterly shipments, 20% discount, exclusive events'}`;
    
    case 'customer-sop':
      return `Create an SOP for: ${inputs.scenario || 'Handling customer complaints'}`;
    
    case 'job-description':
      return `Create a job description:
Position: ${inputs.position || 'Tasting Room Associate'}
Hours: ${inputs.hours || 'Part-time weekends'}
Experience needed: ${inputs.experience || 'Entry level, wine knowledge a plus'}`;
    
    case 'cogs-model':
      return `Analyze costs and margins:
Wine type: ${inputs.wineType || 'Red blend'}
Bottle price: ${inputs.price || '$28'}
Known costs: ${inputs.costs || 'Grapes $8/bottle, bottling $3/bottle'}`;
    
    case 'compliance-checklist':
      return `Generate compliance questions for: ${inputs.area || 'TTB label approval'}`;
    
    case 'vine-triage':
      return `Help identify what to check for these observations:
Symptoms observed: ${inputs.symptoms || 'Yellowing leaves on some vines'}
Location: ${inputs.location || 'Lower section near creek'}
Season: ${inputs.season || 'Mid-summer'}`;

    case 'winery-faq':
      return `Create personalized FAQs for this winery using all the context provided.
Focus areas: ${inputs.focus || 'General visitor questions'}
Number of FAQs needed: ${inputs.count || '5'}`;

    case 'social-calendar':
      return `Create a weekly social media content calendar for this winery.
Goals: ${inputs.goals || 'Increase engagement and visits'}
Posting frequency: ${inputs.frequency || '4 times per week'}`;

    case 'thank-you-email':
      return `Create a thank-you email for visitors to this winery.
Visit type: ${inputs.visitType || 'Tasting room visit'}
Purchase made: ${inputs.purchase || 'Wine purchase'}`;

    default:
      return JSON.stringify(inputs);
  }
}

function buildPromptWithContext(basePrompt: string, context?: string): string {
  if (!context) return basePrompt;
  return `WINERY CONTEXT (use this information to personalize your response):
${context}

---

${basePrompt}`;
}

function extractJSON(text: string): Record<string, unknown> | null {
  const patterns = [
    /```json\s*([\s\S]*?)\s*```/,
    /```\s*([\s\S]*?)\s*```/,
    /(\{[\s\S]*\})/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const jsonStr = match[1] || match[0];
      try {
        const cleaned = jsonStr
          .replace(/,\s*}/g, '}')
          .replace(/,\s*]/g, ']')
          .replace(/[\u0000-\u001F]+/g, ' ');
        
        const parsed = JSON.parse(cleaned);
        if (typeof parsed === 'object' && parsed !== null) {
          return parsed;
        }
      } catch {
        continue;
      }
    }
  }
  return null;
}

function hasValidContent(obj: Record<string, unknown>): boolean {
  if (!obj || Object.keys(obj).length === 0) return false;
  
  return Object.values(obj).some(v => {
    if (v === null || v === undefined || v === '') return false;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'object') return Object.keys(v).length > 0;
    return true;
  });
}

const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    if (!ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY not configured');
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          error: 'API key not configured',
          fallback: true 
        }),
      };
    }

    const { type, inputs, context }: GenerateRequest = JSON.parse(event.body || '{}');

    const systemPrompt = systemPrompts[type];
    if (!systemPrompt) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: `Unknown generation type: ${type}` }),
      };
    }

    const basePrompt = getUserPrompt(type, inputs);
    const userPrompt = buildPromptWithContext(basePrompt, context);

    console.log(`Generating ${type} content...`);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: 'AI generation failed', fallback: true }),
      };
    }

    const data = await response.json();
    const content = data.content[0]?.text || '';

    if (!content || content.trim().length === 0) {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: 'Empty response', fallback: true }),
      };
    }

    const parsed = extractJSON(content);

    if (!parsed || !hasValidContent(parsed)) {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: 'Invalid response format', fallback: true }),
      };
    }

    console.log(`Successfully generated ${type} content`);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ success: true, result: parsed }),
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        error: 'Generation failed',
        fallback: true 
      }),
    };
  }
};

export { handler };
