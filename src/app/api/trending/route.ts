import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Simulated trending searches (in a real app, this would fetch from an API)
const defaultTrending = [
  { query: 'AI Technology 2024', category: 'Tech', score: 98 },
  { query: 'World Cup 2026', category: 'Sports', score: 95 },
  { query: 'Crypto Market Update', category: 'Finance', score: 92 },
  { query: 'Space Exploration News', category: 'Science', score: 88 },
  { query: 'Electric Vehicles', category: 'Tech', score: 85 },
  { query: 'Climate Change Solutions', category: 'Environment', score: 82 },
  { query: 'New Movies 2024', category: 'Entertainment', score: 80 },
  { query: 'Health Tips', category: 'Health', score: 78 },
  { query: 'Gaming News', category: 'Gaming', score: 75 },
  { query: 'Travel Destinations', category: 'Travel', score: 72 },
];

export async function GET() {
  try {
    // Try to get from database first
    const dbTrending = await db.trendingSearch.findMany({
      orderBy: { score: 'desc' },
      take: 10,
    });

    if (dbTrending.length > 0) {
      return NextResponse.json({
        success: true,
        trending: dbTrending.map(t => ({
          query: t.query,
          category: t.category || 'General',
          score: t.score,
        })),
      });
    }

    // Return default trending if database is empty
    return NextResponse.json({
      success: true,
      trending: defaultTrending,
    });
  } catch (error) {
    console.error('Failed to fetch trending:', error);
    return NextResponse.json({
      success: true,
      trending: defaultTrending,
    });
  }
}
