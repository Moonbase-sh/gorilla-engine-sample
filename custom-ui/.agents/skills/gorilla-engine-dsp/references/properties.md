# Properties Reference

Properties are declared in `on init` and serve as both script variables and plugin parameters. They bridge the script to the UI — when a user changes a knob/slider bound to a property, the script receives the new value in an `on <property>` callback.

## Property Types

### prop_linear — Linear Range

```
prop_linear <name>(min, max, scaling) [= default]
```

Display = value / scaling. Most common property type.

```
prop_linear Volume(0, 1000, 10) = 500        ' display 0.0 to 100.0, default 50.0
prop_linear Tune(-1200, 1200, 100)            ' display -12.00 to 12.00
prop_linear Mix(0, 100, 1) = 50               ' display 0 to 100
  set_prop_param(Mix, PROP_UNITS, "%")
```

### prop_boolean — On/Off Switch

```
prop_boolean <name> [= default]
```

Value is 0 or 1.

```
prop_boolean Mute
prop_boolean Retrigger = 1
```

### prop_exp — Exponential (Frequencies, Rates, Envelope Times)

```
prop_exp <name>(max, displayMin, displayMax) [= default]
```

Value is linear 0..max in script. Display is exponential displayMin/1000 to displayMax/1000. Negative displayMin means display 0 at zero and -displayMin/1000 at 1% position.

```
prop_exp Cutoff(1000000, 20000, 25000000) = 549000   ' 20 Hz to 25 kHz, default ~1 kHz
prop_exp Rate(1000000, 10, 100000) = 500000           ' 0.01 to 100 Hz, default 1 Hz
prop_exp Decay(1000000, -10, 16000)                   ' 0.0 to 16.0 sec, 10ms at 1%
prop_exp Glide_Time(1000000, 0, 10000) = 250000
  set_prop_param(Glide_Time, PROP_UNITS, "sec")
```

### prop_decibels — Volume in dB

```
prop_decibels <name>(max, dBmax) [= default]
```

Cube-law dB display. Value is linear 0..max. Display is -inf to dBmax.

```
prop_decibels Volume(1000000, 12)   ' 0 to +12.0 dB
prop_decibels Master(1000000, 0)    ' -inf to 0.0 dB
```

### prop_squared — Square-Law (Pre-Delay, Ratios)

```
prop_squared <name>(min, max, displayMin, displayMax) [= default]
```

Square-law display. Midpoint of slider = 25% of max.

```
prop_squared Delay(0, 1000000, 0, 25)       ' 0.0 to 25.0 ms
prop_squared Ratio(0, 1000000, 1, 20)       ' 1.0 to 20.0
prop_squared Depth(-1000000, 1000000, -100, 100)  ' bipolar with square scaling
```

### prop_stepped — Discrete Named Steps

```
prop_stepped <name> [= default]
add_step(<name>, "label")
```

Values are 0, 1, 2... in order of `add_step()` calls.

```
prop_stepped Mode = 1
  add_step(Mode, "Retrig");   const MODE_RETRIG = 0
  add_step(Mode, "Legato");   const MODE_LEGATO = 1
  add_step(Mode, "Repitch");  const MODE_REPITCH = 2

prop_stepped Rate = 6
  add_step(Rate, "1/4")
  add_step(Rate, "1/8")
  add_step(Rate, "1/16")
  var rateToPPQ[3] = (960, 480, 240)
```

### prop_array — Array Property

```
prop_array <name>[size](min, max, scaling) [= (...)]
```

Cannot be automated. Expose individual values for automation.

```
prop_array Velocity_Curve[128](1, 127, 1)
prop_array Step_Seq[16](-12, 12, 1) = (0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)
```

### prop_text — Text String

```
prop_text <name>
```

```
prop_text Name
prop_text Status
  set_prop_param(Status, PROP_SET_BY, SET_BY_SCRIPT)  ' read-only display
```

### prop_meter — Real-Time Measurement

```
prop_meter <name> [size]
attach_meter(<name>, module, submodule)
```

```
prop_meter Level; attach_meter(Level, M_BUS+1, 0)                ' bus level
prop_meter Level[2]; attach_meter(Level, M_BUS+3, 0)             ' stereo
prop_meter GR; attach_meter(GR, M_BUS+1, M_EFFECT+1)             ' gain reduction
prop_meter Pos; attach_meter(Pos, M_GROUP+0, 0)                  ' playback position
```

### prop_waveform — Waveform Display

```
prop_waveform <name> [(group)]
```

```
prop_waveform Wave_Display
set_waveform(Wave_Display, -1, 60, 100)  ' group/mapping, key, vel
```

## Property Configuration

### set_prop_param(property, param, value)

**Numeric parameters:**

| Param | Description |
|-------|-------------|
| `PROP_MIDI_CC` | Assign MIDI CC (1-119) to property |
| `PROP_SET_BY` | Control who can modify (see SET_BY flags) |
| `PROP_NON_REALTIME` | Set to 1 for non-realtime-safe properties |
| `PROP_MIN` | Override minimum value |
| `PROP_MAX` | Override maximum value |

**Text parameters:**

| Param | Description |
|-------|-------------|
| `PROP_NAME` | Display name (default: name with `_` → spaces) |
| `PROP_UNITS` | Units suffix (e.g. `"%"`, `"sec"`, `"semi"`, `"Hz"`) |
| `PROP_VALUE_TEXT` | Custom display text replacing value+units |
| `PROP_GROUP` | Automation group name |
| `PROP_METADATA` | Additional info for UI |

Special units: `"L|R"` for pan controls (displays L/R instead of -/+).

### SET_BY Flags

| Flag | Description |
|------|-------------|
| `SET_BY_HOST` | Value set externally, script receives it |
| `SET_BY_SONG` | Stored/recalled with DAW session |
| `SET_BY_PATCH` | Stored/recalled with presets |
| `SET_BY_REMOTE_AUTO` | Can be automated |
| `SET_BY_SCRIPT` | Script sets value, displayed on GUI (read-only to user) |
| `SET_BY_GUI` | GUI controls set value, script does NOT receive callback |

**Default:** `SET_BY_HOST + SET_BY_SONG + SET_BY_PATCH + SET_BY_REMOTE_AUTO`

```
' Read-only display property
prop_text Status
  set_prop_param(Status, PROP_SET_BY, SET_BY_SCRIPT)

' Non-automatable property
const NO_AUTO = SET_BY_HOST + SET_BY_SONG + SET_BY_PATCH
prop_stepped Source
  set_prop_param(Source, PROP_SET_BY, NO_AUTO)
```

## Property Callbacks

Every declared property automatically gets a callback:

```
prop_linear Volume(0, 1000000, 1) = 500000

on Volume
  set_module_param(M_INST, 0, 0, 3, Volume)  ' update instrument volume
end on
```

The callback runs when:
- The UI changes the property
- The host automates the property
- The script assigns a new value to the property
- A preset is loaded

## Property ↔ UI Binding

Properties declared in the script become instrument parameters that the React UI can bind to using `useInstrumentProperty()` or `bindings`. The property name in UI is **always lowercase**, even if declared uppercase in the script.

Script:
```
prop_linear Cutoff(0, 1000000, 1)
```

React UI:
```tsx
const [cutoff, setCutoff] = useInstrumentProperty(instrument, 'cutoff');
```
