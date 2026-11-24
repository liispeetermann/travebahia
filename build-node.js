// Cross-platform build with Node.js 18+:  node build-node.js
const fs = require('fs'), path = require('path');
const order = ['config', 'art', 'content-destinations', 'content-articles', 'content-stays', 'photos', 'templates', 'build'];
const code = order.map((f) => fs.readFileSync(path.join(__dirname, 'src', f + '.js'), 'utf8')).join('\n');
const files = new Function(code + '\nreturn build();')();
const out = path.join(__dirname, 'site');
fs.rmSync(out, { recursive: true, force: true });
fs.cpSync(path.join(__dirname, 'public'), out, { recursive: true });
for (const [rel, content] of Object.entries(files)) {
  const p = path.join(out, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
}
console.log(`Generated ${Object.keys(files).length} files → ${out}`);
