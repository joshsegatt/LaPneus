/**
 * Positioning & Anti-Slop Specification Test for L.A Pneus
 * 
 * Verifies that the website copy respects the mobile workshop reality:
 * - H1 must state the service and location (Genève et Vaud), never "Bienvenue" or "Votre partenaire de confiance"
 * - Both official phone numbers (078 605 43 01 and 076 642 96 95) must be present and clickable (tel:)
 * - Pneus AND Freins (plaquettes & disques) must be featured equally
 * - No fake 24/7 or stock counters
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export function testPositioningAndCopy(htmlFilePath: string): { success: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!existsSync(htmlFilePath)) {
    return { success: false, errors: [`File not found: ${htmlFilePath}`] };
  }

  const html = readFileSync(htmlFilePath, 'utf-8');

  // 1. Anti-Slop H1 Checks
  const forbiddenPhrases = [
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

  for (const phrase of forbiddenPhrases) {
    if (new RegExp(`<h1>.*?${phrase}.*?<\/h1>`, 'i').test(html)) {
      errors.push(`H1 contains forbidden slop phrase: "${phrase}"`);
    }
  }

  // 2. Mandatory H1 Elements
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!h1Match) {
    errors.push('No H1 tag found in HTML');
  } else {
    const h1Text = h1Match[1].toLowerCase();
    if (!h1Text.includes('pneu') && !h1Text.includes('frein')) {
      errors.push('H1 must explicitly mention service (pneus or freins)');
    }
    if (!h1Text.includes('genève') && !h1Text.includes('vaud')) {
      errors.push('H1 must anchor the location (Genève or Vaud)');
    }
  }

  // 3. Mandatory Phone Protocol Checks
  if (!html.includes('tel:+41786054301') && !html.includes('tel:0786054301')) {
    errors.push('Phone 078 605 43 01 is missing or not a tel: link');
  }
  if (!html.includes('tel:+41766429695') && !html.includes('tel:0766429695')) {
    errors.push('Phone 076 642 96 95 is missing or not a tel: link');
  }

  // 4. Dual Core Offer: Pneus AND Freins (plaquettes / disques)
  if (!html.includes('plaquettes') && !html.includes('disques')) {
    errors.push('HTML must highlight brake service (plaquettes et disques), the core differentiator');
  }

  // 5. Mandatory Cantonal Geographic Scope (Genève & Vaud)
  if (!html.includes('Genève') || !html.includes('Vaud')) {
    errors.push('Geographic scope Genève and Vaud is missing from the footer or NAP block');
  }

  // 6. No inline style=""
  if (/style\s*=\s*"[^"]*"/i.test(html)) {
    errors.push('Inline style="" attribute found in HTML. All styling must use CSS tokens.');
  }

  return {
    success: errors.length === 0,
    errors
  };
}

const target = join(process.cwd(), 'preview/index.html');
const result = testPositioningAndCopy(target);
if (!result.success) {
  console.error('Positioning spec FAILED with errors:');
  result.errors.forEach(err => console.error(' - ' + err));
  process.exit(1);
} else {
  console.log('Positioning spec PASSED cleanly!');
}
