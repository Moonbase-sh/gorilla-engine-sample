# Base Props (Shared Interfaces)

All GE components compose their props from these base interfaces. Every property in every interface is optional (`Partial<T>`).

## Common

Shared by all components.

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | Unique identifier |
| `visible` | `boolean` | Show/hide the component |
| `enabled` | `boolean` | Enable/disable user input |
| `wantsKeyboardFocus` | `boolean` | Request keyboard focus on activation |
| `clickGrabsKeyboardFocus` | `boolean` | Click transfers keyboard focus |
| `alpha` | `number` | Opacity 0.0 (transparent) to 1.0 (opaque) |
| `alwaysOnTop` | `boolean` | Render above siblings |

## Bounds

Position and size. Used by virtually all components.

| Prop | Type | Description |
|------|------|-------------|
| `x` | `number` | X position (from parent's left edge) |
| `y` | `number` | Y position (from parent's top edge) |
| `width` | `number` | Width in pixels |
| `height` | `number` | Height in pixels |

## Background

Visual background properties.

| Prop | Type | Description |
|------|------|-------------|
| `backgroundImage` | `string` | Image path (takes precedence over color) |
| `backgroundColor` | `string` | Solid color hex string |
| `cornerRadius` | `number` | Rounded corner radius |
| `border` | `object` | `{ width?, color?, focusColor? }` |

## Font

Text rendering properties.

| Prop | Type | Description |
|------|------|-------------|
| `font` | `string` | Font family name |
| `fontSize` | `number` | Font size |
| `fontKerning` | `number` | Character spacing adjustment |
| `textColor` | `string` | Hex color, e.g. `"FFFFFF"`. RGBA prefix: `"80FF0000"` |
| `textAlign` | `string` | One of: `'left'`, `'right'`, `'center'`, `'centered left'`, `'centered right'`, `'top left'`, `'top right'`, `'top center'`, `'bottom left'`, `'bottom right'`, `'bottom center'` |

## Clickable

Mouse interaction properties.

| Prop | Type | Description |
|------|------|-------------|
| `interceptsMouseClicks` | `boolean` | Process mouse events directly |
| `allowClicksOnChildren` | `boolean` | Let children process mouse events |
| `modifiedClickAction` | `string` | Action on Shift/Ctrl+click |
| `doubleClickAction` | `string` | Action on double-click (ViewModel) |
| `mouseEnterAction` | `string` | Action on mouse enter |
| `mouseExitAction` | `string` | Action on mouse exit |
| `clickMask` | `string` | Bitmask for clickable region |
| `mouseCursorType` | `string` | Cursor style: `'normal'`, `'pointing hand'`, `'IBeam'`, `'cross hair'`, `'wait'`, `'dragging hand'`, `'left right resize'`, etc. |

## Skinnable

Filmstrip animation/visual properties (used by knobs, sliders, toggles, pads, etc.).

| Prop | Type | Description |
|------|------|-------------|
| `filmstrip` | `object` | `{ path: string, count: number, direction?: string }` |
| `animation` | `LottieAnimation` | Reference to a linked Lottie animation |

## Margin

Text positioning within a component's container.

| Prop | Type | Description |
|------|------|-------------|
| `margin` | `number \| object` | Uniform number, or `{ left, top, right, bottom, other }` |

## KeyboardFocus

Visual appearance when a component has keyboard focus.

| Prop | Type | Description |
|------|------|-------------|
| `keyboardFocus` | `object` | `{ color?, lineWidth?, cornerRadius? }` |

## Scrollable

Scrollbar styling.

| Prop | Type | Description |
|------|------|-------------|
| `scrollbar` | `object` | `{ background?, track?, thumb? }` — hex color strings |

## MIDILearn

| Prop | Type | Description |
|------|------|-------------|
| `midiLearn` | `object` | `{ enabled: boolean }` |

## Highlight

Automation highlight (AAX only).

| Prop | Type | Description |
|------|------|-------------|
| `highlight` | `object` | `{ drawFilledCircle, lineWidth, x, y, width, height }` |

## Keyable

Keyboard event properties.

| Prop | Type | Description |
|------|------|-------------|
| `keyPressAction` | `string` | ViewModel action on key press |
| `consumeEvent` | `boolean` | Prevent event propagation |

## ReactElementProps

Added by the React reconciler to all components.

| Prop | Type | Description |
|------|------|-------------|
| `key` | `string \| number` | React list reconciliation key |
| `children` | `any` | Nested React child elements |
| `ref` | `RefObject` | Access the underlying `GEComponent` wrapper |
| `bindings` | `object` | `{ [nativePropName]: 'viewModelPath' }` — see [bindings.md](./bindings.md) |

## Interface Composition per Component

Each component type combines a subset of these interfaces:

| Component | Interfaces |
|-----------|-----------|
| geKnob | Common, Bounds, Clickable, Background, Skinnable, MIDILearn, Highlight |
| geSlider | Same as geKnob + `direction`, `thumbImage` |
| geLabel | Common, Bounds, Background, Font, Clickable, Margin, Keyable |
| geButton | Common, Bounds, Font, Clickable, Background, KeyboardFocus, Keyable |
| geToggle | Common, Bounds, Font, Clickable, Background, Highlight, MIDILearn, Margin |
| geTextBox | Font, Clickable, Bounds, Background, Margin, Keyable |
| geComboBox | Common, Bounds, Background, Clickable, Font, Highlight |
| gePad | Common, Bounds, Background, KeyboardFocus, Clickable, Skinnable, Font |
| geScrollView | Common, Bounds, Scrollable |
| geMidiKeyboard | Common, Bounds, Background |
| geLevelMeter | Common, Bounds, Background, Skinnable |
| geWaveform | Common, Bounds, Background, Font, Clickable, Margin |
| geCurve | Common, Bounds, Background, Font, Clickable |
| geAmpEnv | Common, Bounds, Background, Font |
| geListBox | Common, Bounds, Font, Clickable, Background, Scrollable, Highlight, MIDILearn |
| geLottieAnimation | Common, Bounds |
| geXYPad | Common, Bounds, Clickable, Background |
| geRubberband | Common, Bounds |
| geMappingEditor | Common, Bounds, Background, Clickable |
| geSliceEditor | Common, Bounds, Background, Clickable |
| geStepEditor | Common, Background, Bounds, Clickable |
| geBarStepEditor | Common, Bounds, Background, Clickable |
| geDragContainer | Common, Bounds, Clickable |
| geDragTarget | Common, Bounds, Clickable |
| geDropZone | Common, Bounds, Clickable |
| geTagBrowser | Common, Bounds, Background, Font |
| geTagEditor | Common, Bounds, Background, Font |
