import { NextResponse } from 'next/server';

export async function GET() {
  const url = new URL('/api/v1/sentence', 'http://localhost:3000'); // Base URL will be fixed by fetch
  return NextResponse.redirect(url);
}
