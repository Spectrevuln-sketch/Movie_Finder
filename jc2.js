const fs = require('fs');
const code = fs.readFileSync('modules/Movie/resources/js/pages/movie/index.tsx', 'utf8');
const L = code.length;

let i = 0;
while (i < L) {
  if (code[i] === '<') {
    if (code[i+1] === '!' && code[i+2] === '-' && code[i+3] === '-') { i += 4; continue; }
    let j = i + 1;
    while (j < L && code[j] === ' ') j++;
    let closing = false;
    if (code[j] === '/') { closing = true; j++; while (j < L && code[j] === ' ') j++; }
    let nameStart = j;
    while (j < L && /[A-Za-z0-9._-]/.test(code[j])) j++;
    let name = code.slice(nameStart, j);
    let k = j;
    let selfClosing = false;
    let err = '';
    while (k < L) {
      const ch = code[k];
      if (ch === '"' || ch === "'" || ch === '`') {
        const q = ch; k++;
        while (k < L && code[k] !== q) {
          if (code[k] === '\\') k += 2;
          else k++;
        }
        k++;
        continue;
      }
      if (ch === '>') break;
      if (ch === '/' && code[k+1] === '>') { selfClosing = true; k += 2; break; }
      k++;
    }
    const ln = code.slice(0, i).split('\n').length;
    if (name && !closing) {
      console.log(`line ${ln}: <${name} ${selfClosing ? '[SELF-CLOSING]' : '[OPEN]'}>`);
    }
    if (closing) {
      console.log(`line ${ln}: </${name}> [CLOSE]`);
    }
    i = k + 1;
  } else {
    i++;
  }
}
