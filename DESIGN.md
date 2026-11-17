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

## 2. Système visuel (révisé le 2026-11-17)

Couleurs de la van (jaune flotte, noir panneau, papier), finition Apple pour les rayons et les ombres, typographie dans l'esprit de Google Antigravity. Les tokens vivent dans `preview/styles.css` (`:root` et les couches finales « CHAPA DA VAN » puis « REFINO »).

```css
:root {
  --color-fleet-yellow: #F5C400;        /* actions et accent uniquement */
  --color-fleet-yellow-hover: #E0B300;
  --color-panel-header: #131417;        /* header, hero, sections sombres */
  --color-panel-page: #0E0E10;
  --color-cream-page: #F6F5F0;          /* fond papier */
  --color-white-card: #FFFFFF;
  --color-text-main-dark: #1D1D1F;
  --color-text-sub-dark: #5A5E68;       /* placeholders : #5F636C (AA) */

  --font-display / --font-body: "Google Sans Flex", "Google Sans", -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
  --font-brand: 'Barlow Condensed';     /* uniquement le logotype « L.A PNEUS » */

  --radius-sm: 12px;                    /* champs */
  --radius-chapa: 18px;                 /* cartes et blocs */
  --radius-lg: 24px;                    /* photo du hero, grandes cartes tarifs */
  --radius-pill: 999px;                 /* boutons, onglets, chips */

  --shadow-1: 0 1px 2px rgba(16,17,20,.04), 0 4px 16px rgba(16,17,20,.05);   /* cartes claires */
  --shadow-2: 0 1px 2px rgba(16,17,20,.05), 0 12px 32px rgba(16,17,20,.09);  /* cartes tarifs, photo réservation, survol */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
}
```

Règles :
- **Ombres neutres, à deux couches, seulement sur fond clair.** Jamais de halo coloré ni d'ombre sur fond sombre (là : filet 1px). Pas de blur décoratif.
- **Boutons en pilule**, pression à `scale(0.98)`, transitions 200 ms en `--ease-out`, rien si `prefers-reduced-motion`.
- **Le jaune sert à l'action, pas au fond.** Boutons téléphone, CTA, mot accent et filet de 2px sous le header. Les grands fonds sont noir panneau (hero, comme la bande noire de la van) ou papier. Jamais de section entière en jaune : c'est fatigant à l'œil (retour du propriétaire, 2026-11-17).
- Pas de gradient, pas de quadrillage, pas de texture de trace de pneu derrière le texte.
- **Pas d'animation décorative** (points pulsants, défilement automatique). La galerie défile au doigt (scroll-snap).
- **Pas d'eyebrow** au-dessus des titres.
- **Photos réelles uniquement** (van, interventions sur parking). Pas d'image générée, pas de mur de logos de fabricants non validé. Exception voulue par le propriétaire : les 4 visuels de pièces détourés (disque, plaquettes, pneu, capteur) restent, car ils identifient chaque carte d'un coup d'œil. Plaques d'immatriculation toujours floutées.

## 3. Typographie

- **Titres :** Google Sans Flex 500, casse de phrase (pas de Title Case ni de majuscules), interlignage 1.04–1.06, tracking de -0.025em (H2) à -0.04em (H1 desktop), `text-wrap: balance`. H1 40px mobile / 54px tablette / 64px desktop. H2 32px / 42px.
- **Corps :** Google Sans Flex 400, 17px, interlignage 1.6, `text-wrap: pretty`. Aucun texte sous 13px.
- **Téléphones et prix :** chiffres tabulaires. Téléphones du hero en 21px / 600 dans des pilules jaunes de 56px. Libellé unique : « Appeler 078 605 43 01 ».
- **Pas de « Dépannage urgent »** ni 24/7 : l'opération ne l'assure pas (confirmé par le propriétaire). La confirmation sous 30 minutes reste.

---

## 4. Composants Clés

### 4.1. Barre d'Appel Mobile Persistante (`MobileCallBar`)
- Fixée en bas de l'écran (z-index 999), présente uniquement sur mobile / tablette.
- Deux boutons d'action côte à côte :
  - `078 605 43 01`
  - `076 642 96 95`
- Fond noir `#131417`, typographie jaune `#F5C400`, icône téléphone explicite.

### 4.2. Barre de Service / Hero
- Hero cinématographique sur noir `#0B0B0D`. Photo réelle `mecanicien-montage-pneu.jpg` (technicien au démonte-pneu, à bord de la van) :
  - desktop (≥1024px) : la photo occupe la moitié droite jusqu'aux bords, fondu vers le noir côté texte ; texte aligné à gauche, H1 72px (80px dès 1440px), « Genève et Vaud. » sur sa propre ligne ; légende factuelle en bas à droite ;
  - mobile et tablette : bande photo en haut (400px / 520px), le texte entre dans le dégradé ; les deux téléphones restent dans le premier écran.
- Un seul mouvement : la photo « se pose » (scale 1.06 → 1, 1,8 s, `--ease-out`), désactivé si `prefers-reduced-motion`.
- Pas de photo de flanc de van qui répète le titre.
- La page Tarifs reprend le même hero (noir, photo à droite en fondu, texte à gauche) avec `atelier-mobile-equipement.jpg` ; le sélecteur Abonnements / À la carte reste dans le hero.
- Les deux téléphones sont l'action principale (boutons jaunes, chiffres noirs) ; « Demander un devis gratuit » est secondaire (contour).
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

### 4.7. Header
- Logo + navigation. Sur desktop, un seul CTA jaune « Appeler 078 605 43 01 ». Sur mobile le CTA du header est masqué : la barre d'appel fixe en bas suffit.

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
