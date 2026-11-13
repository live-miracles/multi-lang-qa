// Usage: node build-demo.mjs <out dir>
// Injects the mock backend into the built app (dist/apps-script/Index.html) -> <out dir>/index.html
import fs from 'fs';
import path from 'path';
const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1'));
const out = process.argv[2];
fs.mkdirSync(out, { recursive: true });
const mock = fs.readFileSync(path.join(here, 'mock-backend.js'), 'utf8');
const html = fs.readFileSync('dist/apps-script/Index.html', 'utf8');
fs.writeFileSync(
    path.join(out, 'index.html'),
    html.replace('<head>', `<head><script>${mock}</script>`),
);
