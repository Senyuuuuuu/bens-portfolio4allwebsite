---
name: dotlottie-web
description: >-
  Implement Lottie animations using dotLottie runtimes (@lottiefiles/dotlottie-web
  and @lottiefiles/dotlottie-react). Use when building, debugging, or optimizing
  dotLottie or Lottie animations in web projects, including vanilla JS, React,
  and Next.js. Covers package selection, Web Workers, state machines, theming,
  dynamic slot overriding, performance best practices, and common patterns.
license: MIT
metadata:
  author: lottiefiles
  version: "1.0.0"
  source: "https://github.com/LottieFiles/dotlottie-web"
---

# dotLottie Implementation Guidelines

You are an expert at implementing Lottie animations using dotLottie runtimes. Follow these guidelines when working with dotLottie in web projects.

## Package Selection

### Use `@lottiefiles/dotlottie-web` when:

* You need direct canvas control
* Building framework-agnostic code
* Maximum performance is critical
* You want the smallest bundle

### Use `@lottiefiles/dotlottie-react` when:

* Building React applications
* You want declarative component API
* You need React lifecycle integration

## Installation

```bash
# Web (vanilla JS, Vue, Svelte, etc.)
npm install @lottiefiles/dotlottie-web

# React
npm install @lottiefiles/dotlottie-react
```

## Basic Implementation

### Vanilla JavaScript

```typescript
import { DotLottie } from '@lottiefiles/dotlottie-web';

const dotLottie = new DotLottie({
  canvas: document.getElementById('canvas') as HTMLCanvasElement,
  src: 'https://example.com/animation.lottie',
  autoplay: true,
  loop: true,
});
```

### React

```tsx
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

function Animation() {
  return (
    <DotLottieReact
      src="https://example.com/animation.lottie"
      autoplay
      loop
    />
  );
}
```

### React with Instance Control

```tsx
import { useRef } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type { DotLottie } from '@lottiefiles/dotlottie-web';

function Animation() {
  const dotLottieRef = useRef<DotLottie | null>(null);

  return (
    <DotLottieReact
      src="https://example.com/animation.lottie"
      dotLottieRefCallback={(dotLottie) => (dotLottieRef.current = dotLottie)}
    />
  );
}
```

## .lottie vs .json

**Always prefer `.lottie` format over `.json`:**

* Smaller file size (compressed)
* Supports multiple animations in one file
* Embedded assets (images, fonts)
* State machines for interactivity
* Theming with slots

## Web Workers (Recommended for Performance)

Use `DotLottieWorker` to offload animation rendering to a Web Worker, keeping the main thread free for UI interactions:

### Basic Worker Usage

```typescript
import { DotLottieWorker } from '@lottiefiles/dotlottie-web';

const dotLottie = new DotLottieWorker({
  canvas: document.getElementById('canvas') as HTMLCanvasElement,
  src: 'https://example.com/animation.lottie',
  autoplay: true,
  loop: true,
});
```

### Worker Grouping (Multiple Animations)

By default, all `DotLottieWorker` instances share the same worker. Group animations into separate workers using `workerId`:

```typescript
// Hero animation in its own worker
const heroAnimation = new DotLottieWorker({
  canvas: heroCanvas,
  src: 'hero.lottie',
  workerId: 'hero-worker',
});

// UI animations share a different worker
const buttonAnimation = new DotLottieWorker({
  canvas: buttonCanvas,
  src: 'button.lottie',
  workerId: 'ui-worker',
});
```

### When to Use Workers

* **Use `DotLottieWorker`** for:
  * Multiple simultaneous animations
  * Complex animations with many layers
  * Animations running alongside heavy JS operations
  * Mobile devices where main thread performance is critical

* **Use regular `DotLottie`** for:
  * Single simple animations
  * When you need synchronous frame access
  * SSR environments (workers not available)

### React with Workers

```tsx
import { DotLottieWorkerReact } from '@lottiefiles/dotlottie-react';

function Animation() {
  return (
    <DotLottieWorkerReact
      src="animation.lottie"
      autoplay
      loop
      workerId="my-worker" // Optional: dedicate to specific worker
    />
  );
}
```

## State Machines (Interactivity)

State machines enable interactive animations without code:

```typescript
const dotLottie = new DotLottie({
  canvas,
  src: 'interactive.lottie', // Contains state machine
  autoplay: true,
});

// Fire events to trigger state transitions
dotLottie.stateMachineFireEvent('click');
dotLottie.stateMachineFireEvent('hover');
dotLottie.stateMachineFireEvent('custom-event');

// Set numeric/boolean/string inputs for state conditions
dotLottie.stateMachineSetNumericInput('progress', 0.5);
dotLottie.stateMachineSetBooleanInput('isActive', true);
dotLottie.stateMachineSetStringInput('mode', 'dark');
```

### State Machine Events

* `click` - User click/tap
* `hover` - Mouse enter
* `unhover` - Mouse leave
* `complete` - Animation finished
* Custom events defined in the state machine

## Theming with Slots

Slots allow runtime color/value customization:

```typescript
const dotLottie = new DotLottie({
  canvas,
  src: 'themed.lottie',
  themeId: 'dark-mode', // Use embedded theme by ID
});

// Or apply theme data directly (JSON string per dotLottie 2.0 spec)
dotLottie.setThemeData(JSON.stringify({
  rules: [
    { id: 'primary-color', value: [1, 0.34, 0.13] }, // RGB values 0-1
  ]
}));
```

## Dynamic Slot Overriding

Slots enable runtime customization of animated properties using typed APIs.
Available slot types: `color`, `scalar`, `vector`, `gradient`, `text`, `image`.

Key APIs: `getSlotIds()`, `getSlotType()`, `setColorSlot()`, `setScalarSlot()`,
`setVectorSlot()`, `setGradientSlot()`, `setTextSlot()`, `resetSlot()`, `clearSlots()`.

For complete reference with code examples, see [Dynamic Slots Reference](references/dynamic-slots.md).

## Markers & Segments

### Playing Specific Segments

```typescript
// Play frames 0-60
dotLottie.setSegment(0, 60);
dotLottie.play();

// Play by marker name (defined in animation)
dotLottie.setMarker('intro');
dotLottie.play();
```

### Getting Markers

```typescript
const markers = dotLottie.markers();
// Returns: [{ name: 'intro', time: 0, duration: 60 }, ...]
```

## Rendering a Specific Frame to an Image

Set `autoplay: false` so playback doesn't advance past your target, then call `setFrame()` after `load`. `setFrame()` renders synchronously.

### Browser

```typescript
const dotLottie = new DotLottie({ canvas, src: 'animation.lottie', autoplay: false });

dotLottie.addEventListener('load', () => {
  dotLottie.setFrame(42);                        // render frame 42
  const dataUrl = canvas.toDataURL('image/png'); // or canvas.toBlob(cb, 'image/png')
});
```

### Node.js (`@napi-rs/canvas`)

```typescript
import fs from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';

const canvas = createCanvas(200, 200);
const dotLottie = new DotLottie({
  canvas: canvas as unknown as HTMLCanvasElement,
  src: 'animation.lottie',
  autoplay: false,
});

dotLottie.addEventListener('load', async () => {
  dotLottie.setFrame(42);
  fs.writeFileSync('frame-42.png', await canvas.encode('png'));
  dotLottie.destroy();
});
```

## Event Handling

```typescript
dotLottie.addEventListener('load', () => {
  console.log('Animation loaded');
});

dotLottie.addEventListener('play', () => {
  console.log('Playing');
});

dotLottie.addEventListener('complete', () => {
  console.log('Animation completed');
});

dotLottie.addEventListener('frame', ({ currentFrame }) => {
  console.log('Frame:', currentFrame);
});

// Clean up
dotLottie.removeEventListener('load', handler);
```

## Performance Best Practices

### 1. Use Web Workers for Complex Animations

```typescript
import { DotLottieWorker } from '@lottiefiles/dotlottie-web';

const dotLottie = new DotLottieWorker({
  canvas,
  src: 'complex-animation.lottie',
});
```

### 2. Lazy Load Animations

```typescript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadAnimation();
      observer.disconnect();
    }
  });
});
observer.observe(container);
```

### 3. Auto-Freeze Offscreen Animations

DotLottie automatically freezes animations offscreen.

### 4. Frame Interpolation Control

```typescript
const dotLottie = new DotLottie({
  canvas,
  src: 'animation.lottie',
  useFrameInterpolation: true,  // Smooth playback (default)
});
```

### 5. Multi-Animation Files

```typescript
dotLottie.loadAnimation('animation-2');
const animations = dotLottie.manifest?.animations;
```

## SSR / Next.js Considerations

```tsx
import dynamic from 'next/dynamic';

const DotLottieReact = dynamic(
  () => import('@lottiefiles/dotlottie-react').then(mod => mod.DotLottieReact),
  { ssr: false }
);

function Animation() {
  return <DotLottieReact src="animation.lottie" autoplay loop />;
}
```
