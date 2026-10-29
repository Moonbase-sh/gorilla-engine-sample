# Advanced Controls

## geComboBox

Dropdown selection list.

**JSX tag:** `<geComboBox />`
**Interfaces:** Common, Bounds, Background, Clickable, Font, Highlight
**Handlers:** ClickableHandlers, `onChange`

| Prop | Type | Description |
|------|------|-------------|
| `value` | `number` | Selected index |
| `items` | `string[]` | List of options |
| `levelSeperator` | `string` | Character for nested submenus (e.g. `"/"`) |
| `stretchText` | `boolean` | Stretch text to fit width |
| `scrollWheelEnabled` | `boolean` | Navigate items with scroll wheel |
| `styleSubmenu` | `boolean` | Apply distinct submenu styling |
| `backgroundColorClicked` | `string` | Color when popup is open |
| `backgroundColorHover` | `string` | Color on hover |
| `itemReselectedAction` | `string` | ViewModel action when same item is reselected |
| `padding` | `number \| object` | `{ left, top, right, bottom }` |
| `images` | `object` | Arrow/checkmark/submenu images (see below) |
| `popup` | `object` | Popup styling (see below) |
| `subPopup` | `object` | Sub-popup styling |

**Images object:**
```tsx
images={{
  arrowIcon: 'arrow.png',
  arrowIconPressed: 'arrow_pressed.png',
  popupCheckmarkImage: 'check.png',
  popupCheckmarkHighlightedImage: 'check_hl.png',
}}
```

**Popup styling object:**
```tsx
popup={{
  backgroundColor: 'FF333333',
  itemTextColor: 'FFFFFF',
  itemSelectedTextColor: 'FFFF00',
  itemSelectedBackgroundColor: 'FF555555',
  itemHighlightedTextColor: 'FFFFFF',
  itemHighlightedBackgroundColor: 'FF4444FF',
  checkmarkFloat: 'left',
  cornerRadius: 4,
  padding: { left: 5, top: 5, right: 5, bottom: 5 },
}}
```

```tsx
<geComboBox x={10} y={10} width={150} height={30}
  items={['Sine', 'Saw', 'Square', 'Triangle']}
  value={waveform}
  backgroundColor="FF333333" textColor="FFFFFF"
  onChange={(index) => setWaveform(index)}
/>
```

**With submenus:**
```tsx
<geComboBox x={10} y={10} width={200} height={30}
  items={['Oscillators/Sine', 'Oscillators/Saw', 'Filters/LowPass', 'Filters/HighPass']}
  levelSeperator="/"
  value={0}
  onChange={(index) => setType(index)}
/>
```

---

## geXYPad

2D control surface for adjusting two parameters simultaneously.

**JSX tag:** `<geXYPad />`
**Interfaces:** Common, Bounds, Clickable, Background
**Handlers:** ClickableHandlers

| Prop | Type | Description |
|------|------|-------------|
| `valueX` | `number` | Current X value |
| `valueY` | `number` | Current Y value |
| `minX` / `maxX` | `number` | X axis range |
| `minY` / `maxY` | `number` | Y axis range |
| `stepSizeX` / `stepSizeY` | `number` | Step sizes |
| `snapsToMousePosition` | `boolean` | Snap thumb to click position |
| `thumbImage` | `string` | Path to thumb image |

```tsx
<geXYPad x={10} y={10} width={200} height={200}
  valueX={64} valueY={64}
  minX={0} maxX={127} minY={0} maxY={127}
  backgroundColor="FF222222"
  thumbImage="assets/xy_thumb.png"
  bindings={{ valueX: 'Scripts/0/PanX', valueY: 'Scripts/0/PanY' }}
/>
```

---

## geMidiKeyboard

On-screen MIDI keyboard.

**JSX tag:** `<geMidiKeyboard />`
**Interfaces:** Common, Bounds, Background

| Prop | Type | Description |
|------|------|-------------|
| `lowKey` | `number` | First MIDI note to display |
| `highKey` | `number` | Last MIDI note to display |
| `disableNKSColors` | `boolean` | Disable NKS color mapping |
| `keys` | `object` | Key appearance configuration (see below) |

**Keys configuration:**
```tsx
keys={{
  blackColor: 'FF333333',
  blackHoverColor: 'FF555555',
  blackPressedColor: 'FF777777',
  blackOutlineColor: 'FF000000',
  whiteColor: 'FFEEEEEE',
  whiteHoverColor: 'FFCCCCCC',
  whitePressedColor: 'FFAAAAAA',
  whiteOutlineColor: 'FF888888',
  whiteHeight: 80,
  blackHeight: 50,
  spacing: 1,
  outlineWidth: 1,
  cornerRadius: 2,
}}
```

```tsx
<geMidiKeyboard x={0} y={400} width={800} height={100}
  lowKey={36} highKey={84}
  backgroundColor="FF111111"
  keys={{
    whiteColor: 'FFEEEEEE',
    blackColor: 'FF333333',
    whitePressedColor: 'FF4488FF',
    blackPressedColor: 'FF4488FF',
  }}
/>
```

---

## gePad

MIDI trigger pad — fires note on/off events on click.

**JSX tag:** `<gePad />`
**Interfaces:** Common, Bounds, Background, KeyboardFocus, Clickable, Skinnable, Font
**Handlers:** ClickableHandlers

| Prop | Type | Description |
|------|------|-------------|
| `midiNote` | `number` | MIDI note number (0-127) |
| `velocity` | `number` | Velocity when pressed (0-127) |
| `padState` | `boolean` | Visual pressed/playing state |
| `images` | `object` | `{ normal?, hover?, down? }` — image paths |

**Note:** gePad gets a default `keyboardFocus.color` of `"00000000"` (transparent).

```tsx
<gePad x={10} y={10} width={60} height={60}
  midiNote={60} velocity={100}
  backgroundColor="FF444444"
  images={{
    normal: 'pad.png',
    hover: 'pad_hover.png',
    down: 'pad_down.png',
  }}
  onClick={() => console.log('pad hit')}
/>
```

**Pad grid example:**
```tsx
{[0, 1, 2, 3].map(row =>
  [0, 1, 2, 3].map(col => (
    <gePad key={`${row}-${col}`}
      x={col * 70} y={row * 70}
      width={60} height={60}
      midiNote={36 + row * 4 + col}
      velocity={100}
      backgroundColor="FF444444"
    />
  ))
)}
```
