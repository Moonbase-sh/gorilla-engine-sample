# Instrument files

## General knowledge

- `.inst` files are JSON and are loaded and handled by the Gorilla Editor.
- When saving an instrument, it will copy the currently loaded instrument script into the instrument file.
- The script's content will only be applied if the script is reloaded in the editor.
- The instrument file controls the order of selected voice and effect modules. The order of objects in the file. Also the "Module" key must always be the first key in each object.
- A module will initially be added to an inst file without further information about the parameter values and load with default values. Only when a user tweaks values in the editor and saves the new state, the new parameter values will appear in the inst file.
- Boolean-style parameters use the strings `"On"` and `"Off"`, not `true`/`false`.
- All float parameter values in the file are normalised floats in the range `0.0` to `1.0` unless otherwise noted. Scripts use a 0–1,000,000 integer scale when calling `set_module_param()`.
- It is not necessary to include a parameter key in the JSON if the value is set to the module default.

## Instrument authoring safety

Prefer creating or restructuring instrument topology in Gorilla Editor. Existing modules remain scriptable when their documented addresses and parameter encodings are known, but textual `.inst` authoring requires stronger evidence:

- Do not guess enum strings, parameter keys, array layouts, module references, or routing encodings. Use the official documentation, a saved editor-generated `.inst`, or omit the setting so the module default is used.
- Do not synthesize opaque arrays such as custom-envelope curves, modulation curves, step sequences, shaper curves, or per-tap delay arrays. Preserve an existing value or have the editor generate it.
- Modules backed by imported content, including wavetables, MIDI files, data files, convolution impulses, and sample mappings, must be imported or configured through the editor unless a concrete working reference establishes the complete format.
- Treat topology-dependent modules cautiously. Crossovers, sends, sample oscillators, vocoders, and similar modules can depend on neighboring buses, mappings, channels, or imported resources; copy only from a reference with the same topology.
- If documentation and references do not establish a value, stop at the scriptable boundary and ask the user to create or configure that module in Gorilla Editor.

---

## Top-level structure

```json
{
  "Module": "Instrument",
  "Name": "My Instrument",
  "Pitch Bend Range": 2,
  "Version": "2.0.4",
  "Volume": 0.630957,
  "Glide": "On",
  "Blob Path": null,
  "Script Defines": null,
  "Editor Data": null,
  "Groups":      [ ... ],
  "Mappings":    [ ... ],
  "Voice Groups":[ ... ],
  "FX Busses":   [ ... ],
  "MIDI Files":  [ ... ],
  "Data Files":  [ ... ],
  "Scripts":     [ ... ]
}
```

**Top-level keys:**

| Key                | Type         | Notes                                               |
| ------------------ | ------------ | --------------------------------------------------- |
| `Module`           | string       | Always `"Instrument"`                               |
| `Name`             | string       | Instrument display name                             |
| `Pitch Bend Range` | integer      | Semitones, e.g. `2`, or `48` for MPE                 |
| `Version`          | string       | Engine version, e.g. `"2.0.4"`                      |
| `Volume`           | float        | Master volume (0–1, default ~0.63)                  |
| `Glide`            | string       | `"On"` / `"Off"`                                    |
| `Blob Path`        | string       | Path to `.blob` file for compiled output, or `null` |
| `Script Defines`   | string       | Used with USE_CODE_IF in script                     |
| `Editor Data`      | null         | Reserved, leave as `null`                           |
| `Overview Size`    | integer      | Optional, used for slice editors                    |

`Mappings` and `FX Busses` are optional and can be omitted entirely if not needed.

---

## Groups

Groups are the core polyphonic voice containers. Every note played triggers all active groups unless controlled by the script.

```json
"Groups": [
  {
    "Module": "Group",
    "Name": "My Group",
    "Volume": 0.8,
    "Output": -1,
    "Quality": "Vintage",
    "Alternate Mapping": 1,
    "De-glitch Start": "On",
    "ModSources":  [ ... ],
    "ModRoutings": [ ... ],
    "Filters":     [ ... ],
    "Zones":       [ ... ]
  }
]
```

**Group keys:**

| Key                 | Type         | Notes                                                                          |
| ------------------- | ------------ | ------------------------------------------------------------------------------ |
| `Module`            | string       | Always `"Group"`                                                               |
| `Name`              | string       | Optional label                                                                 |
| `Volume`            | float        | Group volume (0–1)                                                             |
| `Output`            | integer      | Omit = instrument output; `-1` = Bus 1; `-2` = Bus 2                           |
| `Quality`           | string       | E.g. `"Vintage"` for vintage resampling                                        |
| `Alternate Mapping` | integer      | 1-based index of the first `Mapping` to use for round-robins/alternate samples |
| `De-glitch Start`   | string       | `"On"` – smooths sample start clicks                                           |

In scripts, groups are indexed `M_GROUP+0`, `M_GROUP+1`, … (0-based).

---

## ModSources

Each group has an array of mod sources. These define envelopes and LFOs that drive modulation. In scripts they are indexed `M_MOD_SRC+1`, `M_MOD_SRC+2`, … (1-based).

### ADSR Envelope — `ModSourceADSR`

```json
{
  "Module": "ModSourceADSR",
  "Name": "Amp Env",
  "Attack": 0.0,
  "Decay": 0.49,
  "Hold": 0.0,
  "Sustain": 1.0,
  "Release": 0.23,
  "Decay Curve": 90.0,
  "ModRoutings": [ ... ]
}
```

All time/level values are normalised floats (0–1). `Decay Curve` is a shape value (0–100). `ModRoutings` inside an ADSR target ADSR parameters with `"Dest"` = `"Attack"`, `"Decay"`, `"Sustain"`, or `"Release"`.

### LFO — `ModSourceLFO`

```json
{
  "Module": "ModSourceLFO",
  "Name": "LFO",
  "Wave": "Triangle",
  "Rate": 0.7,
  "Retrigger": "Off",
  "ModRoutings": [ ... ]
}
```

`Wave` options: `"Sine"`, `"Triangle"`, `"Saw"`, `"Square"`. `Rate` is normalised (0–1). `Retrigger` `"Off"` means free-running. `ModRoutings` inside an LFO typically target its own depth/rate via `"Dest"` = `"Rate"` or a CC input.

### Custom Mod Source — `ModSourceCustom`

```json
{
  "Module": "ModSourceCustom",
  "Name": "Glide Curve",
  "Curve": [ 1.0, 0.0, 0.0, 1.0, ... ],
  "ModRoutings": [ ... ]
}
```

`Curve` is a 54-element float array defining the custom envelope shape. Used for complex envelope shapes. 
The first 3 values in the array are the number of segments in the curve, the loop start point, and the loop end point.
Then each segment in the curve is specified by 3 values: the start level (-1.0 to +1.0), the length in seconds or beats, and the curve shape (-11.0 to start with a high gradient to +11.0 to start with a low gradient. values close to zero result in a straight line but a value of exactly zero fixes the curve at the start level for its whole length instead of ending at the start level of the next segment.
When set by the script all values are multipled by 1000.
Example of a simple linear decay:
1.0   one segment
0.0  loop from start
0.0  no loop end point
1.0  segment 1 start level
 1.0  length 
 0.001  linear shape
 0.0  end level (start level of next segment if it was used)

Example of a repeating waveform shaped like the first half of a sine wave:
2.0  two segments
0.0  loop from start
2.0  loop to end of waveform
0.0  segment 1 start level
0.5  length
-3.0  curve (changing fast initially)
1.0  segment 2 start level
0.5  length
3.0  curve (changing slowly initially)
0.0  end level (start level of next segment if it was used)

---

## ModRoutings

ModRoutings appear at three levels:

1. **Group-level** – routes a source to a group parameter (volume, tune, pan)
2. **Inside a ModSource** – modulates a property of that mod source (ADSR attack from velocity, LFO rate from CC)
3. **Inside a Filter** – modulates a filter/oscillator parameter

In scripts, group-level routings are indexed `M_MOD+1`, `M_MOD+2`, … (1-based). The default source if not specified is the first Mod Source which is usually the Amp Envelope.

```json
{
  "Module": "ModRouting",
  "Active": "Off",
  "Source": "Velocity",
  "CC": 74,
  "Invert": "On",
  "Depth": 0.9,
  "Smooth": 0.26,
  "Dest": "Tune",
  "Custom Dest": 1,
  "Curve Active": "On",
  "Curve": [ 0.0, 0.004, ... ],
  "Use MIDI Channel": "On",
  "Freeze In Release": "On"
}
```

> **Note:** The example above shows all optional keys. In practice, most routings only need `"Source"`, `"Depth"`, and `"Dest"`. The `"Curve"` key (128-element float array) and `"Custom Dest"` are advanced features — do not include them unless you have a concrete reference value.

**ModRouting keys:**

| Key                 | Type        | Notes                                                                         |
| ------------------- | ----------- | ----------------------------------------------------------------------------- |
| `Active`            | string      | `"Off"` to disable; omit for enabled (default)                                |
| `Source`            | string      | See source table below; omit = first ModSourceADSR                            |
| `CC`                | integer     | MIDI CC number (0–127), required when `Source` is `"MIDI CC"`                 |
| `Depth`             | float       | Modulation amount (0–1); negative values treated as inverted in some contexts |
| `Invert`            | string      | `"On"` = inverts the source signal                                            |
| `Smooth`            | float       | Smoothing time (0–1)                                                        |
| `Dest`              | string      | See destination table below; omit = Volume                                    |
| `Custom Dest`       | integer     | Used when `Dest` is `"Custom"`, selects the custom parameter index            |
| `Curve Active`      | string      | `"On"` = use the 128-point curve array                                        |
| `Curve`             | float array | 128-element normalised float array for non-linear mapping                     |
| `Use MIDI Channel`  | string      | `"On"` = per-channel (MPE) mode                                               |
| `Freeze In Release` | string      | `"On"` = hold value when note is released                                     |
| `Steps`             | float array | For step-based LFO shapes in EffectMods                                       |

**Source values:**

| Value                 | Meaning                                                                    |
| --------------------- | -------------------------------------------------------------------------- |
| `"Mod 1"`             | First Mod Source in the group (usually an ADSR amp envelope)               |
| `"Mod 2"`             | Second Mod Source in the group, etc.                                       |
| `"Velocity"`          | Note velocity                                                              |
| `"Key"`               | MIDI key number                                                            |
| `"Pitch Bend"`        | Pitch bend wheel                                                           |
| `"Aftertouch"`        | Channel aftertouch                                                         |
| `"MIDI CC"`           | A specific CC (set `"CC"` key)                                             |
| `"Constant"`          | Fixed value (for mod matrix targets)                                       |
| `"Random"`            | Random per note                                                            |
| `"Random +"`          | Random per note, positive only                                             |
| `"Glide"`             | Glide amount                                                               |
| `"Mod 2"` … `"Mod 4"` | Named ModSource by index (2nd, 3rd, 4th in the group's `ModSources` array) |
| `"Event Param 0"`     | `EVENT_PARAM_0` value set in script                                        |

**Destination values (group-level routings):**

| Value       | Meaning                                      |
| ----------- | -------------------------------------------- |
| `"Volume"`  | Volume (amplitude)                           |
| `"Pan"`     | Stereo panning                               |
| `"Tune"`    | Pitch / tuning                               |
| `"Sample Start"`    | Offset sample startpoints in Zones    |
| `"Next Mod Depth"`    | Modulate depth of next mod routing in Group     |
| `"Custom"`  | Custom destination index (set `Custom Dest`) |

**Destination values (inside ModSource routings):**

| Value                                           | Meaning                     |
| ----------------------------------------------- | --------------------------- |
| `"Attack"`, `"Decay"`, `"Sustain"`, `"Release"` | ADSR stage parameters       |
| `"Time 1"`                                      | Custom curve time parameter |
| `"Rate"`                                        | LFO rate                    |
| `"Sub"`, `"Dest"`                               | Filter-specific targets     |

---

## Filters (voice modules)

`"Filters"` is the array of per-voice DSP modules inside a group: oscillators, filters, utilities. They run in series in the order listed. In scripts they are indexed `M_FILTER+1`, `M_FILTER+2`, … (1-based).

Each filter module can have its own `"ModRoutings"` array to modulate its parameters from mod sources.

```json
"Filters": [
  {
    "Module": "FilterAnalogOsc"
  },
  {
    "Module": "FilterLP12",
    "ModRoutings": [
      {
        "Module": "ModRouting",
        "Depth": 0.75
      },
      {
        "Module": "ModRouting",
        "Source": "Key",
        "Depth": 0.3
      }
    ],
    "Cutoff": 0.5
  }
]
```

**Common filter modules:**

| Module                | Key params                                      | Notes                                                                             |
| --------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------- |
| `FilterAnalogOsc`     | `Tune`, `Saw`, `Square`, `Sub`                  | Analog-style oscillator                                                           |
| `FilterSineOsc`       | `Tune`, `Mix`, `Keytrack`                       | Sine wave oscillator; set `"Keytrack": "Off"` for fixed pitch                     |
| `FilterSuperOsc`      | `Oscillators`, `Detune`, `Sub`, `Mix`           | Unison super oscillator                                                           |
| `FilterLP6`           | `Cutoff`, `Resonance`                           | 6 dB/oct low-pass                                                                 |
| `FilterLP12`          | `Cutoff`, `Resonance`                           | 12 dB/oct low-pass                                                                |
| `FilterLP24`          | `Cutoff`, `Resonance`                           | 24 dB/oct low-pass                                                                |
| `FilterLadder`        | `Cutoff`, `Resonance`                           | Moog-style ladder filter                                                          |
| `FilterStateVariable` | `Cutoff`, `Resonance`                           | State variable filter                                                             |
| `FilterEnvFollower`   | `Attack`, `Release`, `Mode`, `Output CC`        | Converts mod signal to MIDI CC; set `"Mode": "Mod Input"` and `"Output CC": <cc>` |
| `FilterDownmix`       | `Smoothing`, `Ch1 L`, `Ch1 R`, `Ch2 L`, `Ch2 R` | Multi-channel mixer/crossfader; channel mix values in %                           |

---

## Zones

Zones define which sample plays for which MIDI key range. They sit either directly inside a `Group` or inside a `Mapping`.

```json
"Zones": [
  {
    "Module": "Zone",
    "Sample": "samples/piano.wav",
    "Root Key": 64,
    "Low Key": 60,
    "High Key": 67,
    "Volume": -2.0,
    "Tune": 0.09,
    "Start": 0,
    "End": 36275,
    "Loop": "On",
    "Loop Start": 21501,
    "Loop End": 36275,
    "Start Mod Range": 5000,
    "Slice Length": 2.0,
    "Orig Tempo": 120.0,
    "Slices": [ 4, 0, 5512, 11024, 16536, 22050 ]
  },
  { "Module": "Zone", "Sample": "" }
]
```

Use `"Sample": ""` for an empty zone when no sample is needed (e.g. oscillator-only sounds – required to trigger voices).

**Zone keys:**

| Key                                    | Type    | Notes                                                                      |
| -------------------------------------- | ------- | -------------------------------------------------------------------------- |
| `Sample`                               | string  | Relative path or `""` for empty                                            |
| `Root Key`                             | integer | MIDI root key (default 69 = A3)                                            |
| `Low Key`                              | integer | Lowest MIDI key this zone responds to                                      |
| `High Key`                             | integer | Highest MIDI key this zone responds to                                     |
| `Volume`                               | float   | Per-zone volume offset in dB                                               |
| `Tune`                                 | float   | Fine tune                                                                  |
| `Start`, `End`                         | integer | Sample start/end in samples                                                |
| `Loop`                                 | string  | `"On"` / `"Off"`                                                           |
| `Loop Start`, `Loop End`               | integer | Loop points in samples                                                     |
| `Start Mod Range`                      | integer | Scriptable start position range (samples), enables `EVENT_PARAM_START_POS` |
| `Slice Length`, `Orig Tempo`, `Slices` | mixed   | For REX/sliced loop playback                                               |

---

## Mappings

Mappings hold alternate sample sets for round robins or alternate articulations. A group selects its mapping via `"Alternate Mapping": <index>` (1-based). The script changes the active mapping using `set_event_param(EVENT_ID, EVENT_PAR_ALT_MAPPING, value)`.

```json
"Mappings": [
  {
    "Module": "Mapping",
    "Name": null,
    "Zones": [
      { "Module": "Zone", "Sample": "rr1.wav", "Root Key": 69, "End": 3200, "Loop": "On", "Loop End": 3200 }
    ]
  },
  {
    "Module": "Mapping",
    "Name": null,
    "Zones": [
      { "Module": "Zone", "Sample": "rr2.wav", "Root Key": 69, "End": 3200, "Loop": "On", "Loop End": 3200 }
    ]
  }
]
```

In scripts, mappings are indexed `M_MAPPING+1`, `M_MAPPING+2`, … (1-based).

---

## Voice Groups

Voice Groups control polyphony limits and voice stealing. Every instrument needs at least a first Voice Group, which controls the total polyphony of the instrument.

```json
"Voice Groups": [
  {
    "Module": "VoiceGroup",
    "Name": null,
    "Max Voices": 8
  },
  {
    "Module": "VoiceGroup",
    "Name": null,
    "Max Voices": 1
  }
]
```

Omit `"Max Voices"` for a default polyphony limit. Multiple voice groups allow separate polyphony limits (e.g. main synth poly vs. mono glide group).

---

## FX Busses

Effect buses receive audio from groups routed to them (`"Output": -1` for Bus 1, `-2` for Bus 2, etc.).

```json
"FX Busses": [
  {
    "Module": "EffectBus",
    "Name": null,
    "Effects": [
      {
        "Module": "EffectChorus",
        "Bypass": "On",
        "Delay": 0.177,
        "Voices": 3,
        "Dry": 0.89,
        "Wet": 0.71
      }
    ]
  }
]
```

In scripts, buses are indexed `M_BUS+1`, `M_BUS+2`, … (1-based). Effects within a bus are indexed `M_EFFECT+1`, `M_EFFECT+2`, … (1-based).

**Common effect modules:**

| Module           | Key params                                                     | Notes                                                            |
| ---------------- | -------------------------------------------------------------- | ---------------------------------------------------------------- |
| `EffectChorus`   | `Bypass`, `Delay`, `Voices`, `Dry`, `Wet`                      | Chorus effect                                                    |
| `EffectDelay`    | `Time`, `Sync`, `Feedback`, `Feedback Mode`, `Wet`, `Damping`  | `"Sync": "beats"` for tempo sync; `"Feedback Mode": "Ping Pong"` |
| `EffectReverb`   | `Pre Delay`, `Low Cut`, `Damping`, `Dry`, `Wet`, `Low Damping` |                                                                  |
| `EffectFilter`   | `Cutoff`, `Resonance`, `Smoothing`, `EffectMods`               | Filter on the bus output                                         |
| `EffectEmbedded` | `Inst Data`                                                    | Embeds a full instrument as a string-serialised JSON             |

Effects can include `"EffectMods"` for bus-level modulation:

```json
"EffectMods": [
  {
    "Module": "EffectMod",
    "Source": "MIDI CC",
    "CC": 99,
    "Depth": 0.15,
    "Steps": [ 0.0, 0.38, 0.71, 0.92, 1.0, 0.92, 0.71, 0.38 ]
  }
]
```

---

## Scripts

The `"Scripts"` array holds one or more script modules. The script content is the inline copy saved at edit time. The `.txt` file is the live source the editor reloads from.

```json
"Scripts": [
  {
    "Module": "Script",
    "Script Path": "My Script.txt",
    "Script": "on init\nend on\n"
  }
]
```

Set `"Script Path": null` for scripts with no separate file (inline-only).

**Saved property values:** When the editor saves an instrument with script properties that have been adjusted, it appends extra keys to the Script object with the current property values. These are applied on load:

```json
{
  "Module": "Script",
  "Script Path": "Step Sequencer Script.txt",
  "Script": "...",
  "Step_Seq": [0, 0, 0, 0, -2, 0, 3, 0],
  "FilterCutoff": 0.801809,
  "RR_Max_Time": 0.200000003
}
```

---

## Routing

- **Group → Instrument output**: omit the `"Output"` key entirely.
- **Group → FX Bus**: `"Output": -1` = Bus 1, `"Output": -2` = Bus 2, etc.
- **Bus → Bus**: a bus can also route to another bus the same way.
- **Multiple outputs**: positive values (`"Output": 1`, `2`, …) are for multi-output plug-ins; ignored in the Gorilla Editor (treated as stereo main).

### Bus renumbering checklist

When adding or removing FX buses, all `Output` values that reference
buses at or after the changed position must be updated.

Search scope: every `"Output"` that is a **negative integer** in:

- EffectBus entries (top-level Output)
- EffectSend effects (Output inside Effects array)
- Group entries (Output)

Float Output values (e.g. EffectGuitarAmps.Output = 0.664) are DSP
parameters — do not touch them.

Shift formula: if removing N buses at positions P1…PN, then for any
remaining Output reference -X where X > max(P1…PN):
new Output = -(X - N)

---

## Common editing patterns

### Add a filter to a group

Add to `"Filters"` inside the group. Order matters — the signal flows top-to-bottom.

```json
"Filters": [
  { "Module": "FilterAnalogOsc" },
  { "Module": "FilterLP12", "Cutoff": 0.5, "Resonance": 0.3 }
]
```

Script accesses `M_FILTER+1` for the oscillator, `M_FILTER+2` for the LP12.

### Add a second ADSR (e.g. filter envelope)

Add to `"ModSources"` after `"Amp Env"`:

```json
{
  "Module": "ModSourceADSR",
  "Name": "Filter Env",
  "Decay": 0.5,
  "Decay Curve": 90.0
}
```

Reference it in a filter's `ModRoutings` as the first (unnamed) source, or in a group routing as `"Source": "Mod 2"`.

### Add an LFO modulating filter cutoff

Add the LFO to `"ModSources"`, then add a routing to the filter's `"ModRoutings"`:

```json
{
  "Module": "ModSourceLFO",
  "Name": "LFO",
  "Rate": 0.7,
  "Retrigger": "Off"
}
```

In the filter:

```json
"ModRoutings": [
  { "Module": "ModRouting", "Source": "Mod 2", "Depth": 0.3 }
]
```

`"Mod 2"` = the 2nd entry in the group's `ModSources` array (1-indexed).

### Add an FX bus with reverb

1. Add `"Output": -1` to the group.
2. Add the bus to `"FX Busses"`:

```json
"FX Busses": [
  {
    "Module": "EffectBus",
    "Name": null,
    "Effects": [
      { "Module": "EffectReverb", "Pre Delay": 0.1, "Dry": 0.5, "Wet": 0.5 }
    ]
  }
]
```

Script uses `M_BUS+1` / `M_EFFECT+1`.

### Add alternate samples (round robin)

1. Set `"Alternate Mapping": 1` on the group.
2. Add one `Mapping` per round-robin variant to the top-level `"Mappings"` array, each with its own `"Zones"`.
3. In the script: `set_event_param(EVENT_ID, EVENT_PAR_ALT_MAPPING, rrIndex)`.

### Remove a module

Simply delete the object from its array. The remaining modules shift up — update all `M_FILTER+n`, `M_MOD_SRC+n`, `M_MOD+n` constants in the script to match the new indices.
