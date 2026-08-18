const fs = require('fs');
const code = fs.readFileSync('modules/Movie/resources/js/pages/movie/index.tsx', 'utf8');
let stack = [];
let issues = [];
let brace = 0;
let i = 0;
const L = code.length;

function tagInfo(start) {
  let j = start;
  while (j < L && code[j] === ' ') j++;
  let closing = false;
  if (code[j] === '/') { closing = true; j++; while (j < L && code[j] === ' ') j++; }
  let nameStart = j;
  while (j < L && /[A-Za-z0-9._-]/.test(code[j])) j++;
  let name = code.slice(nameStart, j);
  return { closing, name, afterName: j };
}

while (i < L) {
  const c = code[i];
  if (c === '<') {
    if (code[i+1] === '!' && code[i+2] === '-' && code[i+3] === '-') {
      const end = code.indexOf('-->', i+4);
      if (end === -1) { i = L; break; }
      i = end + 3;
      continue;
    }
    const info = tagInfo(i+1);
    let j = info.afterName;
    let selfClosing = false;
    while (j < L) {
      const ch = code[j];
      if (ch === '"' || ch === "'" || ch === '`') {
        const q = ch; j++;
        while (j < L && code[j] !== q) {
          if (code[j] === '\\') j++;
          j++;
        }
        j++;
        continue;
      }
      if (ch === '>') break;
      if (ch === '/' && code[j+1] === '>') { selfClosing = true; j += 2; break; }
      j++;
    }
    i = j;
    if (!info.name) continue;
    if (selfClosing) continue;
    const ln = code.slice(0, i).split('\n').length;
    if (info.closing) {
      if (stack.length === 0) {
        issues.push(`line ${ln}: </${info.name}> empty stack`);
      } else if (stack[stack.length-1] !== info.name) {
        issues.push(`line ${ln}: </${info.name}> expected </${stack[stack.length-1]}> (stack: ${JSON.stringify(stack.slice(-5))})`);
        const idx = stack.lastIndexOf(info.name);
        if (idx >= 0) stack.splice(idx, 1);
        else stack.pop();
      } else {
        stack.pop();
      }
    } else {
      stack.push(info.name);
    }
    continue;
  }
  if (c === '{') brace++;
  else if (c === '}') brace--;
  i++;
}
console.log("Unclosed tags: " + JSON.stringify(stack));
console.log("Unmatched braces: " + brace);
console.log("Issues:");
issues.forEach(s => console.log("  " + s));
