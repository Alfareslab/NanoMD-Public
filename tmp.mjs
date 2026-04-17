import fs from 'fs';
const content = fs.readFileSync('tests/test-new-features.md', 'utf8');
const base64 = Buffer.from(content).toString('base64');
console.log('http://localhost:5173/#' + base64);
