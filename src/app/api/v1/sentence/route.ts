import { NextResponse } from 'next/server';
import quotes from '@/data/quotes.json';
import { Hitokoto } from '@/types';

export const dynamic = 'force-dynamic'; // Ensure no caching for random

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('c'); // 'c' for category/type
  const type = searchParams.get('type');   // Alias
  const encode = searchParams.get('encode') || 'json';
  const minLength = parseInt(searchParams.get('min_length') || '0');
  const maxLength = parseInt(searchParams.get('max_length') || '1000');

  // Filter Logic
  let filtered = quotes as Hitokoto[];
  const targetCategory = category || type;

  if (targetCategory) {
    filtered = filtered.filter(q => q.type === targetCategory);
  }

  // Length Filter
  filtered = filtered.filter(q => 
    q.hitokoto.length >= minLength && q.hitokoto.length <= maxLength
  );

  // Fallback if empty
  if (filtered.length === 0) {
    return new NextResponse('No quotes found matching criteria', { status: 404 });
  }

  // Random Pick
  const randomMeta = filtered[Math.floor(Math.random() * filtered.length)];

  // Enhance with standard fields if missing
  const responseData = {
    ...randomMeta,
    uuid: randomMeta.uuid || crypto.randomUUID(),
    created_at: randomMeta.created_at || Date.now().toString(),
    creator: randomMeta.creator || 'system',
  };

  // Response Format
  if (encode === 'text') {
    return new NextResponse(responseData.hitokoto, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }

  if (encode === 'js') {
    const selector = searchParams.get('select') || '.hitokoto';
    const jsContent = `(function(){var hitokoto="${responseData.hitokoto}";var dom=document.querySelector('${selector}');if(dom){dom.innerText=hitokoto;}})();`;
    return new NextResponse(jsContent, {
      headers: { 'Content-Type': 'text/javascript; charset=utf-8' }
    });
  }

  // JSON Default
  return NextResponse.json(responseData);
}
