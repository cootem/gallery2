// Usage: node swipe-test.mjs <photo-url>   (drives installed Chrome with mobile emulation + real touch events)
import puppeteer, { KnownDevices } from 'puppeteer-core';
const url = process.argv[2];
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--user-data-dir=/tmp/pptr-prof'] });
const p = await b.newPage();
await p.emulate(KnownDevices['Pixel 5']);
const errs = []; p.on('pageerror', e => errs.push(String(e)));
await p.goto(url, { waitUntil: 'networkidle2' });
const info = await p.evaluate(() => ({ scale: window.visualViewport.scale, vw: innerWidth, sw: document.documentElement.scrollWidth,
  next: document.querySelector('.buttonNext a')?.href, prev: document.querySelector('.buttonPrev a')?.href }));
console.log('page', info);
async function swipe(dx, dy = 0, steps = 10) {
  const x0 = dx < 0 ? 330 : 60, y0 = 400;
  const t = p.touchscreen;
  await t.touchStart(x0, y0);
  for (let i = 1; i <= steps; i++) await t.touchMove(x0 + dx * i / steps, y0 + dy * i / steps);
  await t.touchEnd();
}
for (const [name, dx, dy] of [['swipe left (expect next)', -250, 5], ['swipe right (expect prev)', 250, 5]]) {
  await p.goto(url, { waitUntil: 'networkidle2' });
  const nav = p.waitForNavigation({ timeout: 4000 }).then(() => p.url(), () => '(no navigation)');
  await swipe(dx, dy);
  console.log(name, '->', await nav);
}
console.log('page errors:', errs);
await b.close();
