import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

interface ScrapeRequest {
  url: string;
  extractType: 'wine-info' | 'winery-info';
}

interface WineryInfo {
  wineryName: string;
  wines: string[];
  tastingNotes: string;
  wineStyles: string[];
  grapeVarieties: string[];
  description: string;
  location: string;
  yearFounded: string;
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
    const { url }: ScrapeRequest = JSON.parse(event.body || '{}');

    if (!url) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: 'URL is required' }),
      };
    }

    if (!PERPLEXITY_API_KEY) {
      console.error('PERPLEXITY_API_KEY not configured');
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          error: 'Perplexity API key not configured',
          fallback: true,
          result: getEmptyResult()
        }),
      };
    }

    console.log(`Scraping winery info from: ${url}`);

    // Use Perplexity to intelligently extract winery information
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: `You are a winery information extractor. Given a winery website URL, extract key information about the winery. Always respond with valid JSON only, no other text.

Respond with this exact JSON structure:
{
  "wineryName": "The winery's full name",
  "location": "City, State or region",
  "yearFounded": "Year as string or empty string if unknown",
  "description": "Brief 1-2 sentence description of the winery",
  "wines": ["Wine name 1", "Wine name 2", "etc - list their actual wine products"],
  "grapeVarieties": ["variety 1", "variety 2", "etc - lowercase"],
  "wineStyles": ["dry", "sweet", "etc - lowercase"],
  "tastingNotes": "Any tasting descriptors mentioned like 'notes of cherry and oak'"
}`
          },
          {
            role: 'user',
            content: `Extract winery information from this website: ${url}

Find and return:
1. The winery's name
2. Their location (city, state/region)
3. Year founded if mentioned
4. A brief description
5. List of their wines/products
6. Grape varieties they use
7. Wine styles (dry, sweet, etc.)
8. Any tasting notes or flavor descriptions

Return ONLY valid JSON, no other text.`
          }
        ],
        max_tokens: 1000,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error:', response.status, errorText);
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          error: 'Failed to extract winery info',
          fallback: true,
          result: getEmptyResult()
        }),
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    if (!content) {
      console.error('Empty response from Perplexity');
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          error: 'Empty response',
          fallback: true,
          result: getEmptyResult()
        }),
      };
    }

    // Parse the JSON response
    let result: WineryInfo;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Perplexity response:', content.substring(0, 500));
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          error: 'Failed to parse response',
          fallback: true,
          result: getEmptyResult()
        }),
      };
    }

    // Ensure all fields exist with defaults
    const normalizedResult: WineryInfo = {
      wineryName: result.wineryName || extractWineryNameFromUrl(url),
      location: result.location || '',
      yearFounded: result.yearFounded || '',
      description: result.description || '',
      wines: Array.isArray(result.wines) ? result.wines.slice(0, 10) : [],
      grapeVarieties: Array.isArray(result.grapeVarieties) ? result.grapeVarieties.map(v => v.toLowerCase()).slice(0, 8) : [],
      wineStyles: Array.isArray(result.wineStyles) ? result.wineStyles.map(s => s.toLowerCase()).slice(0, 5) : [],
      tastingNotes: result.tastingNotes || '',
    };

    console.log(`Successfully extracted info for: ${normalizedResult.wineryName}`);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ success: true, result: normalizedResult }),
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
        error: 'Scraping failed',
        fallback: true,
        result: getEmptyResult()
      }),
    };
  }
};

function extractWineryNameFromUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    const name = hostname
      .replace(/^www\./, '')
      .replace(/\.(com|net|org|wine|winery|vineyard|co).*$/, '')
      .replace(/[-_]/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    return name + ' Winery';
  } catch {
    return 'Winery';
  }
}

function getEmptyResult(): WineryInfo {
  return {
    wineryName: '',
    wines: [],
    tastingNotes: '',
    wineStyles: [],
    grapeVarieties: [],
    description: '',
    location: '',
    yearFounded: '',
  };
}

export { handler };
