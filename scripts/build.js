const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const PREVIEW_DIR = path.join(ROOT_DIR, 'preview');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

console.log('🚀 Démarrage du build de production pour Netlify...\n');

// 1. Nettoyer ou créer dist/
if (fs.existsSync(DIST_DIR)) {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DIST_DIR, { recursive: true });

// Fonction utilitaire de copie récursive
function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 2. Copier les fichiers du dossier preview vers dist root
const previewFiles = fs.readdirSync(PREVIEW_DIR);
for (const file of previewFiles) {
  const src = path.join(PREVIEW_DIR, file);
  const dest = path.join(DIST_DIR, file);
  if (fs.statSync(src).isFile()) {
    fs.copyFileSync(src, dest);
    console.log(`✓ Copié: preview/${file} -> dist/${file}`);
  }
}

// 3. Copier public/ vers dist/public/ et dist/assets/
if (fs.existsSync(PUBLIC_DIR)) {
  copyDirSync(PUBLIC_DIR, path.join(DIST_DIR, 'public'));
  console.log('✓ Copié: public/ -> dist/public/');

  const publicAssets = path.join(PUBLIC_DIR, 'assets');
  if (fs.existsSync(publicAssets)) {
    copyDirSync(publicAssets, path.join(DIST_DIR, 'assets'));
    console.log('✓ Copié: public/assets/ -> dist/assets/ (double compatibilité de chemins)');
  }
}

// 4. Copier également preview/ dans dist/preview/ pour compatibilité totale d'URL
copyDirSync(PREVIEW_DIR, path.join(DIST_DIR, 'preview'));
console.log('✓ Copié: preview/ -> dist/preview/');

// 5. Générer _redirects pour Netlify
const redirectsContent = `# Redirections Netlify L.A Pneus
/preview/index.html   /   301!
/preview              /   301!
/preview/tarifs.html  /tarifs   301!
/tarifs               /tarifs.html   200
`;
fs.writeFileSync(path.join(DIST_DIR, '_redirects'), redirectsContent, 'utf-8');
console.log('✓ Généré: dist/_redirects');

// 6. Générer _headers pour Netlify (Performance & Sécurité)
const headersContent = `/*
  X-Frame-Options: SAMEORIGIN
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(self), camera=(), microphone=()

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/public/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=0, must-revalidate

/*.css
  Cache-Control: public, max-age=604800, stale-while-revalidate=86400

/*.js
  Cache-Control: public, max-age=604800, stale-while-revalidate=86400
`;
fs.writeFileSync(path.join(DIST_DIR, '_headers'), headersContent, 'utf-8');
console.log('✓ Généré: dist/_headers');

// 7. Vérification d'intégrité des assets de index.html et tarifs.html
console.log('\n🔍 Vérification de l\'intégrité des assets...');
const pagesToCheck = ['index.html', 'tarifs.html'];
let totalCheckedCount = 0;
let totalMissingCount = 0;

for (const pageName of pagesToCheck) {
  const pagePath = path.join(DIST_DIR, pageName);
  if (!fs.existsSync(pagePath)) {
    console.warn(`  ⚠️ Fichier HTML introuvable: "${pageName}"`);
    totalMissingCount++;
    continue;
  }
  const htmlContent = fs.readFileSync(pagePath, 'utf-8');
  const assetRegex = /(?:src|href|srcset|poster)=["']([^"']+)["']/g;
  let match;

  while ((match = assetRegex.exec(htmlContent)) !== null) {
    let ref = match[1].split('?')[0].split('#')[0].trim();
    if (ref.startsWith('http') || ref.startsWith('tel:') || ref.startsWith('mailto:') || ref.startsWith('#') || ref === '') {
      continue;
    }
    totalCheckedCount++;

    // Tester plusieurs résolutions de chemin
    let resolvedPath = path.resolve(DIST_DIR, ref);
    if (!fs.existsSync(resolvedPath)) {
      // Essayer sans ../
      let altRef = ref.replace(/^\.\.\//, '');
      let altPath = path.resolve(DIST_DIR, altRef);
      if (!fs.existsSync(altPath)) {
        console.warn(`  ⚠️ Asset introuvable dans ${pageName}: "${ref}"`);
        totalMissingCount++;
        continue;
      }
    }
  }
}

console.log(`✓ ${totalCheckedCount} références analysées à travers ${pagesToCheck.length} pages.`);
if (totalMissingCount === 0) {
  console.log('✨ SUCCÈS: 100% des assets sont présents dans dist/ !');
} else {
  console.warn(`⚠️ ATTENTION: ${totalMissingCount} assets introuvables dans dist/.`);
}

console.log('\n🎉 Build terminé avec succès ! Dossier prêt à être déployé : "dist/"\n');
