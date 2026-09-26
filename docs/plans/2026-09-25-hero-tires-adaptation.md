# Hero 5-Tires Showcase Adaptation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Adapt the high-resolution 5-tires studio render into the Hero section of L.A Pneus with zero inline styles, optimal responsive scaling (2.75:1 aspect ratio), and seamless color integration with the golden yellow palette.

**Architecture:** Process the source image into edge-feathered seamless WebP/PNG and clean transparent cutout assets. Integrate the image into the Hero layout either as the Right-Column Visual (`.hero-visual`) or as an expansive Panoramic Stage (`.hero-tires-stage`), ensuring total responsiveness, zero performance penalties, and 100% test compliance.

**Tech Stack:** HTML5, CSS3 Tokens, Python (Pillow, rembg), Node.js test suites.

---

### Task 1: Image Processing & High-Fidelity Asset Pipeline

**Files:**
- Create: `scripts/process_hero_tires.py`
- Generate: `public/assets/pneus-hero-showcase.webp` (Seamless Studio Blend, Quality 95)
- Generate: `public/assets/pneus-hero-showcase.png`
- Generate: `public/assets/pneus-hero-cutout.webp` (Transparent Cutout, Quality 95)
- Generate: `public/assets/pneus-hero-cutout.png`

**Step 1: Write processing script with edge feathering and format conversion**
```python
# scripts/process_hero_tires.py
from PIL import Image
import numpy as np

def create_hero_assets():
    src = 'C:/Users/Joshsegatt/.gemini/antigravity/brain/afc39501-4bba-46b4-8376-1964a207d747/.user_uploaded/media_1790343501886.png'
    img = Image.open(src).convert('RGBA')
    
    # 1. Seamless Studio version with soft horizontal feathering on left/right edges
    w, h = img.size
    arr = np.array(img).astype(float)
    
    # Create horizontal gradient mask for seamless blend on hero background
    feather_w = int(w * 0.04) # 4% edge feathering
    alpha_mask = np.ones((h, w), dtype=float)
    for x in range(feather_w):
        factor = (x / feather_w) ** 1.5
        alpha_mask[:, x] *= factor
        alpha_mask[:, w - 1 - x] *= factor
        
    arr[:, :, 3] = arr[:, :, 3] * alpha_mask
    seamless_img = Image.fromarray(arr.astype(np.uint8))
    
    seamless_img.save('public/assets/pneus-hero-showcase.png', 'PNG', optimize=True)
    seamless_img.save('public/assets/pneus-hero-showcase.webp', 'WEBP', quality=95)
    
    # 2. Cutout version from previously verified rembg output
    cutout = Image.open('public/assets/test_pneus_rembg.png').convert('RGBA')
    cutout.save('public/assets/pneus-hero-cutout.png', 'PNG', optimize=True)
    cutout.save('public/assets/pneus-hero-cutout.webp', 'WEBP', quality=95)
    print("Assets generated successfully!")

if __name__ == '__main__':
    create_hero_assets()
```

**Step 2: Run script to generate all variants**
Run: `python scripts/process_hero_tires.py`
Expected output: `Assets generated successfully!`

**Step 3: Verify asset sizes and HTTP headers**
Run: `curl.exe -I http://localhost:3000/public/assets/pneus-hero-showcase.webp`
Expected: HTTP 200, `Content-Type: image/webp`

---

### Task 2: Markup Integration in `preview/index.html`

**Files:**
- Modify: `preview/index.html:77-80`

**Step 1: Replace right column visual with the 5-tire showcase**
```html
        <!-- COLUNA DIREITA: VITRINE 5 PNEUS EM ALTA RESOLUÇÃO -->
        <div class="hero-visual">
          <img 
            src="../public/assets/pneus-hero-showcase.webp" 
            alt="Gamme complète de pneus été, hiver et 4 saisons montés à domicile à Genève et Onex" 
            class="hero-tires-img" 
            width="1024" 
            height="372" 
            fetchpriority="high"
          >
        </div>
```

**Step 2: Verify zero inline styles**
Run: `pwsh -Command "Select-String -Path 'preview/index.html' -Pattern 'style=' | Measure-Object"`
Expected: `Count: 0`

---

### Task 3: CSS Craft & Responsive Polish in `preview/styles.css`

**Files:**
- Modify: `preview/styles.css:565-595`

**Step 1: Implement responsive styling with 2.75:1 aspect ratio and depth**
```css
/* Hero Visual (Vitrine 5 Pneus Studio) */
.hero-visual,
.hero-van-visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  box-shadow: none;
  width: 100%;
}

.hero-tires-img {
  width: 100%;
  max-width: 680px;
  height: auto;
  aspect-ratio: 1024 / 372;
  object-fit: contain;
  display: block;
  filter: drop-shadow(0 14px 28px rgba(14, 14, 16, 0.18));
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-visual:hover .hero-tires-img {
  transform: translateY(-3px) scale(1.02);
  filter: drop-shadow(0 20px 38px rgba(14, 14, 16, 0.24));
}

@media (max-width: 979px) {
  .hero-tires-img {
    max-width: 520px;
    margin: 0 auto;
  }
}
```

---

### Task 4: Quality Verification & Regression Testing

**Files:**
- Test: `tests/check_preview.js`
- Test: `tests/positioning.spec.ts`

**Step 1: Execute `npm test`**
Run: `npm test`
Expected output: `SUCCESS: All positioning, typography, phone links, and anti-slop rules passed!`

**Step 2: Execute `positioning.spec.ts`**
Run: `node --experimental-strip-types tests/positioning.spec.ts`
Expected output: `Positioning spec PASSED cleanly!`

**Step 3: Verify preview server status**
Run: `curl.exe -s -o /dev/null -w "%{http_code}" http://localhost:3000/preview/index.html`
Expected output: `200`
