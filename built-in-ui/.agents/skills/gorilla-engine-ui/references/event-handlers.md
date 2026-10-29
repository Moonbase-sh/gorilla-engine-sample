# Event Handlers

Event handlers connect React callback props to native Gorilla Engine events.

## ClickableHandlers

Available on most interactive components (geKnob, geSlider, geButton, geToggle, geComboBox, gePad, geLabel, geXYPad, geDragContainer, geDragTarget, geDropZone, geMappingEditor, etc.).

| React Prop | Native Event | Signature |
|------------|-------------|-----------|
| `onClick` | `click` | `(args) => void` |
| `onClickWithInfo` | `clickWithInfo` | `(args) => void` — includes hit-test info |
| `onDoubleClick` | `doubleClick` | `(args) => void` |
| `onMouseUp` | `mouseUp` | `(args) => void` |
| `onMouseDown` | `mouseDown` | `(args) => void` |
| `onMouseDownWithInfo` | `mouseDownWithInfo` | `(args) => void` — includes hit-test info |
| `onMouseDrag` | `mouseDrag` | `(args) => void` |
| `onMouseEnter` | `mouseEnter` | `(args) => void` |
| `onMouseExit` | `mouseExit` | `(args) => void` |

```tsx
<geLabel
  x={0} y={0} width={100} height={40}
  text="Click me"
  onClick={() => console.log('clicked')}
  onMouseEnter={() => console.log('hover')}
/>
```

## KeyableHandlers

Available on geButton, geLabel, geLottieAnimation.

| React Prop | Native Event | Signature |
|------------|-------------|-----------|
| `onKeyPressed` | `keyPressed` | `(args) => void` |

```tsx
<geButton
  x={0} y={0} width={100} height={30}
  text="Press Enter"
  wantsKeyboardFocus={true}
  onKeyPressed={(e) => console.log('key:', e)}
/>
```

## Component-Specific Handlers

### geKnob / geSlider — `onChange`
Maps to native `value` event. Fires when the control value changes.

```tsx
<geKnob
  x={0} y={0} width={60} height={60}
  min={0} max={100} value={50}
  onChange={(value) => console.log('new value:', value)}
/>
```

### geToggle — `onChange`
Maps to native `value` event. Receives a boolean.

```tsx
<geToggle
  x={0} y={0} width={60} height={30}
  value={false}
  onChange={(isOn: boolean) => console.log('toggled:', isOn)}
/>
```

### geComboBox — `onChange`
Maps to native `value` event. Receives the selected index.

```tsx
<geComboBox
  x={0} y={0} width={150} height={30}
  items={['Option A', 'Option B', 'Option C']}
  value={0}
  onChange={(index: number) => console.log('selected:', index)}
/>
```

### geTextBox — `onChange` / `onFocusLost`
- `onChange` maps to native `text` event (fires on each change)
- `onFocusLost` maps to native `focusLost` event

```tsx
<geTextBox
  x={0} y={0} width={200} height={30}
  text="Hello"
  onChange={(text: string) => console.log('text:', text)}
  onFocusLost={(text: string) => console.log('committed:', text)}
/>
```

### geScrollView — Scroll position handlers

| React Prop | Native Event |
|------------|-------------|
| `onScrollPositionX` | `scrollPositionX` |
| `onScrollPositionY` | `scrollPositionY` |
| `onScrollPosition` | `scrollPosition` |

### geSliceEditor — Slice/modulation handlers

| React Prop | Native Event |
|------------|-------------|
| `onSliceAdded` | `sliceAdded` |
| `onSliceChanged` | `sliceChanged` |
| `onSlicesRemoved` | `slicesRemoved` |
| `onModulationChanged` | `modulationChanged` |
| `onMarkerChanged` | `markerChanged` |
| `onScroll` | `scroll` |
| `onPinch` | `pinch` |

### geWaveform — `onDragzonePositionChanged`
Maps to native `dragzonePosition` event.

### geListBox — `onRowClicked`
Maps to native `rowClicked` event.

### geDragContainer — Drag handlers

| React Prop | Native Event |
|------------|-------------|
| `onDragging` | `dragPosition` |
| `onDragStart` | `dragStarted` |
| `onDragEnd` | `dragEnded` |

### geDragTarget — `onItemDropped`
Maps to native `drop` event.

### geDropZone — File drop handlers

| React Prop | Native Event |
|------------|-------------|
| `onDraggedFiles` | `draggedFiles` |
| `onDroppedFiles` | `droppedFiles` |

### geMappingEditor — Zone/key handlers

| React Prop | Native Event |
|------------|-------------|
| `onSelectedZone` | `zoneSelected` |
| `onKeyPressed` | `keyPressed` |
| `onChangedZone` | `zoneChanged` |

## Event Handler Update Behavior

When a handler prop changes between renders, the reconciler updates the stored callback reference without detaching/re-attaching the native event listener. The native event dispatches to the latest callback.
