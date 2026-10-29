# Bindings

Declarative data binding connects UI component properties to instrument parameters or view model paths.

## Binding Targets

Binding values can be either an **`InstrumentProperty` object** (preferred) or a **string path**.

### Object binding (preferred)

Pass the `InstrumentProperty` directly. This is type-safe and avoids string typos:

```tsx
// instrument[propName] returns an InstrumentProperty object
bindings={{ value: instrument.volume }}
bindings={{ value: instrument.filtercutoff, text: instrument.filtercutoff }}
```

### String path binding

Three string formats are supported:

| Format               | Example                | Description                                               |
| -------------------- | ---------------------- | --------------------------------------------------------- |
| Instrument parameter | `'instrument.volume'`  | References an instrument parameter by key name            |
| Engine path          | `'Scripts/0/Volume'`   | Direct path into the instrument parameter tree            |
| View model path      | `'viewModel.property'` | `namespace.property` — references a registered view model |

**View model namespaces:**

- `'instrument'` — the active instrument (set via `GorillaEngine.setActiveInstrument()`); each property is an `InstrumentProperty` by its key name
- Any custom name registered with `initViewModel(name, initialState)` (e.g. `'viewModel.myProp'`)

> **`initViewModel` is deprecated.** Prefer using `useInstrumentProperty` hooks or object bindings.

## React Props Syntax

Use the `bindings` prop on any component. Values can be `InstrumentProperty` objects or string paths:

```tsx
// Object binding (preferred) — pass the InstrumentProperty directly
<geKnob
  x={0} y={0} width={60} height={60}
  bindings={{ value: instrument.volume }}
  filmstrip={{ path: 'knob.png', count: 128 }}
/>

// String binding — equivalent, but less safe
<geKnob
  x={0} y={0} width={60} height={60}
  bindings={{ value: 'instrument.volume' }}
  filmstrip={{ path: 'knob.png', count: 128 }}
/>
```

The `bindings` object maps **native property names** to **binding targets** (object or string).

### How It Works

The reconciler appends `&` to each binding key and passes the target through to the native layer:

```
React:  { bindings: { value: instrument.volume } }     → Native: { 'value&': instrument.volume }
React:  { bindings: { value: 'instrument.volume' } }   → Native: { 'value&': 'instrument.volume' }
```

### Nested Bindings

Bindings can also be applied to nested object properties:

```tsx
<geKnob
  x={0}
  y={0}
  width={60}
  height={60}
  filmstrip={{ path: 'knob.png', count: 128, bindings: { path: 'vm.knobAsset' } }}
/>
```

This translates to:

```
Native: { filmstrip: { count: 128, 'path&': 'vm.knobAsset' } }
```

---

## Runtime Binding API

All controls that support dynamic bindings expose these methods. Check support with `control.supportsSetBindings()` — returns `true` for most controls.

### `control.setBindings(bindingsObj)`

Binds multiple properties at once. Pass `{}` to clear all bindings on the control.

The binding target can be a **string path** or an **`InstrumentProperty` object** directly (preferred).

```js
// Bind by InstrumentProperty object (preferred)
control.setBindings({ value: instrument.volume });

// Bind by string path
control.setBindings({ value: 'instrument.volume', width: 'viewModel.size' });

// Clear all bindings
control.setBindings({});
```

### `control.bind(propertyPath, target)`

Rebinds a single property at runtime. Supports dot-separated paths for nested properties. Replaces any existing binding for that property.

```js
// Bind by object (preferred)
control.bind('value', instrument.volume);

// Bind by string path
control.bind('value', 'instrument.volume');

// Bind nested property
control.bind('midiLearn.enabled', instrument.int1);
control.bind('filmstrip.path', 'viewModel.assetPath');
```

### `control.unbind(propertyPath)`

Removes the binding for a single property.

```js
control.unbind('value');
```

### `control.supportsSetBindings()`

Returns `true` if the control supports runtime `setBindings`/`bind`. Most controls support this.

---

## Common Binding Targets

| Component  | Object binding (preferred)        | String equivalent                         |
| ---------- | --------------------------------- | ----------------------------------------- |
| geKnob     | `{ value: instrument.volume }`    | `{ value: 'instrument.volume' }`          |
| geSlider   | `{ value: instrument.Pan }`       | `{ value: 'instrument.Pan' }`             |
| geToggle   | `{ value: instrument.Mute }`      | `{ value: 'instrument.Mute' }`            |
| geComboBox | `{ value: instrument.WaveShape }` | `{ value: 'instrument.WaveShape' }`       |
| geLabel    | `{ text: instrument.volume }`     | `{ text: 'vm.displayText' }` (view model) |
| geWaveform | —                                 | `{ value: 'vm.waveformData' }`            |

## Bindings vs. Hooks

| Approach                | When to use                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------- |
| `bindings`              | Direct engine parameter binding; no React state needed; simpler                       |
| `useInstrumentProperty` | Need React-side state, formatting, conditional logic, or cross-component coordination |

You can mix both approaches. Bindings are processed natively (more efficient for simple cases), while hooks give you full React control.

## Example: Combined Approach

```tsx
function FilterSection({ instrument }) {
  // Use hook when you need the value in React
  const [cutoff, setCutoff] = useInstrumentProperty(instrument, 'FilterCutoff');

  return (
    <geLabel x={0} y={0} width={200} height={100} backgroundColor="FF333333">
      {/* Binding: knob value syncs directly with engine (object preferred) */}
      <geKnob
        x={10}
        y={10}
        width={60}
        height={60}
        bindings={{ value: instrument.filtercutoff }}
        filmstrip={{ path: 'knob.png', count: 128 }}
      />
      {/* Hook: use React state for display text */}
      <geLabel x={80} y={30} width={100} height={20} text={`${cutoff.text}`} textColor="FFFFFF" />
    </geLabel>
  );
}
```
