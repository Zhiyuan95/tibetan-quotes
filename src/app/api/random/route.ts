import { NextResponse } from 'next/server';
import quotes from '@/data/quotes.json';
import { Quote } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const author = searchParams.get('author');

  let filteredQuotes = quotes as Quote[];

  if (category) {
    filteredQuotes = filteredQuotes.filter(q => q.category === category);
  }
  if (author) {
    filteredQuotes = filteredQuotes.filter(q => q.author === author);
  }

  if (filteredQuotes.length === 0) {
    return NextResponse.json({ error: 'No quotes found' }, { status: 404 });
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];

  return NextResponse.json(randomQuote);
}
