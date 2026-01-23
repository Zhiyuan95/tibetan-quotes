# 🕉️ Tibetan Merit Stream API (藏文教言 API)

> **Wisdom for Developers.**  
> Empower your applications with timeless Tibetan Buddhist teachings. Standardized, fast, and free to use.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

[Live Demo](https://tibetan-quotes.vercel.app/) | [API Documentation](https://tibetan-quotes.vercel.app/#docs)

---

## 📖 For Product Managers: What is this?

**Tibetan Merit Stream API** is a specialized content service that bridges authentic Tibetan Buddhist wisdom with the modern digital ecosystem.

In an era of information overload, this API provides a stream of "Merit" (Wisdom/Teachings) that can be easily integrated into any website, app, or IoT device.

### Why choose this API?

- **🎯 Authentic Content**: rigorous selection of quotes from classical sutras and masters (e.g., Padmasambhava, Milarepa).
- **🌍 Universal Compatibility**: Support for both modern UTF-8 and legacy GBK encoding systems.
- **🚀 High Performance**: Built on edge-ready architecture ensuring <100ms response times.
- **🛠 Flexible Integration**: Supports REST, JSONP, and direct DOM injection for non-technical platforms.

---

## 💻 For Engineers: Technical Overview

This project is a high-performance **Serverless API** built with **Next.js 14** and **Supabase**.

### Architecture

- **Framework**: Next.js App Router (Server Components + API Routes).
- **Database**: Supabase (PostgreSQL) with Row Level Security (RLS).
- **Caching**: Next.js ISR (Incremental Static Regeneration) with `revalidate` strategy.
- **Encoding**: Native `iconv-lite` integration for gb2312/gbk legacy support.

### Key Features

1. **Advanced Filtering**: Support for multi-category selection (`?c=Wisdom&c=Karma`) and length constraints.
2. **Multi-Format Response**:
   - `json`: Standard REST response.
   - `text`: Plain text for simple usage.
   - `js`: Pre-packaged JavaScript for direct DOM manipulation.
   - `jsonp`: Cross-domain support for older systems.
3. **Smart Caching**: 2-second edge caching window to balance randomness and performance.
4. **Statistics Engine**: Real-time aggregation of quote distribution and system metrics.

---

## 🚀 Quick Start

### Base URL

```
https://tibetan-quotes.vercel.app/api/v1
```

### 1. Get a Random Quote (Sentence)

**Endpoint**: `GET /sentence`

**Parameters**:
| Param | Type | Desciption | Default |
|-------|------|------------|---------|
| `c` | string[] | Category filter (e.g. `?c=信心`) | All |
| `encode` | string | `json`, `text`, `js` | `json` |
| `charset` | string | `utf-8`, `gbk` | `utf-8` |
| `callback`| string | JSONP callback name | null |

**Example**:

```bash
# JSON
curl "https://tibetan-quotes.vercel.app/api/v1/sentence"

# Plain Text with GBK Encoding
curl "https://tibetan-quotes.vercel.app/api/v1/sentence?encode=text&charset=gbk"
```

### 2. Get System Statistics

**Endpoint**: `GET /stats`

```json
{
  "total": 631,
  "categories": {
    "Moments": 264,
    "信心": 49
  },
  "averageLength": 135,
  "lastUpdate": "2026-01-23T05:47:34.000Z"
}
```

---

## 🛠 Local Development Requirements

1. **Node.js**: 18.17+
2. **Supabase Account**: For database hosting.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Zhiyuan95/tibetan-quotes.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Setup environment variables (`.env.local`):

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key # Only for data migration
   ```

4. Run Database Migration:

   ```bash
   npm run migrate
   ```

5. Start Development Server:
   ```bash
   npm run dev
   ```

---

## 📝 License

This project is open-sourced under the MIT license. The quote content remains the intellectual property of their respective authors/sources.

---

Made with ❤️ for the Dharma.
