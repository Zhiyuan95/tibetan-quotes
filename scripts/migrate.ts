import { createClient } from "@supabase/supabase-js";
import quotes from "../src/data/quotes.json";
import * as dotenv from "dotenv";
import * as path from "path";

// 加载环境变量
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// 迁移需要使用 SERVICE_ROLE_KEY 来绕过 RLS 策略
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials in .env.local");
  console.error(
    "Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY",
  );
  console.error("\n💡 提示: 迁移需要 SERVICE_ROLE_KEY (不是 PUBLISHABLE_KEY)");
  console.error(
    "   在 Supabase Dashboard → Settings → API 找到 service_role key",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log("🚀 开始迁移数据到 Supabase...");
  console.log(`📊 总共 ${quotes.length} 条数据\n`);

  const BATCH_SIZE = 100;
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < quotes.length; i += BATCH_SIZE) {
    const batch = quotes.slice(i, i + BATCH_SIZE);

    // 准备数据
    const data = batch.map((quote: any) => ({
      id: quote.id,
      hitokoto: quote.hitokoto,
      type: quote.type,
      from: quote.from || "",
      from_who: quote.from_who || "",
      creator: quote.creator || "system",
      created_at: quote.created_at
        ? new Date(parseInt(quote.created_at)).toISOString()
        : new Date().toISOString(),
    }));

    // 批量插入
    const { data: inserted, error } = await supabase
      .from("quotes")
      .upsert(data, { onConflict: "id" });

    if (error) {
      console.error(
        `❌ 批次 ${Math.floor(i / BATCH_SIZE) + 1} 失败:`,
        error.message,
      );
      errorCount += batch.length;
    } else {
      successCount += batch.length;
      console.log(
        `✅ 批次 ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} 条数据`,
      );
    }
  }

  console.log("\n📈 迁移完成统计:");
  console.log(`  ✅ 成功: ${successCount}`);
  console.log(`  ❌ 失败: ${errorCount}`);

  // 验证数据
  const { count } = await supabase
    .from("quotes")
    .select("*", { count: "exact", head: true });

  console.log(`  📊 数据库总数: ${count}`);

  if (count === quotes.length) {
    console.log("\n✨ 迁移成功！所有数据已导入。");
  } else {
    console.log(
      `\n⚠️  警告: 数据库数量 (${count}) 与源文件 (${quotes.length}) 不匹配`,
    );
  }
}

migrate().catch((error) => {
  console.error("❌ 迁移失败:", error);
  process.exit(1);
});
