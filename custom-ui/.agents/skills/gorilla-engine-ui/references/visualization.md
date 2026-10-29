# Visualization Controls

## geLevelMeter

Audio level meter display.

**JSX tag:** `<geLevelMeter />`
**Interfaces:** Common, Bounds, Background, Skinnable

| Prop | Type | Description |
|------|------|-------------|
| `peakHold` | `boolean` | Display and hold highest peak |
| `logScale` | `boolean` | Use logarithmic scale |
| `fillArea` | `boolean` | Fill area below current level |
| `inverted` | `boolean` | Vertically inverted |
| `stereo` | `boolean` | Display both L/R channels |
| `positionIndicator` | `boolean` | Don't fill area below peak |
| `rampUpFactor` | `number` | Logarithmic scale threshold |
| `rampDownFactor` | `number` | Scaling factor for log mapping below threshold |
| `maxRampDownSpeed` | `number` | Max fall-back speed from peak |
| `min` / `max` | `number` | Scale bounds |
| `levelColor` | `string` | Fill color |
| `peakColor` | `string` | Peak indicator color |
| `indicatorThickness` | `number` | Indicator line thickness |
| `direction` | `string` | `"horizontal"` or `"vertical"` |
| `value` | `any` | Current meter value |

```tsx
<geLevelMeter x={350} y={10} width={20} height={200}
  direction="vertical"
  logScale={true} peakHold={true} fillArea={true}
  levelColor="FF44FF44" peakColor="FFFF4444"
  min={-60} max={6}
  bindings={{ value: 'vm.outputLevel' }}
/>
```

---

## geWaveform

Waveform display with optional drag zones and markers.

**JSX tag:** `<geWaveform />`
**Interfaces:** Common, Bounds, Background, Font, Clickable, Margin
**Handlers:** `onDragzonePositionChanged`

| Prop | Type | Description |
|------|------|-------------|
| `waveformColor` | `string` | Waveform draw color |
| `gradientCenterColor` | `string` | Center gradient color |
| `gradientEndColor` | `string` | End gradient color |
| `horizontalAxisColor` | `string` | Center-line color |
| `waveformUnavailableText` | `string` | Text when no waveform data |
| `waveWidth` | `number` | Width of each wave line |
| `initialXOffset` | `number` | Initial horizontal offset |
| `waveHorizontalSapcing` | `number` | Horizontal spacing between waves |
| `verticalPadding` | `number` | Vertical padding |
| `fitHeight` | `boolean` | Fit waveform to height |
| `paintCenterLine` | `boolean` | Draw center line |
| `value` | `number` | Waveform data value |
| `drawUsingLegacy` | `boolean` | Use legacy draw mode |
| `dragzone` | `object` | Drag zone config (see below) |
| `markers` | `object` | Marker config |

**Drag zone config:**
```tsx
dragzone={{
  x: 0, y: 0, x2: 100, y2: 100,
  leftHandleImage: 'handle_l.png', rightHandleImage: 'handle_r.png',
  backgroundColor: '40FFFFFF',
  overlayColor: '20000000',
  canResize: true, canPan: true, enabled: true,
}}
```

```tsx
<geWaveform x={10} y={10} width={400} height={150}
  backgroundColor="FF111111"
  waveformColor="FF44AAFF"
  horizontalAxisColor="FF333333"
  paintCenterLine={true}
  bindings={{ value: 'vm.waveformData' }}
  onDragzonePositionChanged={(pos) => handleDragZone(pos)}
/>
```

---

## geCurve

Curve visualization with draggable handles.

**JSX tag:** `<geCurve />`
**Interfaces:** Common, Bounds, Background, Font, Clickable

| Prop | Type | Description |
|------|------|-------------|
| `value` | `any` | The curve data |
| `paramPath` | `string` | Bound parameter path |
| `color` | `string` | Curve line color |
| `thickness` | `number` | Curve line thickness |
| `handle` | `object` | `{ value?, color?, cornerRadius?, width?, height?, visible? }` |
| `marking` | `object` | `{ color?, textColor?, thickness?, visible? }` |

```tsx
<geCurve x={10} y={10} width={300} height={200}
  backgroundColor="FF222222"
  color="FF44AAFF" thickness={2}
  handle={{ color: 'FFFFFFFF', width: 10, height: 10, cornerRadius: 5, visible: true }}
  marking={{ color: 'FF666666', thickness: 1, visible: true }}
  bindings={{ value: 'Scripts/0/FilterCurve' }}
/>
```

---

## geAmpEnv

ADSR envelope editor with draggable handles.

**JSX tag:** `<geAmpEnv />`
**Interfaces:** Common, Bounds, Background, Font

| Prop | Type | Description |
|------|------|-------------|
| `attack` | `Partial<AmpItem>` | Attack handle config |
| `decay` | `Partial<AmpItem>` | Decay handle config |
| `sustain` | `Partial<AmpItem>` | Sustain handle config |
| `release` | `Partial<AmpItem>` | Release handle config |
| `curve` | `object` | `{ color?, thickness? }` |

**AmpItem properties:**
| Prop | Type | Description |
|------|------|-------------|
| `color` | `string` | Handle color |
| `size` | `number` | Handle size |
| `cornerRadius` | `number` | Handle corner radius |
| `value` | `number` | Default value |
| `'value&'` | `any` | Value binding (native syntax) |
| `visible` | `boolean` | Show/hide handle |
| `imagePath` | `string` | Handle image |
| `text` | `string` | Handle label text |
| `textColor` | `string` | Handle text color |

```tsx
<geAmpEnv x={10} y={10} width={300} height={150}
  backgroundColor="FF222222"
  curve={{ color: 'FF44AAFF', thickness: 2 }}
  attack={{ color: 'FFFF4444', size: 8, cornerRadius: 4 }}
  decay={{ color: 'FFFF8844', size: 8, cornerRadius: 4 }}
  sustain={{ color: 'FF44FF44', size: 8, cornerRadius: 4 }}
  release={{ color: 'FF4444FF', size: 8, cornerRadius: 4 }}
  bindings={{
    attack: 'Scripts/0/AmpAttack',
    decay: 'Scripts/0/AmpDecay',
    sustain: 'Scripts/0/AmpSustain',
    release: 'Scripts/0/AmpRelease',
  }}
/>
```

---

## geLottieAnimation

Lottie JSON animation player.

**JSX tag:** `<geLottieAnimation />`
**Interfaces:** Common, Bounds
**Handlers:** KeyableHandlers

| Prop | Type | Description |
|------|------|-------------|
| `filePath` | `string` | Path to Lottie JSON file |
| `autoplay` | `boolean` | Start playing automatically |
| `loop` | `boolean` | Loop the animation |

**Read-only properties (via ref):**
- `totalFrames`, `duration`, `currentFrame`

**Methods (via ref):**
- `play()`, `stop()`, `pause()`, `setFrame(frame)`, `setTargetFrame(frame)`
- `setFrameFromLinearTransform(value, min, max)`
- `setProperties(selector, settings)` — modify fill/stroke/transform

```tsx
<geLottieAnimation x={10} y={10} width={200} height={200}
  filePath="assets/loading.json"
  autoplay={true} loop={true}
/>
```

**Controlling via ref:**
```tsx
const animRef = useRef(null);

<geLottieAnimation ref={animRef}
  x={10} y={10} width={100} height={100}
  filePath="assets/indicator.json"
/>

// Later:
animRef.current?.nativeHandle.setFrame(42);
animRef.current?.nativeHandle.setProperties('**', {
  fillColor: [1, 0, 0],
  fillOpacity: 0.5,
});
```
