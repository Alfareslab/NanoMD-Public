import { readFileSync, writeFileSync } from 'fs';
const content = readFileSync('tests/test-review-v2.4.md', 'utf8');
const b64 = Buffer.from(content, 'utf8').toString('base64');
const url = 'http://localhost:5173/#' + b64;
writeFileSync('url-test.txt', url, 'utf8');
console.log('DONE - URL saved to url-test.txt');
console.log('Length: ' + url.length + ' chars');
