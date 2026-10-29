# Container Controls

## geScrollView

Scrollable container for child components.

**JSX tag:** `<geScrollView />`
**Interfaces:** Common, Bounds, Scrollable
**Handlers:** `onScrollPositionX`, `onScrollPositionY`, `onScrollPosition`

| Prop | Type | Description |
|------|------|-------------|
| `scrollbarThickness` | `number` | Scrollbar width in pixels |
| `hideVerticalScrollbar` | `boolean` | Hide vertical scrollbar |
| `hideHorizontalScrollbar` | `boolean` | Hide horizontal scrollbar |
| `ignoreKeypressEvent` | `boolean` | Ignore keyboard events |
| `scrollbar` | `object` | `{ background?, track?, thumb? }` — color strings |

**Methods (via ref → nativeHandle):**
- `scrollChildIntoView(childIndex)` — Scroll to make a child visible
- `setScrollPositionProportionately(xPos, yPos)` — Set scroll position (0-1)

```tsx
<geScrollView x={10} y={10} width={300} height={400}
  hideHorizontalScrollbar={true}
  scrollbar={{ background: 'FF222222', thumb: 'FF666666', track: 'FF333333' }}
  onScrollPositionY={(pos) => setScrollY(pos)}
>
  {/* Children can exceed the scroll view bounds */}
  {presets.map((preset, i) => (
    <geLabel key={i} x={0} y={i * 30} width={280} height={28}
      text={preset.name} textColor="FFFFFF"
      backgroundColor={i % 2 === 0 ? 'FF2a2a2a' : 'FF333333'}
      onClick={() => loadPreset(preset)}
    />
  ))}
</geScrollView>
```

---

## geDragContainer

Wraps content that can be dragged.

**JSX tag:** `<geDragContainer />`
**Interfaces:** Common, Bounds, Clickable
**Handlers:** ClickableHandlers, `onDragging`, `onDragStart`, `onDragEnd`

| Prop | Type | Description |
|------|------|-------------|
| `dragGroup` | `string` | Drag group ID (must match target's dragGroup) |
| `dragContent` | `string` | Data to transfer during drag |
| `externalDragStartAction` | `string` | ViewModel action on external drag start |
| `externalDragEndAction` | `string` | ViewModel action on external drag end |
| `destinationCanMoveDraggedFiles` | `boolean` | Allow destination to move files |
| `externallyDraggedFiles` | `any` | Files being dragged externally |

```tsx
<geDragContainer x={10} y={10} width={100} height={40}
  dragGroup="presets"
  dragContent={JSON.stringify(presetData)}
  onDragStart={() => setDragging(true)}
  onDragEnd={() => setDragging(false)}
>
  <geLabel x={0} y={0} width={100} height={40}
    text="Drag me" backgroundColor="FF444488" textColor="FFFFFF"
  />
</geDragContainer>
```

---

## geDragTarget

Drop target for items from a geDragContainer.

**JSX tag:** `<geDragTarget />`
**Interfaces:** Common, Bounds, Clickable
**Handlers:** ClickableHandlers, `onItemDropped`

| Prop | Type | Description |
|------|------|-------------|
| `dragGroup` | `string` | Must match the source's dragGroup |

```tsx
<geDragTarget x={200} y={10} width={150} height={100}
  dragGroup="presets"
  onItemDropped={(data) => handleDrop(data)}
>
  <geLabel x={0} y={0} width={150} height={100}
    text="Drop here" backgroundColor="FF334433" textColor="FFFFFF"
    textAlign="center"
  />
</geDragTarget>
```

---

## geDropZone

Drop zone for files dragged from outside the application.

**JSX tag:** `<geDropZone />`
**Interfaces:** Common, Bounds, Clickable
**Handlers:** ClickableHandlers, `onDraggedFiles`, `onDroppedFiles`

| Prop | Type | Description |
|------|------|-------------|
| `acceptedFileTypes` | `string[] \| string` | Allowed file extensions |

```tsx
<geDropZone x={10} y={10} width={300} height={200}
  acceptedFileTypes={['.wav', '.aiff', '.mp3']}
  onDraggedFiles={(files) => setDragOver(true)}
  onDroppedFiles={(files) => importSamples(files)}
>
  <geLabel x={0} y={0} width={300} height={200}
    text="Drop audio files here"
    backgroundColor={isDragOver ? 'FF445544' : 'FF333333'}
    textColor="FFFFFF" textAlign="center"
  />
</geDropZone>
```

---

## geRubberband

Container that forwards mouse-down events to its children as if each was individually clicked. Useful for graphic EQs where the user drags across multiple sliders.

**JSX tag:** `<geRubberband />`
**Interfaces:** Common, Bounds

No additional props beyond Common and Bounds.

```tsx
<geRubberband x={10} y={10} width={400} height={200}>
  {bands.map((band, i) => (
    <geSlider key={i}
      x={i * 25} y={0} width={20} height={200}
      direction="vertical"
      min={-12} max={12} value={band.gain}
      filmstrip={{ path: 'eq_slider.png', count: 64 }}
      onChange={(v) => setBandGain(i, v)}
    />
  ))}
</geRubberband>
```
