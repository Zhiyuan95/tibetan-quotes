const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const files = [
    'public/藏文教言.xlsx',
    'public/恩师朋友圈集锦 2019-2021.xlsx'
];

files.forEach(file => {
    try {
        const filePath = path.join(process.cwd(), file);
        if (fs.existsSync(filePath)) {
            console.log(`\n--- Inspecting ${file} ---`);
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            
            // Get first row (headers)
            const headers = [];
            const range = XLSX.utils.decode_range(sheet['!ref']);
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cell = sheet[XLSX.utils.encode_cell({c: C, r: 0})];
                if (cell && cell.v) headers.push(cell.v);
            }
            console.log('Headers:', headers);
            
            // Peek at first data row
            const firstRow = [];
            for (let C = range.s.c; C <= range.e.c; ++C) {
                 const cell = sheet[XLSX.utils.encode_cell({c: C, r: 1})];
                 if (cell && cell.v) firstRow.push( String(cell.v).substring(0, 50) + '...' );
            }
            console.log('Row 1 Snippet:', firstRow);
            
        } else {
            console.log(`File not found: ${file}`);
        }
    } catch (e) {
        console.error(`Error reading ${file}:`, e.message);
    }
});
