const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '..', 'AppData', 'Roaming');
// The content file path (from earlier run_playwright_code result)
const contentPath = 'c:/Users/thang/AppData/Roaming/Code/User/workspaceStorage/32c137720dedeb14ecb6ba99f4963ae8/GitHub.copilot-chat/chat-session-resources/a133bca8-2cd3-47e8-9e22-18faaf907fdd/call_qdGPa6tOW98Y6EpYgM0HFaWl__vscode-1779975925791/content.txt';

if (!fs.existsSync(contentPath)) {
  console.error('Content file not found:', contentPath);
  process.exit(2);
}

const s = fs.readFileSync(contentPath, 'utf8');
const i = s.indexOf('{');
let depth = 0;
let end = -1;
for (let j = i; j < s.length; j++) {
  if (s[j] === '{') depth++;
  else if (s[j] === '}') {
    depth--;
    if (depth === 0) {
      end = j;
      break;
    }
  }
}
if (i < 0 || end < 0) {
  console.error('JSON bounds not found');
  process.exit(2);
}
const json = JSON.parse(s.slice(i, end + 1));
const outPath = path.join(process.cwd(), 'resume_with_avatar.pdf');
fs.writeFileSync(outPath, Buffer.from(json.base64, 'base64'));
console.log('Wrote', outPath, 'bytes=', json.length);
