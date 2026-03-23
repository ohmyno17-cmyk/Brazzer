import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Get or create default profile
    let profile = await db.browserProfile.findFirst();
    
    if (!profile) {
      profile = await db.browserProfile.create({
        data: {
          name: 'Freedom User',
        },
      });
      
      // Create default settings
      await db.browserSettings.create({
        data: {
          profileId: profile.id,
        },
      });
      
      // Create default shortcuts
      const defaultShortcuts = [
        { name: 'YouTube', url: 'https://youtube.com', color: '#ff0000', order: 0 },
        { name: 'Twitter/X', url: 'https://x.com', color: '#1da1f2', order: 1 },
        { name: 'GitHub', url: 'https://github.com', color: '#333333', order: 2 },
        { name: 'Reddit', url: 'https://reddit.com', color: '#ff4500', order: 3 },
        { name: 'Wikipedia', url: 'https://wikipedia.org', color: '#636363', order: 4 },
        { name: 'Stack Overflow', url: 'https://stackoverflow.com', color: '#f48024', order: 5 },
      ];
      
      for (const shortcut of defaultShortcuts) {
        await db.shortcut.create({
          data: {
            profileId: profile.id,
            ...shortcut,
          },
        });
      }
    }

    const settings = await db.browserSettings.findUnique({
      where: { profileId: profile.id },
    });

    const shortcuts = await db.shortcut.findMany({
      where: { profileId: profile.id },
      orderBy: { order: 'asc' },
    });

    const history = await db.browseHistory.findMany({
      where: { profileId: profile.id },
      orderBy: { visitedAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        name: profile.name,
        avatar: profile.avatar,
      },
      settings,
      shortcuts,
      history,
    });
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    
    const profile = await db.browserProfile.create({
      data: {
        name: name || 'Freedom User',
      },
    });
    
    await db.browserSettings.create({
      data: {
        profileId: profile.id,
      },
    });

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('Failed to create profile:', error);
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { profileId, name, avatar } = await request.json();
    
    const profile = await db.browserProfile.update({
      where: { id: profileId },
      data: { name, avatar },
    });

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('Failed to update profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
