# Editor Controls

## geSliceEditor

Sample slice editor with grid, markers, modulation, and zoom.

**JSX tag:** `<geSliceEditor />`
**Interfaces:** Common, Bounds, Background, Clickable
**Handlers:** `onSliceAdded`, `onSliceChanged`, `onSlicesRemoved`, `onModulationChanged`, `onMarkerChanged`, `onScroll`, `onPinch`

| Prop | Type | Description |
|------|------|-------------|
| `slices` | `any` | Slice data |
| `audioLengthInSamples` | `number` | Total audio length in samples |
| `audioLengthInBeats` | `number` | Total audio length in beats |
| `minSliceSpacing` | `number` | Minimum space between slices |
| `minMarkerSpacing` | `number` | Minimum space between markers |
| `canChangeSlices` | `boolean` | Allow editing slices |
| `canAddSlices` | `boolean` | Allow adding slices |
| `canRemoveSlices` | `boolean` | Allow removing slices |
| `snapSlicesToGrid` | `boolean` | Snap slices to grid |
| `zoom` | `object` | `{ start, end, dragToZoomFactor, dragToZoomEnabled }` |
| `grid` | `object` | Grid configuration (see below) |
| `sliceStyles` | `object` | `{ normal, hover, selected }` — each with `{ y, xOffset, width, height, color, image }` |
| `selectionAreaStyle` | `object` | `{ backgroundColor, enabled, border: { width, radius, color } }` |

**Grid configuration:**
```tsx
grid={{
  position: 'top',
  height: 20,
  enabled: true,
  backgroundColor: 'FF222222',
  measures: [{ fractionOfBar: 1, enabled: true, showLabels: true, tickWidth: 1, tickHeight: 10, tickColor: 'FF666666' }],
}}
```

**Methods (available via ref → nativeHandle):**
- `addSlice(lengthInFrames)` → `Slice`
- `removeSlice(slice)`
- `clearSlices()`
- `addMarker(config)` → `Marker`
- `removeMarker(marker)`
- `addModulation(config)` → `Modulation`
- `removeModulation(modulation)`
- `addGridMeasure(config)` → `GridMeasure`
- `getSlicesForZoneModule()` → `number[]`
- `mappedSampleChanged()`

```tsx
<geSliceEditor x={10} y={10} width={600} height={200}
  backgroundColor="FF111111"
  canAddSlices={true} canRemoveSlices={true} canChangeSlices={true}
  snapSlicesToGrid={true}
  zoom={{ start: 0, end: 1, dragToZoomEnabled: true, dragToZoomFactor: 0.5 }}
  sliceStyles={{
    normal: { width: 2, color: 'FFFF4444' },
    hover: { width: 3, color: 'FFFF8888' },
    selected: { width: 3, color: 'FFFFFF00' },
  }}
  onSliceAdded={(e) => handleSliceAdded(e)}
  onSliceChanged={(e) => handleSliceChanged(e)}
/>
```

---

## geListBox

Scrollable list with selectable items.

**JSX tag:** `<geListBox />`
**Interfaces:** Common, Bounds, Font, Clickable, Background, Scrollable, Highlight, MIDILearn
**Handlers:** `onRowClicked`

| Prop | Type | Description |
|------|------|-------------|
| `items` | `string[]` | List items |
| `horizontalMargin` | `number` | Item horizontal margin |
| `cellColor` | `string` | Background color of items |
| `cellColorSelected` | `string` | Background of selected item |
| `textColorSelected` | `string` | Text color of selected item |
| `rowDoubleClickedAction` | `string` | ViewModel action on double-click |
| `returnKeyAction` | `string` | ViewModel action on return key |
| `rowClickedAction` | `string` | ViewModel action on row click |

```tsx
<geListBox x={10} y={10} width={200} height={300}
  items={['Preset 1', 'Preset 2', 'Preset 3', 'Preset 4']}
  backgroundColor="FF222222" textColor="FFCCCCCC"
  cellColor="FF2a2a2a" cellColorSelected="FF4444FF"
  textColorSelected="FFFFFF"
  onRowClicked={(row) => loadPreset(row)}
/>
```

---

## geStepEditor

Step sequencer grid control.

**JSX tag:** `<geStepEditor />`
**Interfaces:** Common, Background, Bounds, Clickable
**Handlers:** ClickableHandlers

| Prop | Type | Description |
|------|------|-------------|
| `value` | `any` | Step data |
| `divSize` | `number` | Spacing between bars |
| `min` / `max` | `number` | Value range |
| `paramPath` | `string` | Instrument script path |
| `startIndex` / `endIndex` | `number` | Visible step range |
| `step` | `object` | Step appearance (see below) |

**Step configuration:**
```tsx
step={{
  width: 20, height: 40,
  cornerRadius: 2,
  onColor: 'FF44AAFF',
  offColor: 'FF333333',
  activeColor: 'FFFFFF00',
  backgroundColor: 'FF1a1a1a',
}}
```

```tsx
<geStepEditor x={10} y={10} width={500} height={100}
  backgroundColor="FF111111"
  min={0} max={127}
  startIndex={0} endIndex={16}
  divSize={2}
  step={{
    width: 25, height: 80,
    cornerRadius: 2,
    onColor: 'FF44AAFF', offColor: 'FF333333',
  }}
  bindings={{ value: 'Scripts/0/StepSequencer' }}
/>
```

---

## geBarStepEditor

Bar-based step editor (similar to geStepEditor).

**JSX tag:** `<geBarStepEditor />`
**Interfaces:** Common, Bounds, Background, Clickable
**Handlers:** ClickableHandlers

Props are identical to geStepEditor (without `value`):
- `divSize`, `min`, `max`, `paramPath`, `startIndex`, `endIndex`, `step`

---

## geMappingEditor

Visual sample/zone key and velocity mapping editor.

**JSX tag:** `<geMappingEditor />`
**Interfaces:** Common, Bounds, Background, Clickable
**Handlers:** ClickableHandlers, `onSelectedZone`, `onKeyPressed`, `onChangedZone`

| Prop | Type | Description |
|------|------|-------------|
| `zones` | `Zone[]` | Array of zone objects |
| `verticalZoom` | `number` | Vertical zoom level |
| `horizontalZoom` | `number` | Horizontal zoom level |

**Zone object:**
```typescript
{ path: string, name: string, index: number,
  rootKey: number, lowKey: number, highKey: number,
  lowVel: number, highVel: number }
```

**Methods (via ref → nativeHandle):**
- `refreshView(index?)` — Refresh the display
- `selectAllZones()` / `deselectAllZones()`
- `selectZones(zones)` / `addZones(zones)` / `removeZones(zones)`

```tsx
<geMappingEditor x={10} y={10} width={600} height={300}
  backgroundColor="FF222222"
  zones={mappingZones}
  onSelectedZone={(zone) => setSelectedZone(zone)}
  onChangedZone={(zone) => handleZoneChange(zone)}
/>
```
