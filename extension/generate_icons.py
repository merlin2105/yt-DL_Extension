import os
import sys
import subprocess

# Ensure Pillow (PIL) is installed
try:
    from PIL import Image, ImageDraw
except ImportError:
    print("Pillow (PIL) ist nicht installiert. Installiere automatisch...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image, ImageDraw

# Create icons directory relative to script
script_dir = os.path.dirname(os.path.abspath(__file__))
icons_dir = os.path.join(script_dir, 'icons')
os.makedirs(icons_dir, exist_ok=True)

def create_neon_icon(size):
    # Base dark canvas with transparency
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw rounded background card
    padding = max(1, size // 16)
    card_size = size - 2 * padding
    radius = size // 4
    
    # Sleek dark background matching body bg (#0d0e15)
    draw.rounded_rectangle(
        [padding, padding, size - padding, size - padding],
        radius=radius,
        fill=(13, 14, 21, 255),
        outline=(60, 60, 80, 100),
        width=max(1, size // 32)
    )
    
    # Scale variables based on size
    center = size // 2
    w_scale = size / 128.0
    
    # Draw glowing elements (simulated with semi-transparent lines on larger sizes)
    if size >= 48:
        glow_width = int(8 * w_scale)
        # Violet glow
        draw.line(
            [(center, int(28 * w_scale)), (center, int(76 * w_scale))],
            fill=(168, 85, 247, 40),
            width=glow_width + 4
        )
        # Cyan glow
        draw.line(
            [(int(32 * w_scale), int(96 * w_scale)), (int(96 * w_scale), int(96 * w_scale))],
            fill=(6, 182, 212, 40),
            width=glow_width + 4
        )

    # Draw neon-violet arrow body
    arrow_width = max(2, int(8 * w_scale))
    draw.line(
        [(center, int(28 * w_scale)), (center, int(76 * w_scale))],
        fill=(168, 85, 247, 255),
        width=arrow_width
    )
    
    # Draw neon-violet arrow head (polygon)
    head_size = int(14 * w_scale)
    draw.polygon(
        [
            (center - head_size, int(66 * w_scale)),
            (center + head_size, int(66 * w_scale)),
            (center, int(82 * w_scale))
        ],
        fill=(168, 85, 247, 255)
    )
    
    # Draw neon-cyan base bar/tray (representing disk download)
    tray_y = int(96 * w_scale)
    tray_width = max(2, int(8 * w_scale))
    draw.line(
        [(int(32 * w_scale), tray_y), (int(96 * w_scale), tray_y)],
        fill=(6, 182, 212, 255),
        width=tray_width
    )
    
    # Save image
    img_path = os.path.join(icons_dir, f'icon-{size}.png')
    img.save(img_path, 'PNG')
    print(f'✅ Icon erstellt: {img_path} ({size}x{size})')

# Generate sizes 16, 48, 128
for s in [16, 48, 128]:
    create_neon_icon(s)

print("\n🎉 Alle Icons erfolgreich generiert!")
