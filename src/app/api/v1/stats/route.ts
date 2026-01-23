import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const revalidate = 300; // 缓存 5 分钟

export async function GET() {
  try {
    // 获取总数
    const { count: total } = await supabase
      .from('quotes')
      .select('*', { count: 'exact', head: true });

    // 获取分类统计
    const { data: categoriesData } = await supabase
      .from('quotes')
      .select('type');

    const categories: Record<string, number> = {};
    categoriesData?.forEach(item => {
      categories[item.type] = (categories[item.type] || 0) + 1;
    });

    // 计算平均长度
    const { data: allQuotes } = await supabase
      .from('quotes')
      .select('hitokoto');

    const averageLength = allQuotes
      ? Math.round(
          allQuotes.reduce((sum, q) => sum + q.hitokoto.length, 0) / allQuotes.length
        )
      : 0;

    // 获取最新更新时间
    const { data: latestQuote } = await supabase
      .from('quotes')
      .select('updated_at')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    return NextResponse.json({
      total,
      categories,
      averageLength,
      lastUpdate: latestQuote?.updated_at || new Date().toISOString(),
    });

  } catch (error) {
    console.error('Stats Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
