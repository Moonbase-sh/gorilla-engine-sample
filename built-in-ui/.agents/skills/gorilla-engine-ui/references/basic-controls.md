# Basic Controls

## geLabel

Display text, images, or act as a container/panel. The most versatile component.

**JSX tag:** `<geLabel />`
**Interfaces:** Common, Bounds, Background, Font, Clickable, Margin, Keyable
**Handlers:** ClickableHandlers, KeyableHandlers

| Prop | Type | Description |
|------|------|-------------|
| `text` | `string \| number` | Display text (updates at runtime) |
| `value` | `any` | Initial text (doesn't update at runtime) |
| `format` | `string` | Text format string |
| `multiLine` | `boolean` | Enable multi-line text |
| `stretchText` | `boolean` | Stretch text to fit bounds |

**As a container/panel:**
```tsx
<geLabel x={0} y={0} width={400} height={300}
  backgroundColor="FF1a1a2e" cornerRadius={8}
  border={{ width: 1, color: "FF444444" }}>
  <geKnob x={10} y={10} width={60} height={60} />
  <geLabel x={80} y={25} width={100} height={20} text="Volume" textColor="FFFFFF" />
</geLabel>
```

**As a text label:**
```tsx
<geLabel x={10} y={10} width={100} height={20}
  text="Hello World" textColor="FFFFFF" fontSize={14} textAlign="center"
/>
```

---

## geButton

Trigger button — fires an action on click, does NOT toggle.

**JSX tag:** `<geButton />`
**Native class:** `GorillaEngine.UI.Trigger`
**Interfaces:** Common, Bounds, Font, Clickable, Background, KeyboardFocus, Keyable
**Handlers:** ClickableHandlers, KeyableHandlers

| Prop | Type | Description |
|------|------|-------------|
| `text` | `string` | Button label text |
| `isDumb` | `boolean` | If true, button has no built-in behavior |
| `images` | `object` | `{ normal?, hover?, down? }` — image paths per state |
| `animation` | `LottieAnimation` | Linked Lottie animation |

**Note:** geButton gets a default `keyboardFocus.color` of `"00000000"` (transparent).

```tsx
<geButton x={10} y={10} width={120} height={35}
  text="Save Preset"
  backgroundColor="FF4444FF" textColor="FFFFFF"
  images={{ normal: 'btn.png', hover: 'btn_hover.png', down: 'btn_down.png' }}
  onClick={() => savePreset()}
/>
```

---

## geKnob

Rotary dial control for numeric values.

**JSX tag:** `<geKnob />`
**Interfaces:** Common, Bounds, Clickable, Background, Skinnable, MIDILearn, Highlight
**Handlers:** ClickableHandlers, `onChange`

| Prop | Type | Description |
|------|------|-------------|
| `text` | `string` | Display text |
| `min` | `number` | Minimum value |
| `max` | `number` | Maximum value |
| `value` | `number` | Current value (between min and max) |
| `stepSize` | `number` | Value increment per interaction step |
| `scrollWheelEnabled` | `boolean` | Allow mouse wheel adjustment |
| `image` | `string` | Single image path (rotated between minRotation/maxRotation) |
| `minRotation` | `number` | Min rotation angle in degrees (for `image` mode) |
| `maxRotation` | `number` | Max rotation angle in degrees (for `image` mode) |
| `inverted` | `boolean` | Invert the control direction |
| `filmstrip` | `object` | `{ path, count, direction? }` — filmstrip animation |

**Filmstrip mode (most common):**
```tsx
<geKnob x={50} y={50} width={60} height={60}
  min={0} max={100} value={50}
  filmstrip={{ path: 'assets/knob.png', count: 128 }}
  onChange={(v) => setVolume(v)}
/>
```

**Single image rotation mode:**
```tsx
<geKnob x={50} y={50} width={60} height={60}
  min={0} max={127} value={64}
  image="assets/knob_pointer.png"
  minRotation={-135} maxRotation={135}
/>
```

---

## geSlider

Linear slider control (horizontal or vertical). Internally a Knob with `type: 'slider'`.

**JSX tag:** `<geSlider />`
**Native class:** `GorillaEngine.UI.Knob` with `type: 'slider'`
**Interfaces:** Same as geKnob + slider-specific props
**Handlers:** ClickableHandlers, `onChange`

| Prop | Type | Description |
|------|------|-------------|
| *(all geKnob props)* | | Inherits knob properties |
| `direction` | `'horizontal' \| 'vertical'` | Slider orientation |
| `thumbImage` | `string` | Path to thumb/handle image |
| `sliderBounds` | `object` | `{ x, y, width, height }` — custom track bounds |

```tsx
<geSlider x={10} y={100} width={200} height={30}
  min={0} max={100} value={75}
  direction="horizontal"
  filmstrip={{ path: 'assets/slider_track.png', count: 128 }}
  thumbImage="assets/slider_thumb.png"
  onChange={(v) => setPan(v)}
/>
```

---

## geToggle

Two-state toggle control (on/off).

**JSX tag:** `<geToggle />`
**Interfaces:** Common, Bounds, Font, Clickable, Background, Highlight, MIDILearn, Margin
**Handlers:** ClickableHandlers, `onChange`

| Prop | Type | Description |
|------|------|-------------|
| `text` | `string` | Label text |
| `value` | `boolean` | Current state |
| `onColor` | `string` | Background color when on |
| `offColor` | `string` | Background color when off |
| `onColorHover` | `string` | Hover color when on |
| `offColorHover` | `string` | Hover color when off |
| `textColorOn` / `textColorOff` | `string` | Text color per state |
| `textColorOnHover` / `textColorOffHover` | `string` | Text hover color per state |
| `onImage` / `offImage` | `string` | Image per state |
| `onImagePressed` / `offImagePressed` | `string` | Pressed image per state |
| `onImageHovered` / `offImageHovered` | `string` | Hover image per state |
| `disabledImage` | `string` | Image when disabled |
| `radioIndex` / `radioValue` | `number` | Radio group behavior |
| `drawTick` | `boolean` | Draw a tick box |
| `fitToText` | `boolean` | Auto-size font to fit bounds |
| `animation` | `LottieAnimation` | Linked Lottie animation |

**Color-based toggle:**
```tsx
<geToggle x={10} y={10} width={60} height={30}
  value={isMuted}
  text="Mute"
  onColor="FFFF4444" offColor="FF444444"
  textColorOn="FFFFFF" textColorOff="AAAAAA"
  onChange={(isOn) => setMuted(isOn)}
/>
```

**Image-based toggle:**
```tsx
<geToggle x={10} y={10} width={40} height={40}
  value={isSolo}
  onImage="solo_on.png" offImage="solo_off.png"
  onChange={(isOn) => setSolo(isOn)}
/>
```

---

## geTextBox

Editable text input.

**JSX tag:** `<geTextBox />`
**Interfaces:** Font, Clickable, Bounds, Background, Margin, Keyable
**Handlers:** KeyableHandlers, `onChange`, `onFocusLost`

| Prop | Type | Description |
|------|------|-------------|
| `text` | `string` | Current text value |
| `placeholder` | `string` | Placeholder text |
| `unit` | `string` | Suffix displayed (doesn't alter value) |
| `placeHolderColor` | `string` | Placeholder text color |
| `caretColor` | `string` | Cursor color |
| `maxLength` | `number` | Max character count |
| `passwordCharacter` | `string` | Mask character for passwords |
| `multiLine` | `boolean` | Allow multiple lines |
| `readOnly` | `boolean` | Disable editing |
| `acceptedDataType` | `string` | `'integer'`, `'int'`, `'float'`, or `'string'` |
| `minValue` / `maxValue` | `number` | Numeric bounds (when numeric type) |
| `textChangedAction` | `string` | ViewModel action on enter (not on change) |
| `focusLostUpdate` | `boolean` | Update on focus lost |

```tsx
<geTextBox x={10} y={10} width={200} height={30}
  text={presetName}
  placeholder="Enter preset name..."
  backgroundColor="FF222222" textColor="FFFFFF"
  fontSize={13}
  onChange={(text) => setPresetName(text)}
  onFocusLost={(text) => savePresetName(text)}
/>
```

**Numeric input:**
```tsx
<geTextBox x={10} y={50} width={80} height={30}
  text="440"
  acceptedDataType="float"
  minValue={20} maxValue={20000}
  unit=" Hz"
  onChange={(text) => setFrequency(parseFloat(text))}
/>
```
