// API client for Netlify functions - no backend database needed
// All data is stored in localStorage

import { saveToLocalToolkit, getLocalSavedItems, getWineryContext, type SavedItem, type WineryContext } from './taskStore';

// Re-export for backward compatibility
export { getWineryContext };

// Get base URL for API calls - works in dev and production
function getApiBaseUrl(): string {
  // In development, Vite proxies to Netlify dev server
  // In production, functions are at /.netlify/functions/
  return '/.netlify/functions';
}

export function getSessionId(): string {
  let sessionId = localStorage.getItem('gwp_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('gwp_session_id', sessionId);
  }
  return sessionId;
}

export function getAccumulatedContext(): string {
  const savedItems = getLocalSavedItems();
  const wineryContext = getWineryContext();

  const contextParts: string[] = [];

  if (wineryContext) {
    if (wineryContext.wineryName) contextParts.push(`Winery: ${wineryContext.wineryName}`);
    if (wineryContext.location) contextParts.push(`Location: ${wineryContext.location}`);
    if (wineryContext.description) contextParts.push(`Description: ${wineryContext.description}`);
    if (wineryContext.wines?.length) contextParts.push(`Wines: ${wineryContext.wines.join(', ')}`);
    if (wineryContext.grapeVarieties?.length) contextParts.push(`Grape Varieties: ${wineryContext.grapeVarieties.join(', ')}`);
    if (wineryContext.wineStyles?.length) contextParts.push(`Wine Styles: ${wineryContext.wineStyles.join(', ')}`);
    if (wineryContext.yearFounded) contextParts.push(`Founded: ${wineryContext.yearFounded}`);
  }

  if (savedItems.length > 0) {
    contextParts.push('\n--- Previously Generated Content ---');
    savedItems.forEach(item => {
      contextParts.push(`\n[${item.category}] ${item.title}:`);
      const content = item.content;
      if (content.websiteNote) contextParts.push(`  Tasting Note: ${content.websiteNote}`);
      if (content.menuNote) contextParts.push(`  Menu Note: ${content.menuNote}`);
      if (content.staffBullets) contextParts.push(`  Staff Points: ${(content.staffBullets as string[]).join('; ')}`);
      if (content.instagramShort) contextParts.push(`  Instagram: ${content.instagramShort}`);
      if (content.eventName) contextParts.push(`  Event: ${content.eventName}`);
      if (content.mainInsight) contextParts.push(`  Insight: ${content.mainInsight}`);
      if (content.actionThisWeek) contextParts.push(`  Action: ${content.actionThisWeek}`);
      if (content.summary) contextParts.push(`  Summary: ${content.summary}`);
    });
  }

  return contextParts.join('\n');
}

export async function generateWithClaude(
  type: string,
  inputs: Record<string, unknown>,
  includeContext: boolean = true
): Promise<{ success: boolean; result?: unknown; error?: string; fallback?: boolean }> {
  try {
    const payload: Record<string, unknown> = { type, inputs };

    if (includeContext) {
      const context = getAccumulatedContext();
      if (context) {
        payload.context = context;
      }
    }

    const response = await fetch(`${getApiBaseUrl()}/claude-generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Generation error:', error);
    return { success: false, error: 'Connection failed', fallback: true };
  }
}

export async function scrapeWebsite(
  url: string,
  extractType: 'wine-info' | 'winery-info' = 'wine-info'
): Promise<{ success: boolean; result?: Record<string, unknown>; error?: string; fallback?: boolean }> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/scrape-website`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, extractType }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Scrape error:', error);
    return { success: false, error: 'Connection failed', fallback: true };
  }
}

// Poll responses - stored in localStorage
const POLL_STORAGE_KEY = 'gwp_poll_responses';

interface PollResponse {
  id: string;
  sessionId: string;
  exercise: string;
  response: string;
  createdAt: string;
}

export async function saveToPoll(exercise: string, response: string): Promise<void> {
  const sessionId = getSessionId();
  const existing = JSON.parse(localStorage.getItem(POLL_STORAGE_KEY) || '[]') as PollResponse[];
  
  existing.push({
    id: crypto.randomUUID(),
    sessionId,
    exercise,
    response,
    createdAt: new Date().toISOString(),
  });
  
  localStorage.setItem(POLL_STORAGE_KEY, JSON.stringify(existing));
}

export function getPollResponses(): PollResponse[] {
  return JSON.parse(localStorage.getItem(POLL_STORAGE_KEY) || '[]');
}

// Toolkit functions - delegate to taskStore
export function saveToToolkit(
  category: string,
  title: string,
  content: Record<string, unknown>,
  exerciseType: string
): void {
  saveToLocalToolkit(category, title, content, exerciseType);
}

export function getSavedItems(): SavedItem[] {
  return getLocalSavedItems();
}

// Beta signups - stored in localStorage
const BETA_STORAGE_KEY = 'gwp_beta_signups';

interface BetaSignup {
  id: string;
  name?: string;
  email?: string;
  winery?: string;
  primary_interest: string;
  operation_size?: string;
  would_try_pilot: string;
  createdAt: string;
}

export async function submitBetaSignup(data: {
  name?: string;
  email?: string;
  winery?: string;
  primary_interest: string;
  operation_size?: string;
  would_try_pilot: string;
}): Promise<boolean> {
  try {
    const existing = JSON.parse(localStorage.getItem(BETA_STORAGE_KEY) || '[]') as BetaSignup[];
    
    existing.push({
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
    });
    
    localStorage.setItem(BETA_STORAGE_KEY, JSON.stringify(existing));
    return true;
  } catch {
    return false;
  }
}

export function getBetaSignups(): BetaSignup[] {
  return JSON.parse(localStorage.getItem(BETA_STORAGE_KEY) || '[]');
}
