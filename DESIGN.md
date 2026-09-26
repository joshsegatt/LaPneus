# L.A Pneus — Design System Specification

Guide de style et tokens visuels dérivés de la van d'atelier **L.A Pneus** (Onex / Genève).
Document source pour l'ensemble des interfaces du projet.

---

## 1. Principes Directeurs

1. **L'atelier mobile est la marque :** Le site ne vend pas du rêve d'agence ni un garage fixe avec salle d'attente. Il reflète une camionnette d'intervention professionnelle, équipée et prête à rouler.
2. **Fonctionnalité brute & lisibilité à 20 mètres :** Fort contraste, numéros de téléphone tabulaires géants, zéro fioriture (pas de glassmorphism, pas de mesh gradients, pas de micro-animations distrayantes).
3. **Ergonomie du pouce (Mobile First) :** L'automobiliste en panne ou pressé doit pouvoir appeler les deux lignes (`078 605 43 01` et `076 642 96 95`) instantanément d'une seule main.
4. **Zéro Slop :** Aucun texte en anglais sur l'interface française, aucun compteur animé factice, aucune fausse note Google, aucun logo de fabricant non validé.

---

## 2. Tokens CSS (`tokens.css` & `styles.css`)

```css
:root {
  /* Palette Frota Calibrada (Padrão Apple / Anti-Ofuscamento Ocular) */
  --color-fleet-yellow: #E5C33A;       /* Jaune frota acetinado suave (78% saturação - zero fadiga) */
  --color-fleet-yellow-hover: #D4B22B; /* Jaune hover nobre */
  --color-fleet-yellow-subtle: rgba(229, 195, 58, 0.08); /* Glow de fundo sutil */
  --color-fleet-yellow-border: rgba(229, 195, 58, 0.22); /* Liseré técnico suave */
  
  /* Superfícies & Painéis */
  --color-panel-header: #131417;       /* Fundo do header com blur */
  --color-panel-page: #0E0E10;         /* Preto obsidiana suave de fundo */
  --color-panel-surface: #17181C;      /* Superfície de cartões escuros */
  --color-panel-input: #111111;        /* Fundo de campos */
  
  /* Fond de page (Papier chaud para legibilidade suíça) */
  --color-cream-page: #F3F1EA;         /* Fundo off-white papel quente */
  --color-white-card: #FFFFFF;         /* Cartão branco puro */
  
  /* Textos & Contrastes (Apple HIG Text Scale) */
  --color-text-main-dark: #1D1D1F;     /* Grafite profundo no papel claro */
  --color-text-sub-dark: #5A5E68;      /* Secundário no papel claro */
  --color-text-main-light: #F5F5F7;    /* Branco suave no fundo escuro (sem brilho agressivo) */
  --color-text-sub-light: #A6ABB6;     /* Prata quente secundário no escuro */
  --color-text-dim-light: #7A7F8B;     /* Terciário / legendas no escuro */

  /* Typographie (Apple Typography Standard) */
  --font-display: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --font-body: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --font-brand: 'Barlow Condensed', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: Consolas, "Liberation Mono", Menlo, Courier, monospace;

  /* Échelles & Rythme (Apple Squircle & Elite Elevation) */
  --radius-chapa: 20px;
  --radius-card: 20px;
  --radius-card-sm: 14px;
  --radius-card-lg: 24px;
  --radius-pill: 9999px;
  --radius-dock: 14px;
}
```

---

## 3. Typographie & Hiérarchie (Padrão Apple HIG)

- **Titres (H1, H2, H3) :**
  - Font display nativa Apple / Inter com tracking negativo calibrado (`letter-spacing: -0.02em` a `-0.03em`).
  - Escrita em **Title Case / Sentence Case natural** (remoção do gritante `text-transform: uppercase` desnecessário em títulos longos, proporcionando conforto visual e leitura rápida).
  - Quebra harmônica com `text-wrap: balance`.
  - H1 de la page d'accueil : direct, orienté service et géolocalisation (`Pneus et freins changés chez vous. Onex et Genève.`).
- **Corps de texte :**
  - Base em 17px, altura de linha relaxada `line-height: 1.62`, `letter-spacing: -0.006em`, quebra `text-wrap: pretty`.
  - Français suisse soigné (`changement`, `équilibrage`, `serrage au couple constructeur`, `plaquettes`, `disques`).
- **Téléphones :**
  - Chiffres tabulaires (`font-variant-numeric: tabular-nums`).
  - Graisse 800, sempre clicáveis com protocolo `tel:+41...`.

---

## 4. Composants Clés

### 4.1. Barre d'Appel Mobile Persistante (`MobileCallBar`)
- Fixée en bas de l'écran (z-index 999), présente uniquement sur mobile / tablette.
- Deux boutons d'action côte à côte :
  - `078 605 43 01`
  - `076 642 96 95`
- Fond noir `#131417`, typographie jaune `#E9CF42`, icône téléphone explicite.

### 4.2. Barre de Service / Hero
- Photo réelle de la camionnette en cadrage latéral net.
- Sans overlay opaque violet ou bleu d'agence.
- L'accroche principale informe en moins de 5 secondes de la nature de la prestation et du lieu d'intervention.

### 4.3. Bloc Dual Métier (Pneus & Freins)
- Contrôle segmenté (Segmented Control) tactile pour basculer instantanément entre Pneumatiques et Système de Freinage.
- Fiches de spécifications d'outillage embarqué (démonte-pneu assisté 12"-24", équilibreuse dynamique étalonnée, clé dynamométrique certifiée).

### 4.4. Calculateur d'Intervention Expresse (CHF)
- Cartões de opções com seleção háptica e atualização em tempo real de estimativas indicativas em CHF com deslocamento incluído.
- Botão "Pré-remplir le formulaire" que sincroniza os dados calculados diretamente com o formulário de contato.

### 4.5. Explorateur de Communes Genevoises
- Chips interativos das comunas (Onex, Lancy, Bernex, Vernier, Meyrin, etc.) com tempo estimado de chegada (ETA) e preenchimento de endereço.

### 4.6. Accordions Fluides FAQ (Apple Style)
- Elementos `<details class="faq-accordion">` com transição causal suave (180ms), ícone rotativo de 45 graus e fechamento automático de itens adjacentes.

### 4.7. Island Call Dock Mobile
- Barra flutuante elevada com backdrop-filter blur de 12px, cantos arredondados (8px) e botões de chamada rápida com microcompressão táctil.

### 4.8. Guide Technique d'Inspection des Pièces (Mode 8K Détouré & Compact)
- **Visuels 8K sans fond (Alpha PNG / WebP)** : Photographies de studio ultra-nettes isolées sur fond transparent (`part-disque-ventile.png`, `part-plaquettes-frein.png`, `part-pneu-sport.png`, `part-tpms-valve.png`), affichant les détails macroscopiques réels (perçages de dissipation thermique, rainures d'évacuation, témoins TWI et valves aluminium).
- **Structure Compacte en 4 Cartes** : Grille 4 colonnes sur desktop, visualisant l'ensemble des organes de roulement en un seul coup d'œil sans surcharger la hauteur de page.
- **Micro-Télémétrie OETV & Calendrier** :
  - Disques : Cote minimale TH 22.4 mm, remplacement 60'000 à 80'000 km / 4 à 5 ans.
  - Plaquettes : Garniture minimale 3.0 mm, remplacement 30'000 à 45'000 km / 2 à 3 ans.
  - Pneus : Témoins TWI 1.6 mm (préconisation TCS 3-4 mm), remplacement 40'000 à 50'000 km / 5 ans.
  - TPMS : Étanchéité 3.5 bar, pile 5 à 7 ans / 100'000 à 120'000 km.
- **Jauges Visuelles & Signes d'Alerte** : Barres d'usure proportionnelles avec cran légal OETV et liste des symptômes concrets au volant (vibrations, sifflements, début d'aquaplaning).
- **Réservation Directe 1 Clic** : Bouton d'action pré-remplissant automatiquement le service concerné dans le formulaire d'intervention à domicile.

---

## 5. Règles Anti-Slop & Qualité

- ❌ Interdiction des déclarations invérifiables ("Leader suisse du dépannage", "2000+ clients satisfaits").
- ❌ Pas de fausse photo de stock de mécanicien sur fond de studio aseptisé.
- ❌ Pas de widget de chat automatisé ni de popups invasives.
- ❌ Zéro attribut `style=""` dans le code source.
- ❌ Tous les liens téléphoniques respectent le format international suisse `tel:+41...`.
