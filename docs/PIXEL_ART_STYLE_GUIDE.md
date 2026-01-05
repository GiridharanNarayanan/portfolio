# GiriD Portfolio - Pixel Art Style Guide

## For Figma / Pixel Art Tools

Use this guide when creating featured images for writings and projects.

---

## 🎨 Color Palette

### Dark Theme (Primary)

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Background** | `#0f1419` | rgb(15, 20, 25) | Main canvas background |
| **Background Secondary** | `#1a1f26` | rgb(26, 31, 38) | Cards, panels, depth |
| **Background Card** | `#2d2a26` | rgb(45, 42, 38) | Elevated elements |
| **Text** | `#e6edf3` | rgb(230, 237, 243) | Primary text, highlights |
| **Text Muted** | `#8b949e` | rgb(139, 148, 158) | Secondary text, details |
| **Accent (Gold)** | `#c5a93c` | rgb(197, 169, 60) | Primary accent, CTAs |
| **Accent Hover** | `#d4bc5a` | rgb(212, 188, 90) | Hover states, glow |
| **Accent Secondary (Green)** | `#7c9a5e` | rgb(124, 154, 94) | Secondary highlights |
| **Border** | `#30363d` | rgb(48, 54, 61) | Outlines, dividers |
| **Success** | `#3fb950` | rgb(63, 185, 80) | Positive indicators |
| **Error** | `#f85149` | rgb(248, 81, 73) | Errors, warnings |

### Light Theme (Optional)

| Name | Hex | RGB |
|------|-----|-----|
| **Background** | `#f8f9fa` | rgb(248, 249, 250) |
| **Background Secondary** | `#ffffff` | rgb(255, 255, 255) |
| **Background Card** | `#e8e5e0` | rgb(232, 229, 224) |
| **Text** | `#1f2328` | rgb(31, 35, 40) |
| **Text Muted** | `#656d76` | rgb(101, 109, 118) |
| **Accent (Gold)** | `#8b7320` | rgb(139, 115, 32) |
| **Accent Secondary (Green)** | `#4a6b3a` | rgb(74, 107, 58) |
| **Border** | `#d0d7de` | rgb(208, 215, 222) |

---

## 📐 Pixel Art Guidelines

### Resolution & Grid
- **Pixel Size:** Small, fine pixels (2-4px blocks) - NOT chunky retro style
- **Canvas Sizes:**
  - Featured Image: 1200x630px (social/card) 
  - Thumbnail: 400x300px
  - Square: 600x600px
- **Export:** Always use "nearest neighbor" scaling to keep crisp pixels

### Style Rules
1. **Fine pixel detail** - Small, refined pixels (like modern indie games, not chunky 8-bit)
2. **Sharp edges** - No anti-aliasing, clean blocky outlines
3. **Limited palette** - Stick to 8-12 colors max from the palette above
4. **High contrast** - Dark backgrounds (`#0f1419`) with bright accents (`#c5a93c`, `#7c9a5e`)
5. **Clean & minimal** - Simple iconographic subjects with clear silhouettes
6. **Modern pixel art** - Think Hyper Light Drifter, Celeste - refined, not retro-chunky

---

## 📝 Figma Setup

### Create a Color Styles Library:
1. Create new Figma file: "GiriD Design System"
2. Add color styles:
   - `bg/primary` → #0f1419
   - `bg/secondary` → #1a1f26
   - `bg/card` → #2d2a26
   - `text/primary` → #e6edf3
   - `text/muted` → #8b949e
   - `accent/gold` → #c5a93c
   - `accent/gold-hover` → #d4bc5a
   - `accent/green` → #7c9a5e
   - `border/default` → #30363d
   - `status/success` → #3fb950
   - `status/error` → #f85149

### Font:
- **JetBrains Mono** (install from Google Fonts)
- Weights: 400 (Regular), 700 (Bold)

### Pixel Art Plugin:
- Install "Pixel Perfect" or "Pixelator" from Figma Community

---

## ✨ Quick Reference

**For any featured image:**
1. Start with `#0f1419` background
2. Use `#c5a93c` (gold) for main subject highlights
3. Use `#7c9a5e` (green) for secondary elements
4. Add `#30363d` borders for depth
5. Use `#e6edf3` for any text/bright spots
6. Keep it minimal and blocky

---

## 🎯 AI Prompt Examples

When using AI image generation, include these style keywords:

```
"modern pixel art, fine detailed pixels, small pixel size,
dark background #0f1419, gold accent #c5a93c, green accent #7c9a5e,
clean sharp edges, no anti-aliasing, minimalist icon style,
high contrast, indie game aesthetic"
```

**Avoid:** "16-bit", "8-bit", "retro", "chunky pixels"

---

## 🔗 Figma Color Import

Copy this CSS and use Figma's "Styles from CSS" importer:

```css
:root {
  --bg-primary: #0f1419;
  --bg-secondary: #1a1f26;
  --bg-card: #2d2a26;
  --text-primary: #e6edf3;
  --text-muted: #8b949e;
  --accent-gold: #c5a93c;
  --accent-gold-hover: #d4bc5a;
  --accent-green: #7c9a5e;
  --border: #30363d;
  --success: #3fb950;
  --error: #f85149;
}
```
