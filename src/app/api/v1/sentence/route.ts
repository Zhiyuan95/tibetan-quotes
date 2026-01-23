import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // 解析参数
  const categories = searchParams.getAll('c');
  const encode = searchParams.get('encode') || 'json';
  const minLength = parseInt(searchParams.get('min_length') || '0');
  const maxLength = parseInt(searchParams.get('max_length') || '1000');
  const callback = searchParams.get('callback');

  try {
    // 构建查询
    let query = supabase
      .from('quotes')
      .select('*');

    // 多分类筛选
    if (categories.length > 0) {
      query = query.in('type', categories);
    }

    const { data: allQuotes, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Database query failed', details: error.message },
        { status: 500 }
      );
    }

    if (!allQuotes || allQuotes.length === 0) {
      return NextResponse.json(
        { error: 'No quotes found matching criteria' },
        { status: 404 }
      );
    }

    // 长度过滤
    const filtered = allQuotes.filter(q => 
      q.hitokoto.length >= minLength && q.hitokoto.length <= maxLength
    );

    if (filtered.length === 0) {
      return NextResponse.json(
        { error: 'No quotes found in specified length range' },
        { status: 404 }
      );
    }

    // 随机选择
    const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];

    // 格式化响应
    const responseData = {
      id: randomQuote.id,
      uuid: randomQuote.uuid,
      hitokoto: randomQuote.hitokoto,
      type: randomQuote.type,
      from: randomQuote.from,
      from_who: randomQuote.from_who,
      creator: randomQuote.creator,
      created_at: randomQuote.created_at,
    };

    // 返回格式处理
    if (encode === 'text') {
      return new NextResponse(responseData.hitokoto, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }

    if (encode === 'js') {
      const selector = searchParams.get('select') || '.hitokoto';
      const jsContent = `(function(){var hitokoto="${responseData.hitokoto.replace(/"/g, '\\"')}";var dom=document.querySelector('${selector}');if(dom){dom.innerText=hitokoto;}})();`;
      return new NextResponse(jsContent, {
        headers: { 'Content-Type': 'text/javascript; charset=utf-8' }
      });
    }

    // JSONP 支持
    if (callback) {
      const jsonpContent = `${callback}(${JSON.stringify(responseData)})`;
      return new NextResponse(jsonpContent, {
        headers: { 'Content-Type': 'application/javascript; charset=utf-8' }
      });
    }

    // 默认 JSON
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
