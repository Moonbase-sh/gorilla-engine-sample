# Instrument API

## `Blob` Interface

Obtained via `GorillaEngine.loadBlob()`. Represents a loaded `.blob` file.

```ts
// Instrument access
blob.getInstrumentNames(): string[];  // list all instruments
blob.loadInstrument(name: string): Instrument;  // throws on failure

// Resource API
// Resources are identified by UUID strings.
blob.hasResource(id: string): boolean;
blob.findResources(type: string): Array<{ id: string; type: string; description: string }>;
blob.getResourceInfo(id: string): { id: string; type: string; description: string };  // throws if not found
blob.getResourceData(id: string): string | number;  // throws if not found
```

---

## `Instrument` Interface

Obtained via `blob.loadInstrument()`, `useInstrument()`, or `createEmptyInstrument()`.

### Parameter access

Parameters are accessed directly on the instrument (e.g. `instrument.volume`). Names are lowercased with spaces replaced by `_`.

To enumerate all parameters, iterate the instrument's keys and check for the property that is of interest e.g. `normValue`. The list of available properties can be found in this file under ## `InstrumentProperty` Interface. Parameters are read/write:

```ts
values = {};
for (const key of Object.keys(instrument)) {
  const prop = instrument[key];
  if (prop && typeof prop.normValue === 'number') {
    values[key] = prop.normValue; // read value
    prop.normValue = values[key]; // write value
  }
}
```

### Event Subscription

```ts
instrument.on(paramName: string, handler: (normValue: number) => void): number;
// Returns 1 on success. Does NOT fire for meter parameters.

instrument.off(paramName: string, handler?: Function): number;
// Returns the number of listeners removed.
// Pass handler to remove a specific listener (returns 1 if found, 0 if not).
// Omit handler to remove all listeners for that param (returns count removed).
```

### Loading Status

```ts
instrument.getLoadingStatus(): boolean;
instrument.getLoadingProgressPercent(): number;
```

### Parameter State Recall

```ts
instrument.startRecallingParameterState(): void;
instrument.endRecallingParameterState(): boolean;
```

### Dynamic Parameters

Dynamic parameters are runtime-created automatable parameters. They appear on the instrument as `'__dynamic0'`, `'__dynamic1'`, etc.

```ts
// Persistence flags (bitfield):
//   Private       = 0x000
//   ShowInHost    = 0x001
//   SaveInSession = 0x002
//   SaveInPreset  = 0x004
// e.g. pass 7 (ShowInHost | SaveInSession | SaveInPreset) for a fully-visible parameter
const param = instrument.addParameter(persistence: number): DynamicParameter;

// DynamicParameter extends InstrumentProperty with:
param.connect(path: string): void;   // Bind to an engine path; sets name/label from target. Throws on invalid path.
param.disconnect(): void;            // Unbind; clears name/label.
// connect() and disconnect() throw if called on a non-dynamic (script) parameter.
```

---

## `InstrumentProperty` Interface

Returned by direct property access (`instrument.param_name`), `useInstrumentProperty()`, or `instrument.addParameter()`.

```ts
interface InstrumentProperty {
  // Read/write
  normValue: number; // Normalized value (0–1), write to update engine
  value: number; // Denormalized value, write to update engine
  normValueAsync: number; // Async normalized value
  valueAsync: number; // Async denormalized value

  // Read-only metadata
  readonly defaultValue: number;
  readonly minValue: number;
  readonly maxValue: number;
  readonly resolution: number;
  readonly numSteps: number; // 0 for continuous
  readonly steps: string[]; // Step labels for stepped params
  readonly key: string; // Path key
  readonly name: string;
  readonly category: string;
  readonly label: string;
  readonly text: string; // Formatted display string (with unit)
  readonly unit: string;
  readonly controlType: string[]; // Hints: "default"|"volume"|"menu"|"onOffSwitch"|"levelMeter"|...
  readonly persistence: InstrumentPropertyPersistence;
  readonly metadata: string; // JSON string; empty string if no metadata. Available at runtime but not in useInstrumentProperty hook.
}

interface InstrumentPropertyPersistence {
  private: boolean;
  showInHost: boolean;
  saveInSession: boolean;
  saveInPreset: boolean;
}
```

### `controlType` Values

| Value           | Meaning                                             |
| --------------- | --------------------------------------------------- |
| `"default"`     | Knob, slider, or drag/spin                          |
| `"volume"`      | Audio volume (down to silence)                      |
| `"drag"`        | Drag/spin control (small useful range)              |
| `"keySelect"`   | Select a MIDI note                                  |
| `"outSelect"`   | Select audio output                                 |
| `"modSource"`   | Select from mod sources                             |
| `"voiceGroup"`  | Select from voice groups                            |
| `"onOffSwitch"` | Off/On toggle                                       |
| `"switch"`      | Toggle between two non-Off/On values                |
| `"menu"`        | Dropdown menu                                       |
| `"levelMeter"`  | Audio level meter (log scale, may be multi-channel) |
| `"meter"`       | Non-audio meter                                     |
| `"display"`     | Read-only numeric/text display                      |
| `"text"`        | Editable text                                       |
| `"textBox"`     | Multi-line editable text                            |
| `"array"`       | Multiple values (e.g. bargraph)                     |
| `"waveform"`    | Waveform overview                                   |
| `"notVisible"`  | Not intended for display                            |

### MIDI

```ts
instrument.noteOn(key: number, velocity: number): void;   // key/velocity: 0–127
instrument.noteOff(key: number): void;

instrument.getMidiDragData(): midiData[];
// midiData: { status: string; data0: string; data1: string; tickAbsolute: string }
```

### MIDI CC Mapping

```ts
type ccState = { cc: number; path: string };

// Returns current CC→parameter mappings.
instrument.getMIDICCstate(): ccState[];

// Replaces all CC mappings. Valid cc range: 1–119.
// If two entries share the same path, the last one wins.
// Throws on malformed input (missing fields, out-of-range cc, non-array, etc.).
instrument.setMIDICCstate(state: ccState[]): void;
```

### Audio Rendering

```ts
instrument.renderAudioFile(
  renderFilePath: string,
  key: number,
  velocity: number,
  renderUntilSilence: boolean,
  minFileLength: number,
): void;

instrument.renderAudioFileFromMidi(
  renderFilePath: string,
  midiData: midiData[],
  renderUntilSilence: boolean,
  minFileLength: number,
): void;
```

## Advanced instrument manipulation

### Path-based Value Access

All path accessors use strings like `'Scripts/0/Volume'` or `'Groups/0/Zones/0/Sample'`.

```ts
// Generic
instrument.getValueAtPath(path): string | object | number | Int32Array | Float64Array | boolean;

// Typed getters/setters
instrument.getDoubleAtPath(path): number | boolean;
instrument.setDoubleAtPath(path, value: number): boolean;

instrument.getNormalizedDoubleAtPath(path): number | boolean;
instrument.setNormalizedDoubleAtPath(path, value: number): boolean;

instrument.getIntAtPath(path): number | boolean;
instrument.setIntAtPath(path, value: number): boolean;

instrument.getStringAtPath(path): string;
instrument.setStringAtPath(path, value: string): boolean;

instrument.getIntArrayAtPath(path): Int32Array | boolean;
instrument.setIntArrayAtPath(path, value: Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array): boolean;

instrument.getDoubleArrayAtPath(path): Float64Array | boolean;
instrument.setDoubleArrayAtPath(path, value: Float32Array | Float64Array): boolean;
```

### Module Access

Modules are GE engine components serialised as JSON strings.

```ts
instrument.getModuleAtPath(path): string | boolean;
instrument.moduleAtPath(path): string | boolean;  // alias for getModuleAtPath
instrument.setModuleAtPath(path, module: string): boolean;
instrument.isModuleAtPath(path): boolean;

// Insert adds at index (does NOT overwrite); indices must be contiguous:
instrument.insertModuleAtPath(path, value: string): boolean;
// Remove by path before inserting to replace:
instrument.removeModuleAtPath(path): boolean;
```

### Utility

```ts
// Convert a normalised value to a display string with unit:
instrument.valueToStringAtPath(path, value: number): boolean | string;

// Waveform rendering (for geWaveform component):
instrument.getWaveformData(numPoints, zoneId, start, end): Uint8Array;
instrument.getWaveformOverview(numPoints, zoneID, start, end, vertZoom): Uint8Array;
instrument.getSampleMetadata(filePath, overviewSize): { metadata: string; overview: Uint8Array };
```
