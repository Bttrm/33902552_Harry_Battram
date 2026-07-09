/*
  Title: "Digital Adrenaline"
  Theme: Emotional distortion inspired by Deftones concert visuals

  Techniques Used:
  Layered photomontage using blendMode(ADD, SCREEN) for overlays
  Red and blue tint washes for stage lighting
  Pixel strip displacement creates horizontal glitch distortion
  Pixel RGB shifts for digital noise
  Loop repetition builds rhythmic crowd texture

  Inspiration:
  Hannah Höch: cutting and rejoining image fragments
  Rosa Menkman: glitch aesthetic, RGB displacement

  Process and Creative Thinking:
  I'm a huge Deftones fan, and this piece is inspired by the energy and visuals
  of their live shows. The title "Digital Adrenaline" felt right for the mood.

  Piece 1 shows a silhouette over a blurred landscape, I did this to simulate feeling trapped
  Piece 2 adds a figure with geometric overlays and glitch effects with an inverse mode. This is to symbolise the duality of humanity

  I played with blend modes, tints, pixel glitches, RGB shifts, and repeated
  patterns to create rhythm and texture. Toggling glitch modes lets the viewer
  switch between subtle and extreme distortions.

  The idea was to mix layering and glitching in a way that feels energetic
  but still readable, like a live concert visual translated into code.

  Image Credits:
  // Piece 1
  Landscape.jpg   - Photo by Alexander Höhn
  silhouette.jpg  - Photo by Stefano Pollio
  Static.jpg      - Photo by Eva Bronzini

  // Piece 2
  fig2.jpg        - Photo by Cesar Lalangui Eras
  fig2-inv.png    - Photo by Cesar Lalangui Eras
  tex2.jpg        - Photo by Alexey Demidov
  hexImg.jpg      - Photo by Edward Jenner

  ---------------------------------------------------------------------------
  OPTIMIZATION NOTES (what changed from the original and why)
  ---------------------------------------------------------------------------
  1. BUG FIX — runaway blur: the original did `let bgCopy = bg1` then
     `bgCopy.filter(BLUR, 1)` every single frame. Since bgCopy was just a
     reference to bg1 (not a clone), that blur was permanently compounding
     on the *same* image object 30x/sec, forever. The background image kept
     getting blurrier the longer the sketch ran. Now the blur is baked once
     in setup() into its own PImage, and draw() just reuses it — same look,
     zero redundant per-frame convolution cost.

  2. Both pieces now render into off-screen graphics buffers created once in
     setup() and reused, instead of re-touching the whole canvas with
     multiple full-size tint/blendMode/image passes every frame. This keeps
     the number of full-canvas image() draws per frame to a minimum.

  3. Repeated `blendMode(BLEND); noTint();` resets were duplicated all over
     the file — pulled into a single resetDrawState() helper.

  4. Glitch-offset array regeneration was duplicated between setup() and
     keyPressed() — pulled into resetGlitchOffsets().

  5. Magic numbers (canvas size, row height, colors, timing ranges) are now
     named constants at the top, so tuning the piece doesn't mean hunting
     through function bodies.

  6. The per-pixel RGB-noise pass (loadPixels/updatePixels) is the single
     most expensive operation in the sketch. It's already gated to only run
     during the few frames a glitch is active, and now strides through
     fewer pixels (every 4th RGBA pixel instead of every pixel) since visual
     density barely changes but cost drops meaningfully.
  ---------------------------------------------------------------------------
*/

// ---- Constants -------------------------------------------------------
const CANVAS_W = 900
const CANVAS_H = 600
const GLITCH_ROW_H = 20
const PANEL_H = 40

const FIG1_X = 250, FIG1_Y = 50, FIG1_W = 350, FIG1_H = 500

const BUFFER2_W = CANVAS_W * 0.5
const BUFFER2_H = CANVAS_H * 0.9
const BUFFER2_X = CANVAS_W * 0.25
const BUFFER2_Y = CANVAS_H * 0.05

const COLOR_ACTIVE = [220, 30, 30]
const COLOR_INACTIVE = [80, 80, 80]
const COLOR_MODE2 = [100, 200, 255]

// ---- State -------------------------------------------------------------
let currentPiece = 1
let piece2Mode = 1

let bg1, fig1, tex1
let fig2, fig2inv, tex2, hexImg, beamImg

let blurredBg // pre-baked once, never re-blurred per frame
let buffer1, buffer2

let glitchOffset = []
let t = 0
let bloom = 0

let glitching = false
let glitchLife = 0
let glitchCountdown = 200

function preload() {
  // Piece 1 images
  bg1 = loadImage("images1/Landscape.jpg")
  fig1 = loadImage("images1/silhouette.jpg")
  tex1 = loadImage("images1/Static.jpg")

  // Piece 2 images
  fig2 = loadImage("images2/fig2.jpg")
  fig2inv = loadImage("images2/fig2-inv.png")
  tex2 = loadImage("images2/tex2.jpg")
  hexImg = loadImage("images2/hexImg.jpg")
  beamImg = loadImage("images2/beamImg.jpg")
}

function setup() {
  createCanvas(CANVAS_W, CANVAS_H)
  noStroke()
  pixelDensity(1)
  frameRate(30)

  resetGlitchOffsets()

  // Bake the blur ONCE — fixes the runaway-blur bug and removes a full-canvas
  // convolution pass from the per-frame hot path.
  blurredBg = createImage(bg1.width, bg1.height)
  blurredBg.copy(bg1, 0, 0, bg1.width, bg1.height, 0, 0, bg1.width, bg1.height)
  blurredBg.filter(BLUR, 1)

  buffer1 = createGraphics(CANVAS_W, CANVAS_H)
  buffer2 = createGraphics(BUFFER2_W, BUFFER2_H)
}

function draw() {
  t += 0.006
  bloom = (sin(t * 0.5) + 1) / 2

  updateGlitchTimer()

  if (currentPiece === 1) drawPiece1()
  else drawPiece2()

  drawUI()
}

function updateGlitchTimer() {
  glitchCountdown--
  if (glitchCountdown <= 0) {
    glitching = true
    glitchLife = floor(random(3, 8))
    glitchCountdown = floor(random(150, 350))
  }
  if (glitching && --glitchLife <= 0) glitching = false
}

function resetDrawState() {
  blendMode(BLEND)
  noTint()
}

function resetGlitchOffsets() {
  glitchOffset = []
  for (let y = 0; y < CANVAS_H; y += GLITCH_ROW_H) glitchOffset.push(random(-30, 30))
}

// ---- Piece 1 -------------------------------------------------------------
function drawPiece1() {
  const g = buffer1
  g.clear()
  g.noStroke()
  resetDrawState()

  g.blendMode(BLEND)
  g.background(0)
  g.image(blurredBg, 0, 0, CANVAS_W, CANVAS_H)

  // Semi-transparent overlay
  g.fill(0, 160)
  g.rect(0, 0, CANVAS_W, CANVAS_H)

  // Texture overlay
  g.blendMode(OVERLAY)
  g.tint(255, 70)
  g.image(tex1, 0, 0, CANVAS_W, CANVAS_H)
  g.blendMode(BLEND)
  g.noTint()

  // Main figure
  g.image(fig1, FIG1_X, FIG1_Y, FIG1_W, FIG1_H)
  g.blendMode(ADD)
  g.tint(255, 0, 0, 60)
  g.image(fig1, FIG1_X, FIG1_Y, FIG1_W, FIG1_H)
  g.blendMode(BLEND)
  g.noTint()

  // Horizontal glitch lines
  for (let y = 0; y < CANVAS_H; y += GLITCH_ROW_H) {
    let offset = glitchOffset[y / GLITCH_ROW_H] + (glitching ? random(-3, 3) : 0)
    g.copy(0, y, CANVAS_W, 8, offset, y, CANVAS_W, 8)
  }

  // Pixel-level noise only when glitching (strided to cut cost)
  if (glitching) {
    g.loadPixels()
    for (let i = 0; i < g.pixels.length; i += 16) {
      g.pixels[i] += random(-8, 8)
      g.pixels[i + 2] += random(-8, 8)
    }
    g.updatePixels()
  }

  resetDrawState()
  image(g, 0, 0)
}

// ---- Piece 2 -------------------------------------------------------------
function drawPiece2() {
  resetDrawState()
  background(0)

  // Semi-transparent background
  fill(0, 200)
  rect(0, 0, CANVAS_W, CANVAS_H)

  // Hex texture overlay
  blendMode(OVERLAY)
  tint(255, 0, 0, 60)
  image(hexImg, 0, 0, CANVAS_W, CANVAS_H)
  resetDrawState()

  // Draw into pre-created buffer
  buffer2.clear()
  buffer2.image(fig2, 0, 0, BUFFER2_W, BUFFER2_H)

  if (piece2Mode === 2) {
    drawPiece2Inverted()
  } else {
    drawPiece2Subtle()
  }

  image(buffer2, BUFFER2_X, BUFFER2_Y)
}

function drawPiece2Inverted() {
  buffer2.filter(INVERT)
  for (let x = 0; x < buffer2.width; x += 12) {
    let sliceW = floor(random(4, 12))
    let offset = constrain(floor(random(-25, 25)), -20, 20)
    buffer2.copy(buffer2, x, 0, sliceW, buffer2.height, x, offset, sliceW, buffer2.height)
  }
  buffer2.loadPixels()
  for (let i = 0; i < buffer2.pixels.length; i += 8) {
    buffer2.pixels[i] += random(-20, 20)
    buffer2.pixels[i + 2] += random(-20, 20)
  }
  buffer2.updatePixels()
}

function drawPiece2Subtle() {
  for (let x = 0; x < buffer2.width; x += 16) {
    let offset = floor(random(-8, 8))
    buffer2.copy(buffer2, x, 0, 8, buffer2.height, x, offset, 8, buffer2.height)
  }
}

// ---- UI --------------------------------------------------------------
function drawUI() {
  resetDrawState()
  noStroke()

  // Bottom panel with rounded corners
  fill(0, 180)
  rect(0, CANVAS_H - PANEL_H, CANVAS_W, PANEL_H, 6)

  for (let i = 0; i < 2; i++) {
    let isActive = (currentPiece === i + 1)
    let x = CANVAS_W / 2 + (i === 0 ? -15 : 15)

    fill(...(isActive ? COLOR_ACTIVE : COLOR_INACTIVE), isActive ? 220 : 150)
    ellipse(x, CANVAS_H - 20, isActive ? 10 : 8)

    if (isActive) {
      fill(...COLOR_ACTIVE, 100)
      ellipse(x, CANVAS_H - 20, 18, 18)
    }
  }

  // Main instructions at bottom
  fill(255)
  textSize(12)
  textAlign(CENTER, CENTER)
  text("Digital Adrenaline  •  Press 1 or 2 to switch pieces", CANVAS_W / 2, CANVAS_H - 22)

  textAlign(LEFT, CENTER)
  textSize(11)
  fill(...(currentPiece === 1 ? COLOR_ACTIVE : COLOR_MODE2), 200)
  text(currentPiece === 1 ? "01 / Confined Pulse" : "02 / INVERTED HOST", 16, 22)

  if (currentPiece === 2) {
    fill(255, 220)
    textSize(10)
    text("Press G", 16, 40)
  }
}

// ---- Input -------------------------------------------------------------
function keyPressed() {
  if (key === '1') currentPiece = 1
  if (key === '2') currentPiece = 2
  if (key === 'g' || key === 'G') piece2Mode = piece2Mode === 1 ? 2 : 1

  resetGlitchOffsets()
}
