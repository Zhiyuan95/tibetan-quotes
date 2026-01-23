const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const TARGET_FILE = path.join(process.cwd(), 'src/data/quotes.json');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

// Load existing data
let quotes = [];
if (fs.existsSync(TARGET_FILE)) {
    quotes = JSON.parse(fs.readFileSync(TARGET_FILE, 'utf8'));
}

const existingTexts = new Set(quotes.map(q => q.hitokoto.trim()));
let nextId = quotes.length > 0 ? Math.max(...quotes.map(q => Number(q.id) || 0)) + 1 : 1;

function addQuote(text, type, from, fromWho) {
    if (!text) return;
    const cleanText = text.trim();
    if (cleanText.length < 5) return; // Ignore too short junk
    if (existingTexts.has(cleanText)) return;

    quotes.push({
        id: nextId++,
        hitokoto: cleanText,
        type: type || 'Wisdom',
        from: from || 'Unknown',
        from_who: fromWho || '上师',
        created_at: Date.now().toString()
    });
    existingTexts.add(cleanText);
}

// 1. Process 藏文教言.xlsx
try {
    const file1 = path.join(PUBLIC_DIR, '藏文教言.xlsx');
    if (fs.existsSync(file1)) {
        console.log(`Processing ${file1}...`);
        const wb = XLSX.readFile(file1);
        const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); // Uses headers automatically
        
        let count = 0;
        data.forEach(row => {
            const content = row['上师教言精选'];
            const category = row['分类'] || row['新分类'];
            if (content) {
                addQuote(content, category, '藏文教言', '上师');
                count++;
            }
        });
        console.log(`Added ${count} quotes from 藏文教言.`);
    }
} catch (e) {
    console.error('Error processing 藏文教言:', e);
}

// 2. Process 恩师朋友圈集锦
try {
    const file2 = path.join(PUBLIC_DIR, '恩师朋友圈集锦 2019-2021.xlsx');
    if (fs.existsSync(file2)) {
        console.log(`Processing ${file2}...`);
        const wb = XLSX.readFile(file2);
        // No headers, so read as array of arrays
        const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });
        
        let count = 0;
        data.forEach(row => {
            const content = row[0]; // Assume 1st column
            if (content && typeof content === 'string') {
                addQuote(content, 'Moments', '朋友圈集锦', '上师');
                count++;
            }
        });
        console.log(`Added ${count} quotes from 朋友圈.`);
    }
} catch (e) {
    console.error('Error processing 朋友圈:', e);
}

// Write back
fs.writeFileSync(TARGET_FILE, JSON.stringify(quotes, null, 2), 'utf8');
console.log(`Total quotes now: ${quotes.length}`);

// Cleanup - Delete Excel files
['藏文教言.xlsx', '恩师朋友圈集锦 2019-2021.xlsx'].forEach(f => {
    const p = path.join(PUBLIC_DIR, f);
    if(fs.existsSync(p)) fs.unlinkSync(p);
});
console.log("Cleanup complete.");
