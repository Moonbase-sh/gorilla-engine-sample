# Composite & Utility Components

## geTagBrowser

Tag-based browser UI for filtering content.

**JSX tag:** `<geTagBrowser />`
**Interfaces:** Common, Bounds, Background, Font

| Prop    | Type    | Description              |
| ------- | ------- | ------------------------ |
| `value` | `any`   | Current selection value  |
| `tags`  | `Tag[]` | Array of tag definitions |

**Tag configuration:**

```typescript
interface Tag {
  height: number;
  borderSize: number;
  cornerRadius: number;
  textColor: { normal: string; active: string; header: string };
  backgroundColor: { normal: string; active: string; header: string };
  cancel: { x: number; width: number };
}
```

```tsx
<geTagBrowser
  x={10}
  y={10}
  width={300}
  height={400}
  backgroundColor="FF222222"
  tags={tagDefinitions}
  bindings={{ value: 'vm.selectedTags' }}
/>
```

---

## geTagEditor

Editable tag interface.

**JSX tag:** `<geTagEditor />`
**Interfaces:** Common, Bounds, Background, Font

| Prop           | Type      | Description                            |
| -------------- | --------- | -------------------------------------- |
| `value`        | `any`     | Current tags value                     |
| `tags`         | `Tag[]`   | Tag definitions (same as geTagBrowser) |
| `editable`     | `boolean` | Allow editing tags                     |
| `action`       | `string`  | ViewModel action on change             |
| `removeAction` | `string`  | ViewModel action on tag removal        |

```tsx
<geTagEditor
  x={10}
  y={10}
  width={300}
  height={100}
  backgroundColor="FF222222"
  editable={true}
  tags={tagDefinitions}
  bindings={{ value: 'vm.editableTags' }}
/>
```

---

## Labeled Controls

Use `@gorilla-engine-sdk/ge-labeled-components` when a control needs a name label, a formatted value label, or interaction-driven label visibility. These components bind directly to Gorilla Engine instrument properties.

```tsx
import {
  LabeledComboBox,
  LabeledKnob,
  LabeledMeterSlider,
  LabeledRTToggle,
  LabeledSlider,
  LabeledToggle,
} from '@gorilla-engine-sdk/ge-labeled-components';
```

The package exports:

| Component            | Use case                                      | Control configuration prop |
| -------------------- | --------------------------------------------- | -------------------------- |
| `LabeledKnob`        | Rotary parameter control                      | `knob`                     |
| `LabeledSlider`      | Horizontal or vertical parameter control      | `slider`                   |
| `LabeledToggle`      | Persistent on/off parameter control           | `toggle`                   |
| `LabeledComboBox`    | Selection from a parameter's available values | `comboBox`                 |
| `LabeledMeterSlider` | Parameter slider over a live level meter      | `slider`, `meter`          |
| `LabeledRTToggle`    | Momentary control active while pressed        | `button`                   |

### Shared Props

| Prop                      | Type                               | Description                                     |
| ------------------------- | ---------------------------------- | ----------------------------------------------- |
| `x`, `y`                  | `number`                           | Position of the labeled component container     |
| `width`, `height`         | `number`                           | Size of the labeled component container         |
| `instrument`              | `GorillaEngine.Instrument`         | Instrument instance supplied to the UI          |
| `instrumentProp`          | `GorillaEngine.InstrumentProperty` | Instrument property controlled by the component |
| `textLabel`               | Partial label props                | Name-label position, appearance, and `text`     |
| `valueLabel`              | Partial label props                | Value-label position and appearance             |
| `hideValueLabel`          | `boolean`                          | Hide the value until the configured interaction |
| `hideTextValue`           | `boolean`                          | Hide the name while the value is visible        |
| `toggleVisibilityOnHover` | `boolean`                          | Show the value on hover instead of mouse down   |
| `ranges`                  | `{ from?, to?, text }[]`           | Format values for matching numeric ranges       |

Pass geometry and assets for the native control inside its component-specific configuration prop. Bind through `instrumentProp`; do not mirror parameter values into React state.

### Knob Example

```tsx
<LabeledKnob
  x={40}
  y={40}
  width={90}
  height={110}
  instrument={instrument}
  instrumentProp={instrument.volume}
  hideValueLabel={true}
  hideTextValue={true}
  toggleVisibilityOnHover={true}
  textLabel={{
    y: 88,
    height: 18,
    text: 'VOLUME',
    font: 'fonts/Roboto-Medium.otf',
    fontSize: 12,
    textAlign: 'center',
  }}
  valueLabel={{
    y: 88,
    height: 18,
    font: 'fonts/Roboto-Medium.otf',
    fontSize: 12,
    textAlign: 'center',
  }}
  ranges={[{ text: '$value(1) dB' }]}
  knob={{
    width: 80,
    height: 80,
    filmstrip: {
      path: 'images/volume-knob.png',
      count: 128,
      direction: 'vertical',
    },
  }}
/>
```

### Slider And Toggle Example

```tsx
<LabeledSlider
  x={160}
  y={40}
  width={60}
  height={220}
  instrument={instrument}
  instrumentProp={instrument.output}
  textLabel={{ y: 194, height: 18, text: 'OUTPUT', textAlign: 'center' }}
  valueLabel={{ y: 194, height: 18, textAlign: 'center' }}
  ranges={[{ text: '$value(1) dB' }]}
  slider={{
    y: 0,
    width: 40,
    height: 180,
    filmstrip: {
      path: 'images/output-slider.png',
      count: 128,
      direction: 'vertical',
    },
  }}
/>

<LabeledToggle
  x={250}
  y={40}
  width={80}
  height={90}
  instrument={instrument}
  instrumentProp={instrument.bypass}
  textLabel={{ y: 66, height: 18, text: 'BYPASS', textAlign: 'center' }}
  toggle={{
    width: 60,
    height: 60,
    filmstrip: {
      path: 'images/bypass-toggle.png',
      count: 2,
      direction: 'vertical',
    },
  }}
/>
```

### Selection, Meter, And Momentary Examples

```tsx
<LabeledComboBox
  x={360}
  y={40}
  width={140}
  height={70}
  instrument={instrument}
  instrumentProp={instrument.mode}
  textLabel={{ y: 48, height: 18, text: 'MODE', textAlign: 'center' }}
  comboBox={{ y: 0, width: 120, height: 36 }}
/>

<LabeledMeterSlider
  x={520}
  y={40}
  width={60}
  height={240}
  instrument={instrument}
  instrumentProp={instrument.master_volume}
  meterProp={instrument.master_level}
  textLabel={{ y: 214, height: 18, text: 'MASTER', textAlign: 'center' }}
  valueLabel={{ y: 214, height: 18, textAlign: 'center' }}
  meter={{ y: 0, width: 30, height: 200 }}
  slider={{ y: 0, width: 40, height: 200 }}
/>

<LabeledRTToggle
  x={610}
  y={40}
  width={80}
  height={90}
  instrument={instrument}
  instrumentProp={instrument.trigger}
  textLabel={{ y: 66, height: 18, text: 'TRIGGER', textAlign: 'center' }}
  button={{ width: 60, height: 60 }}
/>
```

`LabeledRTToggle` writes `1` while pressed and returns the property to `0` when released.

### Value Formatting

Use `ranges` to format the displayed value. `$value` inserts the raw value, `$value(n)` fixes it to `n` decimal places, and `$text_value` uses the parameter's formatted text.

```tsx
<LabeledKnob
  instrument={instrument}
  instrumentProp={instrument.frequency}
  ranges={[
    { to: 999, text: '$value(0) Hz' },
    { from: 1000, text: '$value(2) kHz' },
  ]}
  textLabel={{ text: 'FREQUENCY' }}
  knob={{ width: 80, height: 80 }}
/>
```
