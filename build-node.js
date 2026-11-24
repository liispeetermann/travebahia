// Cross-platform build with Node.js 18+:  node build-node.js
// Writes the website into THIS folder (top level) for GitHub Pages. Only files a previous build
// created (listed in .generated) are replaced; source files are never touched.
const fs = require('fs'), path = require('path');
const root = __dirname;
const order = ['config', 'art', 'content-destinations', 'content-articles', 'content-stays', 'photos', 'templates', 'build'];
const code = order.map((f) => fs.readFileSync(path.join(root, 'src', f + '.js'), 'utf8')).join('\n');
const files = new Function(code + '\nreturn build();')();
const protectedNames = new Set(['', '.', '..', 'src', 'public', 'tools', 'originals', 'build.sh', 'build-node.js', 'README.md', '.git', '.github', '.claude', '.DS_Store', '.generated']);

// build into a temp folder
const out = fs.mkdtempSync(path.join(require('os').tmpdir(), 'travelbahia-'));
fs.cpSync(path.join(root, 'public'), out, { recursive: true });
for (const [rel, content] of Object.entries(files)) {
  const p = path.join(out, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
}
fs.writeFileSync(path.join(out, 'CNAME'), 'travelbahia.com\n');

// remove the previous build's output, then copy the new one in
const manifest = path.join(root, '.generated');
if (fs.existsSync(manifest)) {
  for (const name of fs.readFileSync(manifest, 'utf8').split('\n')) {
    if (!protectedNames.has(name)) fs.rmSync(path.join(root, name), { recursive: true, force: true });
  }
}
const names = fs.readdirSync(out);
fs.writeFileSync(manifest, names.join('\n') + '\n');
fs.cpSync(out, root, { recursive: true });
fs.rmSync(out, { recursive: true, force: true });
console.log(`Generated ${Object.keys(files).length} files → ${root}`);
