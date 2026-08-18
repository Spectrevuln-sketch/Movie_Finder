const fs = require('fs');
const code = fs.readFileSync('modules/Movie/resources/js/pages/movie/index.tsx', 'utf8');
const L = code.length;

let start = 0;
for (let n = 1; n < 51; n++) start = code.indexOf('\n', start) + 1;
let end = code.indexOf('\n', start);
const line = code.slice(start, end);
console.log("LINE 51 head:", JSON.stringify(line.slice(0, 50)));
console.log("LINE 51 tail:", JSON.stringify(line.slice(-25)));

let i = start;
let j = i + 1;
while (code[j] === ' ') j++;
let closing = false;
if (code[j] === '/') { closing = true; j++; while (code[j] === ' ') j++; }
let nameStart = j;
while (j < L && /[A-Za-z0-9._-]/.test(code[j])) j++;
let name = code.slice(nameStart, j);
console.log("tagname:", name);

let k = j;
let step = 0;
while (k < L && step < 5000) {
  const ch = code[k];
  if (ch === '"' || ch === "'" || ch === '`') {
    const q = ch; k++;
    let cnt = 0;
    while (k < L && code[k] !== q) {
      if (code[k] === '\\') { k += 2; }
      else { k++; }
      cnt++;
      if (cnt > 5000) { console.log("string scan too long"); break; }
    }
    k++;
    continue;
  }
  if (ch === '>') { console.log("FOUND > at k=" + k); break; }
  if (ch === '/' && code[k+1] === '>') { console.log("SELF-CLOSING /> at k=" + k); k += 2; break; }
  k++;
  step++;
}
console.log("char context:", JSON.stringify(code.slice(Math.max(0, k-10), k+10)));
