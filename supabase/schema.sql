-- Tibetan Quotes API - Supabase Database Schema
-- 创建 quotes 表
CREATE TABLE quotes (
  id SERIAL PRIMARY KEY,
  uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  hitokoto TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  "from" VARCHAR(255),
  from_who VARCHAR(255),
  creator VARCHAR(100) DEFAULT 'system',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以优化查询
CREATE INDEX idx_quotes_type ON quotes(type);
CREATE INDEX idx_quotes_uuid ON quotes(uuid);
CREATE INDEX idx_quotes_created_at ON quotes(created_at DESC);

-- 创建全文搜索索引 (可选)
-- 注意: Supabase 默认不支持中文分词,暂时使用 simple 配置
-- 如需中文全文搜索,可以后续安装 zhparser 扩展
CREATE INDEX idx_quotes_hitokoto_search ON quotes 
  USING gin(to_tsvector('simple', hitokoto));

-- 启用 Row Level Security (可选,如果要公开数据库)
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- 创建策略: 允许所有人读取
CREATE POLICY "Allow public read access" 
  ON quotes FOR SELECT 
  USING (true);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_quotes_updated_at 
  BEFORE UPDATE ON quotes 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
