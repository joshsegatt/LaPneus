const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const PREVIEW_DIR = path.join(ROOT_DIR, 'preview');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

console.log('🚀 Démarrage du build de production (Vercel)...\n');

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

// 2. Copier les fichiers du dossier preview vers dist root et ROOT_DIR
const previewFiles = fs.readdirSync(PREVIEW_DIR);
for (const file of previewFiles) {
  const src = path.join(PREVIEW_DIR, file);
  const destDist = path.join(DIST_DIR, file);
  const destRoot = path.join(ROOT_DIR, file);
  if (fs.statSync(src).isFile()) {
    fs.copyFileSync(src, destDist);
    fs.copyFileSync(src, destRoot);
    console.log(`✓ Copié: preview/${file} -> dist/${file} & root/${file}`);
  }
}

// 3. Copier public/ vers dist/public/ et dist/assets/ et root/assets/
if (fs.existsSync(PUBLIC_DIR)) {
  copyDirSync(PUBLIC_DIR, path.join(DIST_DIR, 'public'));
  console.log('✓ Copié: public/ -> dist/public/');

  const publicAssets = path.join(PUBLIC_DIR, 'assets');
  if (fs.existsSync(publicAssets)) {
    copyDirSync(publicAssets, path.join(DIST_DIR, 'assets'));
    copyDirSync(publicAssets, path.join(ROOT_DIR, 'assets'));
    console.log('✓ Copié: public/assets/ -> dist/assets/ et root/assets/ (compatibilité maximale)');
  }
}

// 4-6. Redirections, en-têtes et cache : voir vercel.json (la Vercel ignore _redirects/_headers).
//      preview/ n'est plus copié dans dist/ pour éviter une copie indexable du site.

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
    if (ref.startsWith('http') || ref.startsWith('tel:') || ref.startsWith('mailto:') || ref.startsWith('#') || ref === '' || (ref.startsWith('/') && !path.extname(ref))) {
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
