#!/usr/bin/env node
/**
 * Static SEO/content audit over the built site. Run after `npm run build`:
 *   npm run audit
 * Checks: one <h1>, unique <title>/description, canonical, JSON-LD, internal links
 * resolve, no leftover placeholder text. Exits 1 on any problem.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = 'dist';
if (!existsSync(ROOT)) {
  console.error('No dist/ folder — run `npm run build` first.');
  process.exit(1);
}

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"');
const pages = walk(ROOT)
  .filter((f) => f.endsWith('.html'))
  .map((f) => ({
    file: f,
    url: '/' + relative(ROOT, f).replace(/index\.html$/, '').replace(/404\.html$/, '404/'),
    html: readFileSync(f, 'utf8'),
  }));

const problems = [];
const titles = new Map();
const descs = new Map();
const known = new Set(pages.map((p) => p.url));
const resolves = (href) => {
  const path = href.split('#')[0].split('?')[0];
  return !path || known.has(path) || existsSync(join(ROOT, path)) || existsSync(join(ROOT, path, 'index.html'));
};

for (const { url, html } of pages) {
  const title = decode(html.match(/<title>(.*?)<\/title>/s)?.[1] ?? '');
  const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '');
  const noindex = /<meta name="robots" content="noindex/.test(html);
  titles.set(title, [...(titles.get(title) ?? []), url]);
  descs.set(desc, [...(descs.get(desc) ?? []), url]);

  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1s !== 1) problems.push(`${url}: expected 1 <h1>, found ${h1s}`);
  if (!title) problems.push(`${url}: missing <title>`);
  if (!noindex && title.length > 70) problems.push(`${url}: title ${title.length} chars (>70)`);
  if (!noindex && (desc.length < 70 || desc.length > 165)) problems.push(`${url}: description ${desc.length} chars`);
  if (!/<link rel="canonical"/.test(html)) problems.push(`${url}: missing canonical`);
  if (!/application\/ld\+json/.test(html)) problems.push(`${url}: missing JSON-LD`);
  if (/lorem ipsum|photoshop/i.test(html)) problems.push(`${url}: placeholder text found`);
  for (const [, href] of html.matchAll(/href="(\/[^"#]*)/g)) {
    if (!resolves(href)) problems.push(`${url}: broken internal link ${href}`);
  }
}
for (const [t, urls] of titles) if (urls.length > 1) problems.push(`duplicate title "${t}" on ${urls.join(', ')}`);
for (const [d, urls] of descs) if (urls.length > 1) problems.push(`duplicate description on ${urls.join(', ')}`);

console.log(`Audited ${pages.length} pages.`);
if (problems.length) {
  console.log([...new Set(problems)].map((p) => ` ✗ ${p}`).join('\n'));
  process.exit(1);
}
console.log('No problems found.');
