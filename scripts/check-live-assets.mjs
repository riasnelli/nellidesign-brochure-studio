import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const [distDir, siteUrl] = process.argv.slice(2);
if (!distDir || !siteUrl) {
  console.error('Usage: node scripts/check-live-assets.mjs dist https://brochuredesign.pro/');
  process.exit(2);
}

const base = new URL(siteUrl);
const html = await readFile(join(distDir, 'index.html'), 'utf8');
const entry = html.match(/(?:src|href)="(\/assets\/[^\"]+\.js)"/)?.[1];
assert.ok(entry, 'Built HTML has no JavaScript entry');

async function check() {
  const page = await fetch(new URL(`/?asset_check=${Date.now()}`, base), {
    headers: { 'Cache-Control': 'no-cache' }, signal: AbortSignal.timeout(15000),
  });
  assert.ok(page.ok, `Live homepage returned HTTP ${page.status}`);
  assert.ok((await page.text()).includes(entry), `Live HTML does not reference built entry ${entry}`);

  const assets = (await readdir(join(distDir, 'assets')))
    .filter((name) => /\.(?:js|css)$/.test(name));
  for (let offset = 0; offset < assets.length; offset += 6) {
    await Promise.all(assets.slice(offset, offset + 6).map(async (name) => {
      const response = await fetch(new URL(`/assets/${name}`, base), {
        signal: AbortSignal.timeout(15000),
      });
      assert.ok(response.ok, `${name} returned HTTP ${response.status}`);
      const type = response.headers.get('content-type') ?? '';
      assert.match(type, name.endsWith('.js') ? /javascript|ecmascript/i : /text\/css/i,
        `${name} was served as ${type}, not its expected asset type`);
      await response.body?.cancel();
    }));
  }
  console.log(`Live Hostinger HTML and ${assets.length} JavaScript/CSS assets verified.`);
}

let lastError;
for (let attempt = 1; attempt <= 6; attempt++) {
  try {
    await check();
    lastError = undefined;
    break;
  } catch (error) {
    lastError = error;
    if (attempt < 6) await new Promise((resolve) => setTimeout(resolve, 10000));
  }
}
if (lastError) {
  console.error(`Live asset check failed: ${lastError.message}`);
  process.exitCode = 1;
}