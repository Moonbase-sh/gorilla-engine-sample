# Getting Started

## Entry Points

### `createUI(app, width?, height?, options?)` — Pure React UI

Creates a native window and mounts the React tree. No YAML needed.

```tsx
import { createUI } from 'gorilla-engine-react';

createUI(<App />, 1280, 760);
createUI(<App />, 800, 600, { rootNodeId: 'myRoot', logger: myLogger });
```

**Parameters:**

- `app` — Root React element
- `width` — Window width in pixels (default: `1280`)
- `height` — Window height in pixels (default: `760`)
- `options.rootNodeId` — ID for root window (default: `"root"`)
- `options.logger` — Custom `{ error, info }` logger

### `loadUI(app, ymlPath?, rootNodeId?, logger?)` — YAML + React

Loads a YAML layout file, then mounts React into a container node.

```tsx
import { loadUI } from 'gorilla-engine-react';

// Uses default: <resourcePath>/<pluginName>.yaml, rootNodeId='root'
loadUI(<App />);

// Custom path and root node
loadUI(<App />, '/path/to/layout.yaml', 'myContainer');
```

**Parameters:**

- `app` — Root React element
- `ymlPath` — Path to YAML layout (default: `<resourcePath>/<pluginName>.yaml`)
- `rootNodeId` — ID of the container node in the YAML (default: `'root'`)
- `logger` — Custom logger

### `render(reactElement, container, callback?)` — Low-level

Direct mount into an existing native container. Prefer `loadUI`/`createUI`.

## Hooks

### `useInstrument(overrideBlobPath?, options?)`

Loads a blob and its first instrument, optionally setting it as active. Returns a tuple:

```tsx
const [instrument, instrumentName, blob, setBlobPath] = useInstrument();
```

**Parameters:**

- `overrideBlobPath` — Custom path to a `.blob` file. Defaults to `<resourcePath>/<pluginName>_part1.blob`.
- `options.setActive` — Whether to call `GorillaEngine.setActiveInstrument()`. Defaults to `true`.

**Return tuple:**
| Index | Type | Description |
|-------|------|-------------|
| 0 | `Instrument \| null` | The loaded instrument |
| 1 | `string` | Current instrument name (first in blob) |
| 2 | `Blob \| null` | The loaded blob |
| 3 | `(path: string) => void` | Setter to change blob path (triggers reload) |

### `useInstrumentProperty(instrument, propName)`

Subscribes to a single instrument property with reactive updates.

```tsx
const [prop, setValue, setNormValue] = useInstrumentProperty(instrument, 'volume');

// prop contains: { value, normValue, text, name, label, unit, minValue, maxValue,
//                  numSteps, steps, defaultValue, resolution, key, category,
//                  persistence, controlType, normValueAsync, valueAsync }

// Set absolute value
setValue(0.75);

// Set normalized value (0-1)
setNormValue(0.5);
```

**Return tuple:**
| Index | Type | Description |
|-------|------|-------------|
| 0 | `InstrumentProperty` | Current property state (reactive) |
| 1 | `(value: number) => void` | Set denormalized value |
| 2 | `(value: number) => void` | Set normalized value (0–1) |

## Typical App Structure

```tsx
import { createUI, useInstrument, useInstrumentProperty } from 'gorilla-engine-react';

function App() {
  const [instrument, instrumentName, blob] = useInstrument();
  if (!instrument) return <geLabel text="Loading..." x={0} y={0} width={200} height={30} />;
  return <MainUI instrument={instrument} />;
}

function MainUI({ instrument }: { instrument: GorillaEngine.Runtime.Instrument }) {
  return (
    <geLabel x={0} y={0} width={800} height={600} backgroundColor="FF1a1a2e">
      <VolumeKnob instrument={instrument} />
      <PanKnob instrument={instrument} />
    </geLabel>
  );
}

function VolumeKnob({ instrument }) {
  const [vol, setVol] = useInstrumentProperty(instrument, 'volume');
  return (
    <>
      <geKnob
        x={50}
        y={50}
        width={60}
        height={60}
        min={vol.minValue}
        max={vol.maxValue}
        value={vol.value}
        onChange={setVol}
        filmstrip={{ path: 'assets/knob.png', count: 128 }}
      />
      <geLabel
        x={50}
        y={115}
        width={60}
        height={16}
        text={vol.text}
        textColor="FFFFFF"
        textAlign="center"
        fontSize={11}
      />
    </>
  );
}

createUI(<App />, 800, 600);
```

## GorillaEngine Global API

Key utility functions available at runtime (see [gorilla-engine-api.md](./gorilla-engine-api.md) for the full reference):

```typescript
GorillaEngine.getResourcePath(); // Platform-specific resource path
GorillaEngine.getPluginName(); // Plugin name string
GorillaEngine.loadBlob(path); // Load a .blob file → Blob
GorillaEngine.setActiveInstrument(i); // Route MIDI/audio to instrument
GorillaEngine.openURLinBrowser(url); // Open URL in system browser
GorillaEngine.openFileChooser(config); // Native file picker dialog
GorillaEngine.checkLicense(); // Check Codemeter license
```
