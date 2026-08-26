# Master Prompt Framework: Premium Animation & Interaction Upgrade ("Creatiwise" Clone)

**Document Type:** AI Developer Instruction Set (Ready for Google Docs)  
**Target AI:** Stitch (Front-End & Creative Motion Developer)  

---

### Instructions for Stitch
*Copy and paste the following master prompt to Stitch to upgrade the static "Creatiwise" layout with high-end, premium animations and interactive hover states:*

---

```markdown
# Role & Objective
You are Stitch, an expert front-end developer and creative motion designer. Your task is to take the existing structure of the "Creatiwise" B2B creative agency landing page and inject it with an ultra-premium, buttery-smooth animation ecosystem. You must utilize GSAP (GreenSock) to implement tactile hover micro-interactions, magnetic buttons, and staggered scroll-triggered reveals that elevate the playful, monochromatic design into an award-winning web experience.

---

## Phase 1: Fluid Page Load & Pre-loader Sequence

### 1. The Loading Curtain: Implement a seamless page load transition.
- **Initial State**: A solid black (`#0B0B0B`) overlay blocks the screen (`z-index: 9999`) with a white, hand-drawn SVG star doodle rotating slowly in the absolute center.
- **The Reveal**: Once the DOM is loaded, the black curtain must smoothly slide up (`yPercent: -100`) using a dramatic easing function (`expo.inOut` over `1.5s`), revealing the hero section underneath.
- **Hero Text Stagger**: Immediately as the curtain lifts, use GSAP `SplitText` to reveal the massive `"WE CRAFT BRANDS & DIGITAL EXPERIENCES"` headline. The words must slide up from an invisible mask (`y: 100%, opacity: 0` to `y: 0%, opacity: 1`) in a rapid, fluid stagger.

---

## Phase 2: Premium Scroll-Triggered Animations (GSAP)

### 1. Staggered Section Entrances
- Every major section (*About Us, How we work, Services, Portfolio*) must be bound to a GSAP `ScrollTrigger`.
- As a section enters 15% into the viewport, its inner elements (headers, text blocks) must animate upward (`y: 40px to 0`) and fade in (`opacity: 0 to 1`) using a soft, premium spring or `power3.out` ease.

### 2. Dynamic SVG Drawing
- The hand-drawn SVG doodles (arrows, underlines, squiggles) and the dashed connection line in the *"How we work"* section must not just appear.
- Use GSAP's `DrawSVG` plugin (or a custom `stroke-dashoffset` animation) to literally "draw" the lines onto the screen in real-time as the user scrolls past them.

### 3. Image Reveal Masks
- When the large portrait images and portfolio thumbnails scroll into view, reveal them using a dynamic CSS `clip-path` animation (e.g., expanding from an inset strip to full size) to mimic high-end editorial transitions.

---

## Phase 3: Tactile Hover Micro-Interactions

### 1. Magnetic UI Elements
- Apply a custom magnetic physics effect to all pill-shaped CTA buttons (like *"Contact Us"* and *"Let's talk"*).
- When the user's cursor enters the button's bounding box, the button must physically pull toward the cursor, springing back to its origin on `mouseleave`.

### 2. Luggage Tag 3D Tilt ("How we work")
- When the user hovers over the physical-looking *"Process"* cards, apply a subtle CSS 3D transformation.
- The cards should gently lift off the page (`y: -10px, scale: 1.02`), increase their drop shadow intensity, and slightly rotate (`rotateZ: 2deg`) to feel like real paper tags reacting to touch.

### 3. Dark Mode Service Cards
- When hovering over the minimalist service cards in the black section, trigger a subtle inner white glow (`box-shadow: inset 0 0 20px rgba(255,255,255,0.05)`) and cause the white outline icon to execute a quick, playful bounce (`scale: 1.15` then back to `1`).

### 4. Portfolio Image Zoom
- Hovering over any project thumbnail in the portfolio grid must cause the interior image to slowly and smoothly scale up (`scale: 1.08`) while the container's extremely rounded borders (`border-radius: 24px`) strictly clip the overflow.

---

## Phase 4: Image Asset Directives (Strict Adherence)
- Ensure all portrait and team placeholder images reflect a realistic photographic style featuring natural lighting.
- Avoid randomly generated CGI environments or strictly sun-drenched settings; replicate the authentic, unretouched look of how real editorial and agency team photos are shot.
- Curate images utilizing candid angles (such as a shot taken from across a table) that embrace natural flaws to replicate an authentic look.
- Every image prompt must explicitly detail the model's pose, ensuring a diverse, highly detailed mix of standing poses (e.g., leaning against a studio wall, mid-stride) and sitting poses (e.g., draped over a chair, collaboratively gathered around a laptop).
- *Note:* Some team images in the design should be strictly grayscale.

---

## Phase 5: Technical Constraints & Output
- **Single Output**: Provide exactly one complete, definitive set of HTML, CSS, and JS code. Do not output multiple variations or alternative design options.
- **Engine**: Exclusively use GSAP (GreenSock) and ScrollTrigger for the core motion engine to guarantee cross-browser 60fps performance.
- **Performance**: Force hardware acceleration (`will-change: transform, opacity, clip-path`) on all animated interactive cards and hero text elements. Disable the heavy hover (magnetic buttons, 3D tilts) and cursor-tracking animations on mobile devices (`max-width: 768px`) to ensure touch interaction remains flawless.
```
