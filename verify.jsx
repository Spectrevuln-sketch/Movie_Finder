const fs = require('fs');
const { parse } = require('@typescript-eslint/parser');
const code = fs.readFileSync('modules/Movie/resources/js/pages/movie/index.tsx', 'utf8');
try {
  const ast = parse(code, {
    filePath: 'index.tsx',
    jsx: true,
    range: true,
    loc: true,
    ecmaVersion: 2020,
    sourceType: 'module',
  });
  console.log('Parse OK. AST type:', ast.type);
} catch (e) {
  console.log('PARSE ERROR:', e.message.split('\n').slice(0, 3).join('\n'));
  console.log('Line:', e.lineNumber);
}
