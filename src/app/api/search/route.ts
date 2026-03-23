import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

interface SearchResult {
  id: number;
  title: string;
  url: string;
  snippet: string;
  domain: string;
  date: string | null;
  favicon: string;
  rank: number;
}

// In-memory cache with longer duration
const cache = new Map<string, { data: SearchResult[]; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const num = parseInt(searchParams.get('num') || '40'); // Default 40 results per page
    const type = searchParams.get('type') || 'web';

    if (!query) {
      return NextResponse.json({ error: 'Query required' }, { status: 400 });
    }

    const cacheKey = `${query}-${type}`;
    let allResults: SearchResult[] = [];

    // Check cache
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      allResults = cached.data;
    } else {
      const zai = await ZAI.create();

      // Build search query based on type
      let searchQuery = query;
      if (type === 'news') searchQuery = `${query} latest news today`;
      else if (type === 'images') searchQuery = `${query} images photos pictures`;
      else if (type === 'videos') searchQuery = `${query} videos watch online`;

      // Fetch more results for better pagination (up to 200)
      const results = await zai.functions.invoke('web_search', {
        query: searchQuery,
        num: 100, // Fetch 100 results for better pagination
      });

      allResults = results.map((item: Record<string, unknown>, index: number) => {
        const url = item.url as string;
        let domain = 'unknown';
        try {
          domain = new URL(url).hostname.replace('www.', '');
        } catch {
          domain = (item.host_name as string) || 'unknown';
        }

        return {
          id: index + 1,
          title: (item.name as string) || 'Untitled',
          url,
          snippet: (item.snippet as string) || 'No description available.',
          domain,
          date: (item.date as string) || null,
          favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
          rank: (item.rank as number) || index + 1,
        };
      });

      cache.set(cacheKey, { data: allResults, timestamp: Date.now() });
    }

    // Pagination
    const resultsPerPage = Math.min(num, 50); // Max 50 per page
    const totalPages = Math.max(1, Math.ceil(allResults.length / resultsPerPage));
    const startIndex = (page - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    const paginatedResults = allResults.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      query,
      page,
      totalPages,
      totalResults: allResults.length,
      resultsPerPage,
      hasMore: endIndex < allResults.length,
      hasPrev: page > 1,
      results: paginatedResults,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({
      success: false,
      error: 'Search failed. Please try again.',
      results: [],
      page: 1,
      totalPages: 0,
      totalResults: 0,
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body || !body.action) {
      return NextResponse.json({ error: 'Action required' }, { status: 400 });
    }
    
    if (body.action === 'trending') {
      return NextResponse.json({
        success: true,
        trending: [
          { query: 'Latest technology news', category: 'Tech' },
          { query: 'World news today', category: 'News' },
          { query: 'Cryptocurrency market', category: 'Finance' },
          { query: 'Sports highlights', category: 'Sports' },
          { query: 'Entertainment updates', category: 'Entertainment' },
          { query: 'Gaming news', category: 'Gaming' },
          { query: 'Health and wellness', category: 'Health' },
          { query: 'Travel destinations', category: 'Travel' },
          { query: 'Food recipes', category: 'Food' },
          { query: 'Science discoveries', category: 'Science' },
        ],
      });
    }

    if (body.action === 'suggestions') {
      const query = (body.query || '').trim();
      if (query.length < 2) {
        return NextResponse.json({ success: true, suggestions: [] });
      }
      
      const suggestions = [
        query,
        `${query} latest`,
        `${query} news`,
        `${query} tutorial`,
        `${query} guide`,
        `${query} review`,
        `${query} 2024`,
        `how to ${query}`,
        `what is ${query}`,
        `best ${query}`,
      ].filter(s => s.length > 2 && !s.includes('  '));
      
      return NextResponse.json({ success: true, suggestions: suggestions.slice(0, 8) });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ success: false, error: 'Request failed' }, { status: 500 });
  }
}
