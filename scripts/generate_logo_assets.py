import base64
import os
from PIL import Image

def generate_assets():
    src_png = 'public/assets/logo-official.png'
    if not os.path.exists(src_png):
        raise FileNotFoundError(f"Source file {src_png} not found")

    img = Image.open(src_png).convert('RGBA')
    w, h = img.size
    print(f"Loaded {src_png}: {w}x{h}")

    # 1. Update logo-shield.svg
    with open(src_png, 'rb') as f:
        b64_data = base64.b64encode(f.read()).decode('ascii')

    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="100%" height="100%">
  <image width="{w}" height="{h}" href="data:image/png;base64,{b64_data}"/>
</svg>'''

    with open('public/assets/logo-shield.svg', 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print("Generated public/assets/logo-shield.svg")

    # 2. Favicons in various resolutions
    # 16x16
    fav16 = img.resize((16, 16), Image.Resampling.LANCZOS)
    fav16.save('public/assets/favicon-16x16.png', 'PNG', optimize=True)

    # 32x32
    fav32 = img.resize((32, 32), Image.Resampling.LANCZOS)
    fav32.save('public/assets/favicon-32x32.png', 'PNG', optimize=True)

    # 48x48
    fav48 = img.resize((48, 48), Image.Resampling.LANCZOS)
    fav48.save('public/assets/favicon-48x48.png', 'PNG', optimize=True)

    # 180x180 (Apple touch icon)
    fav180 = img.resize((180, 180), Image.Resampling.LANCZOS)
    fav180.save('public/assets/apple-touch-icon.png', 'PNG', optimize=True)

    # 192x192 & 512x512 (Android / PWA)
    fav192 = img.resize((192, 192), Image.Resampling.LANCZOS)
    fav192.save('public/assets/android-chrome-192x192.png', 'PNG', optimize=True)
    fav512 = img.resize((512, 512), Image.Resampling.LANCZOS)
    fav512.save('public/assets/android-chrome-512x512.png', 'PNG', optimize=True)

    # ICO format with multiple sizes (16, 32, 48)
    ico_destinations = [
        'favicon.ico',
        'public/favicon.ico',
        'public/assets/favicon.ico',
        'preview/favicon.ico'
    ]
    for dest in ico_destinations:
        os.makedirs(os.path.dirname(dest) if os.path.dirname(dest) else '.', exist_ok=True)
        img.save(dest, format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
        print(f"Generated {dest}")

    print("All favicon and logo assets generated successfully!")

if __name__ == '__main__':
    generate_assets()
