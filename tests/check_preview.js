const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../preview/index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const forbidden = [
  'bienvenue',
  'votre partenaire de confiance',
  'pourquoi nous choisir',
  'leader suisse',
  'notre vision',
  'nos partenaires',
  'club vip',
  'book now',
  'get a quote'
];

let failed = false;

for (const phrase of forbidden) {
  if (new RegExp('<h1>.*?' + phrase + '.*?</h1>', 'i').test(html)) {
    console.error(`FAILED: H1 contains forbidden phrase "${phrase}"`);
    failed = true;
  }
}

const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
if (!h1Match) {
  console.error('FAILED: No H1 found');
  failed = true;
} else {
  const h1Text = h1Match[1].toLowerCase();
  console.log(`Checking H1 text: "${h1Text.trim()}"`);
  if (!h1Text.includes('pneu') || !h1Text.includes('frein')) {
    console.error('FAILED: H1 must include pneu and frein');
    failed = true;
  }
  if (!h1Text.includes('genève') || !h1Text.includes('vaud')) {
    console.error('FAILED: H1 must include genève and vaud');
    failed = true;
  }
}

if (!html.includes('tel:+41786054301')) {
  console.error('FAILED: Missing phone tel:+41786054301');
  failed = true;
}

if (!html.includes('tel:+41766429695')) {
  console.error('FAILED: Missing phone tel:+41766429695');
  failed = true;
}

if (/style\s*=\s*"[^"]*"/i.test(html)) {
  console.error('FAILED: inline style attribute found');
  failed = true;
}

if (failed) {
  process.exit(1);
}

console.log('SUCCESS: All positioning, typography, phone links, and anti-slop rules passed!');
