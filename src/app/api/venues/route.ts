import { NextRequest, NextResponse } from 'next/server';
import { VENUE_HALLS_DATABASE, TOP_INDIAN_CITIES } from '@/data/halls';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city');
    const eventType = searchParams.get('type')?.toLowerCase();
    const guests = parseInt(searchParams.get('guests') || '0', 10);

    let halls = VENUE_HALLS_DATABASE;

    if (city && city !== 'All') {
      halls = halls.filter((h) => h.city.toLowerCase() === city.toLowerCase());
    }

    if (eventType) {
      const typeKey = eventType.includes('wedding')
        ? 'wedding'
        : eventType.includes('birthday')
        ? 'birthday'
        : eventType.includes('community')
        ? 'community'
        : null;

      if (typeKey) {
        halls = halls.filter((h) => h.suitableFor.includes(typeKey));
      }
    }

    if (guests > 0) {
      halls = halls.filter((h) => h.capacity.max >= guests && h.capacity.min <= guests * 1.5);
    }

    return NextResponse.json({
      success: true,
      cities: TOP_INDIAN_CITIES,
      total: halls.length,
      venues: halls,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to search venues';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
