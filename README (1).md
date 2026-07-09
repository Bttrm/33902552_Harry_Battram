# Digital Adrenaline

An interactive p5.js piece exploring emotional distortion through layered photomontage and glitch aesthetics, inspired by the energy of Deftones concert visuals.

![p5.js](https://img.shields.io/badge/p5.js-1.7.0-ED225D)

## About

This project uses layered blend modes, tint washes, and pixel-level glitch effects to translate the feeling of a live concert visual into code. It's built around two pieces that the viewer can switch between:

- **01 / Confined Pulse** — A silhouette over a blurred landscape, built to simulate a feeling of being trapped.
- **02 / INVERTED HOST** — A figure layered with geometric hex overlays and an invertible glitch mode, symbolizing the duality of humanity.

### Techniques used

- Layered photomontage using `blendMode(ADD, SCREEN)` for overlays
- Red and blue tint washes for stage lighting
- Pixel strip displacement for horizontal glitch distortion
- Pixel-level RGB shifts for digital noise
- Loop repetition to build rhythmic, crowd-like texture

### Inspiration

- **Hannah Höch** — cutting and rejoining image fragments
- **Rosa Menkman** — glitch aesthetics, RGB displacement

## Running it locally

1. Clone the repo
2. Open the folder in VS Code
3. Right-click `index.html` and select **"Open with Live Server"**
4. The sketch will load in the browser with full interactivity

## Controls

| Key | Action |
|-----|--------|
| `1` | Switch to Piece 1 (Confined Pulse) |
| `2` | Switch to Piece 2 (Inverted Host) |
| `G` | Toggle glitch mode on Piece 2 (subtle ↔ inverted) |

## Project structure

```
├── index.html
├── style.css
├── sketch.js
├── images1/
│   ├── Landscape.jpg
│   ├── silhouette.jpg
│   └── Static.jpg
└── images2/
    ├── fig2.jpg
    ├── fig2-inv.png
    ├── tex2.jpg
    ├── hexImg.jpg
    └── beamImg.jpg
```

## Process & creative thinking

I'm a huge Deftones fan, and this piece is inspired by the energy and visuals of their live shows — the title *Digital Adrenaline* felt right for the mood. I played with blend modes, tints, pixel glitches, RGB shifts, and repeated patterns to build rhythm and texture. Toggling glitch modes lets the viewer switch between subtle and extreme distortion, mixing layering and glitching in a way that stays energetic but still readable — like a live concert visual translated into code.

## Image credits

**Piece 1**
- `Landscape.jpg` — Photo by Alexander Höhn
- `silhouette.jpg` — Photo by Stefano Pollio
- `Static.jpg` — Photo by Eva Bronzini

**Piece 2**
- `fig2.jpg` / `fig2-inv.png` — Photo by Cesar Lalangui Eras
- `tex2.jpg` — Photo by Alexey Demidov
- `hexImg.jpg` — Photo by Edward Jenner

Images used under the [Unsplash License](https://unsplash.com/license) / [Pexels License](https://www.pexels.com/license/) — free to use, attribution appreciated and given above.

## License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2026 Harry Battram

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
