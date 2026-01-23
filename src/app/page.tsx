"use client";

import { useState, useEffect } from "react";
import { Hitokoto } from "@/types";

interface Stats {
  total: number;
  categories: Record<string, number>;
  averageLength: number;
  lastUpdate: string;
}

export default function Home() {
  const [data, setData] = useState<Hitokoto | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [format, setFormat] = useState("json");
  const [loading, setLoading] = useState(true);

  // Fetch stats
  useEffect(() => {
    fetch("/api/v1/stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  // Example fetcher for the demo console
  const fetchDemo = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/v1/sentence?encode=${format === "text" ? "text" : "json"}`,
      );
      if (format === "text") {
        const text = await res.text();
        setData({
          hitokoto: text,
          from_who: "API",
          type: "text",
          from: "API",
          id: 0,
        }); // Mock for display
      } else {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemo();
  }, [format]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-purple-100">
      {/* Navbar */}
      <nav className="border-b border-neutral-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
            Tibetan Merit Stream API
          </div>
          <div className="flex gap-6 text-sm font-medium text-neutral-600">
            <a href="#docs" className="hover:text-purple-700 transition-colors">
              Documentation
            </a>
            <a
              href="#console"
              className="hover:text-purple-700 transition-colors"
            >
              Console
            </a>
            <a
              href="https://github.com/Zhiyuan95/tibetan-quotes"
              className="hover:text-purple-700 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="text-center mb-24">
          <h1 className="text-5xl md:text-6xl font-extrabold text-neutral-900 tracking-tight mb-6">
            Wisdom for <span className="text-purple-700">Developers</span>.
          </h1>
          <p className="text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            Empower your applications with timeless Tibetan Buddhist teachings.
            Standardized, fast, and free to use.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <a
              href="#docs"
              className="px-8 py-3 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl"
            >
              Get Started
            </a>
            <span className="px-8 py-3 bg-white border border-neutral-300 text-neutral-600 rounded-lg font-mono text-sm flex items-center">
              GET /api/v1/sentence
            </span>
          </div>
        </section>

        {/* Console Demo */}
        <section id="console" className="mb-24 scroll-mt-24">
          <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
            <div className="bg-neutral-50 border-b border-neutral-100 px-6 py-4 flex items-center justify-between">
              <h3 className="font-semibold text-neutral-700">
                API Test Console
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setFormat("json");
                  }}
                  className={`text-xs font-bold px-3 py-1 rounded-md transition-colors ${format === "json" ? "bg-purple-100 text-purple-700" : "text-neutral-500 hover:bg-neutral-100"}`}
                >
                  JSON
                </button>
                <button
                  onClick={() => {
                    setFormat("text");
                  }}
                  className={`text-xs font-bold px-3 py-1 rounded-md transition-colors ${format === "text" ? "bg-purple-100 text-purple-700" : "text-neutral-500 hover:bg-neutral-100"}`}
                >
                  TEXT
                </button>
              </div>
            </div>

            <div className="p-8 bg-neutral-900 text-green-400 font-mono text-sm leading-relaxed min-h-[200px] flex flex-col justify-center">
              {loading ? (
                <span className="animate-pulse">Loading stream...</span>
              ) : format === "text" ? (
                <p className="text-white">{data?.hitokoto}</p>
              ) : (
                <pre>{JSON.stringify(data, null, 2)}</pre>
              )}
            </div>

            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 text-right">
              <button
                onClick={fetchDemo}
                className="text-sm font-semibold text-purple-600 hover:text-purple-800"
              >
                Refresh Request &rarr;
              </button>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        {stats && (
          <section className="mb-24">
            <h2 className="text-2xl font-bold mb-6">API Statistics</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl border border-neutral-200">
                <div className="text-3xl font-bold text-purple-700">
                  {stats.total}
                </div>
                <div className="text-sm text-neutral-500 mt-1">
                  Total Quotes
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-neutral-200">
                <div className="text-3xl font-bold text-purple-700">
                  {Object.keys(stats.categories).length}
                </div>
                <div className="text-sm text-neutral-500 mt-1">Categories</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-neutral-200">
                <div className="text-3xl font-bold text-purple-700">
                  {stats.averageLength}
                </div>
                <div className="text-sm text-neutral-500 mt-1">
                  Avg Length (chars)
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-neutral-200">
              <h3 className="font-semibold mb-4 text-neutral-700">
                Available Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.categories)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, count]) => (
                    <span
                      key={cat}
                      className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                    >
                      {cat} ({count})
                    </span>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* Usage Examples */}
        <section className="mb-24">
          <h2 className="text-2xl font-bold mb-6">Usage Examples</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <div className="bg-neutral-50 px-4 py-2 border-b border-neutral-200 font-semibold text-sm text-neutral-700">
                cURL
              </div>
              <pre className="p-4 text-sm overflow-x-auto">
                <code className="text-neutral-800">{`# Get random quote
curl "https://your-domain.com/api/v1/sentence"

# Get quote from specific categories
curl "https://your-domain.com/api/v1/sentence?c=信心&c=实修"

# Get as plain text
curl "https://your-domain.com/api/v1/sentence?encode=text"

# JSONP callback
curl "https://your-domain.com/api/v1/sentence?encode=json&callback=myCallback"`}</code>
              </pre>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <div className="bg-neutral-50 px-4 py-2 border-b border-neutral-200 font-semibold text-sm text-neutral-700">
                JavaScript
              </div>
              <pre className="p-4 text-sm overflow-x-auto">
                <code className="text-neutral-800">{`// Fetch random quote
fetch('https://your-domain.com/api/v1/sentence')
  .then(res => res.json())
  .then(data => console.log(data.hitokoto));

// With specific category
fetch('https://your-domain.com/api/v1/sentence?c=Moments')
  .then(res => res.json())
  .then(data => console.log(data));`}</code>
              </pre>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <div className="bg-neutral-50 px-4 py-2 border-b border-neutral-200 font-semibold text-sm text-neutral-700">
                Python
              </div>
              <pre className="p-4 text-sm overflow-x-auto">
                <code className="text-neutral-800">{`import requests

# Get random quote
response = requests.get('https://your-domain.com/api/v1/sentence')
quote = response.json()
print(quote['hitokoto'])

# Get statistics
stats = requests.get('https://your-domain.com/api/v1/stats').json()
print(f"Total quotes: {stats['total']}")`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Documentation API Reference */}
        <section id="docs" className="prose prose-neutral max-w-none">
          <h2 className="text-3xl font-bold mb-8 border-b pb-4">
            API Reference
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-4">Request</h3>
              <div className="bg-white p-4 rounded-lg border border-neutral-200 font-mono text-sm mb-4">
                GET https://your-domain.com/api/v1/sentence
              </div>

              <h4 className="font-bold mt-6 mb-2 text-sm uppercase text-neutral-400">
                Query Parameters
              </h4>
              <table className="w-full text-sm text-left">
                <thead className="border-b">
                  <tr>
                    <th className="py-2">Param</th>
                    <th className="py-2">Type</th>
                    <th className="py-2">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-neutral-100">
                    <td className="py-3 font-mono text-purple-600">c</td>
                    <td>string[]</td>
                    <td className="text-neutral-500">
                      Categories (multi-select: ?c=信心&c=实修)
                    </td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="py-3 font-mono text-purple-600">encode</td>
                    <td>string</td>
                    <td className="text-neutral-500">
                      Format: json (default), text, js
                    </td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="py-3 font-mono text-purple-600">callback</td>
                    <td>string</td>
                    <td className="text-neutral-500">
                      JSONP callback function name
                    </td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="py-3 font-mono text-purple-600">
                      min_length
                    </td>
                    <td>int</td>
                    <td className="text-neutral-500">
                      Minimum characters (default: 0)
                    </td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="py-3 font-mono text-purple-600">
                      max_length
                    </td>
                    <td>int</td>
                    <td className="text-neutral-500">
                      Maximum characters (default: 1000)
                    </td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="py-3 font-mono text-purple-600">select</td>
                    <td>string</td>
                    <td className="text-neutral-500">
                      CSS selector (for encode=js)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 font-mono text-purple-600">charset</td>
                    <td>string</td>
                    <td className="text-neutral-500">
                      Encoding: utf-8 (default), gbk 🚧
                    </td>
                  </tr>
                </tbody>
              </table>

              <h4 className="font-bold mt-6 mb-2 text-sm uppercase text-neutral-400">
                Error Codes
              </h4>
              <div className="text-sm space-y-2">
                <div className="flex gap-2">
                  <span className="font-mono text-red-600">404</span>
                  <span className="text-neutral-500">
                    No quotes found matching criteria
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="font-mono text-red-600">500</span>
                  <span className="text-neutral-500">
                    Database query failed or internal error
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Response</h3>
              <p className="text-neutral-500 text-sm mb-4">
                Standard Hitokoto Format
              </p>
              <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg text-xs overflow-x-auto">
                {`{
  "id": 1024,
  "uuid": "7a3...", 
  "hitokoto": "万法皆空，因果不空。",
  "type": "Wisdom",
  "from": "法句经",
  "from_who": "释迦牟尼佛",
  "creator": "System",
  "created_at": "167382..."
}`}
              </pre>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-neutral-200 py-12 text-center text-neutral-400 text-sm">
        <p>© 2024 Tibetan Merit Stream API. Inspired by Hitokoto.</p>
      </footer>
    </div>
  );
}
