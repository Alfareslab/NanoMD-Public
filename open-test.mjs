import { readFileSync } from 'fs';
import { exec } from 'child_process';

const content = readFileSync('tests/test-review-v2.4.md', 'utf8');
const b64 = Buffer.from(content, 'utf8').toString('base64');
const url = 'http://localhost:5173/#' + b64;

exec(`start "" "${url}"`, (err) => {
  if (err) console.error('Error:', err.message);
  else console.log('Browser opened!');
});
