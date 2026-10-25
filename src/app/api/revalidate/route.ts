import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

/** Sanity webhook → POST /api/revalidate?secret=… refreshes the homepage content. */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret || req.nextUrl.searchParams.get('secret') !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  revalidateTag('home');
  return NextResponse.json({ ok: true, revalidated: 'home' });
}
