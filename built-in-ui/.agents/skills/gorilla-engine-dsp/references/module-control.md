# Module Control Reference

## Module Path Constants

> ⚠ **0 vs 1 base rule** — `M_GROUP` and `M_VGROUP` are the **only** 0-based constants. Every other constant starts at **1**. For the complete derivation table and a worked example, see [indexing.md](./indexing.md).

Every module in the instrument is addressed by a path of constants:

| Constant | Description | Example |
|----------|-------------|---------|
| `M_INST` | Instrument module | `M_INST` |
| `M_GROUP` | Group (add index from 0) | `M_GROUP+0`, `M_GROUP+1` |
| `M_VGROUP` | Voice Group (add index from 0) | `M_VGROUP+0` = Instrument Voices |
| `M_BUS` | Effect Bus (add number from 1) | `M_BUS+1` |
| `M_MAPPING` | Mapping (add number from 1) | `M_MAPPING+1` |
| `M_MIDI` | MIDI File module (from 1) | `M_MIDI+1` |
| `M_DATA` | Data File module (from 1) | `M_DATA+1` |
| `M_SCRIPT` | Script module (from 1) | `M_SCRIPT+1` |

### Sub-Module Constants

| Constant | Description | Example |
|----------|-------------|---------|
| `M_COND` | Trigger condition in group (from 1) | `M_COND+1` |
| `M_MOD_SRC` | Mod source in group (from 1) | `M_MOD_SRC+1` = first envelope/LFO |
| `M_FILTER` | Voice effect in group — filter, oscillator, or utility (from 1) | `M_FILTER+1` = first voice effect |
| `M_ZONE` | Zone in group/mapping (from 1) | `M_ZONE+1` |
| `M_EFFECT` | Bus effect (from 1) | `M_EFFECT+1` |
| `M_MOD` | Mod routing (from 1) | `M_MOD+1` |

`M_FILTER` is the historical address for every module in a Group's `Filters` array, including oscillators and voice-level utilities. When an editor name exists in both forms, use the JSON `"Module"` type to distinguish them: `Filter*` modules use `M_GROUP+n, M_FILTER+m`; `Effect*` modules use `M_BUS+n, M_EFFECT+m`.

## set_module_param(module, subModule, modRouting, param, value)

Set a parameter in any instrument module.

- `module`: Module path (e.g., `M_GROUP+0`)
- `subModule`: Sub-module or 0 for the module itself
- `modRouting`: Mod routing or 0
- `param`: Parameter index (from 1, in Editor display order)
- `value`: Continuous sliders = 0 to 1,000,000; stepped = exact value; draggable floats = value × 1000

> ⚠ **String-type parameters (Name, paths, text fields) count toward param indices but are invisible in Shift+Copy output.** They still occupy a slot. The most common trap: `Instrument` has `Blob Path` (string) at param 3 between `Blob Number` (param 2) and `Volume` (param 4). Never count param indices from doc tables alone — always verify with Shift+Copy.

**Shift+Copy is the primary way to get param indices.** In Gorilla Editor, Shift+click Copy on any parameter to copy the exact `set_module_param()` call to clipboard. Do this before writing any `set_module_param()` call for a module you haven't verified before.

### Examples

```
' Instrument Volume (param 4) — Name=1(str), Blob Number=2, Blob Path=3(str), Volume=4
set_module_param(M_INST, 0, 0, 4, 500000)

' Group 0 Volume (param 3) — Name=1(str), Active=2, Volume=3
set_module_param(M_GROUP+0, 0, 0, 3, Volume)

' Group 0, FilterLadder, Cutoff (param 2) — Bypass=1, Cutoff=2
' NOTE: ALL voice effects have Bypass as param 1. Cutoff/first control is always param 2.
set_module_param(M_GROUP+0, M_FILTER+2, 0, 2, Cutoff)

' Group 0, FilterLadder, Resonance (param 3)
set_module_param(M_GROUP+0, M_FILTER+2, 0, 3, Resonance)

' Group 0, Mod Source 1 (ADSR), Attack (param 2) — Name=1(str), Attack=2
set_module_param(M_GROUP+0, M_MOD_SRC+1, 0, 2, Attack)

' Group 0, Mod Source 1, Sustain (param 7)
' ADSR order: Attack=2, AttackCurve=3, Hold=4, Decay=5, DecayCurve=6, Sustain=7, Release=8, ReleaseCurve=9
set_module_param(M_GROUP+0, M_MOD_SRC+1, 0, 7, Sustain)

' Bus 1, Effect 1, parameter 2 (e.g. Delay Time)
set_module_param(M_BUS+1, M_EFFECT+1, 0, 2, DelayTime)

' Bus 1, Effect 1, Bypass (param 1)
set_module_param(M_BUS+1, M_EFFECT+1, 0, 1, 1)  ' bypass on
set_module_param(M_BUS+1, M_EFFECT+1, 0, 1, 0)  ' bypass off

' Mod Routing in Group: Source (param 2), CC (param 3), Depth (param 5), Smooth (param 6)
set_module_param(M_GROUP+0, 0, M_MOD+1, 2, 7)        ' Source = Velocity
set_module_param(M_GROUP+0, 0, M_MOD+1, 5, 500000)    ' Depth = 50%
set_module_param(M_GROUP+0, 0, M_MOD+1, 6, 250000)    ' Smooth = 25%

' Mod Routing inside a sub-module (e.g., mod routing inside a filter)
set_module_param(M_GROUP+0, M_FILTER+1, M_MOD+1, 5, Depth)

' Group Alternate Mapping (param 16)
set_module_param(M_GROUP+0, 0, 0, 16, mappingValue)
```

## Tune Parameter Taxonomy

Different tune-related parameters use different encodings. Using the wrong one is a common source of silent frequency bugs.

| Goal | What to set | Encoding |
|---|---|---|
| Pitch-offset a key-tracked group (oscillator or sample) | Group Tune, param 5 | Signed int, 100,000/semitone (+1 octave = 1,200,000) |
| Fine-tune instrument globally | Instrument Tune, param 5 | Signed int, 100,000/semitone |
| Fixed-frequency oscillator (Keytrack Off) | Oscillator Tune, param 2 (Sine/Analog), param 3 (Super) — verify via Shift+Copy | Absolute Hz — not semitones |
| Pitch modulation via mod matrix | ModRouting Dest = "Tune", group-level | 0–1,000,000 depth; full depth = Pitch Bend Range in semitones |

> ⚠ **Oscillator Tune (FilterSineOsc, FilterAnalogOsc, FilterSuperOsc) is an absolute frequency parameter, not a semitone offset.** Setting it to 0 via `set_module_param` will collapse the oscillator to ~2 Hz regardless of Keytrack state. For key-tracked oscillators, use **Group Tune (param 5)** to offset pitch instead — it compounds correctly with key-tracking.

### Bell partial example — per-group pitch offsets with Group Tune

```
' Tune 5 additive groups to inharmonic bell partials using Group Tune (param 5).
' Group Tune is a semitone offset from the played key (100,000 per semitone, signed).
' Oscillators in each group stay key-tracked — only the relative pitch offset changes.
const GRP_HUM     = 0  ' -12 st (octave below fundamental)
const GRP_PRIME   = 1  '   0 st (fundamental)
const GRP_TIERCE  = 2  '  +3 st (minor third above fundamental)
const GRP_QUINT   = 3  '  +7 st (fifth above fundamental)
const GRP_NOMINAL = 4  ' +12 st (octave above fundamental)

set_module_param(M_GROUP+GRP_HUM,     0, 0, 5, -1200000)
set_module_param(M_GROUP+GRP_PRIME,   0, 0, 5, 0)
set_module_param(M_GROUP+GRP_TIERCE,  0, 0, 5, 300000)
set_module_param(M_GROUP+GRP_QUINT,   0, 0, 5, 700000)
set_module_param(M_GROUP+GRP_NOMINAL, 0, 0, 5, 1200000)
```

## get_module_param(module, subModule, modRouting, param, outVar)

Read a parameter value.

- If `outVar` is a variable: gets numeric value
- If `outVar` is a string variable: gets display text
- If `outVar` is an array and param is array-type: reads values into array
- Returns: number of values read (0 if failed)

```
var value
get_module_param(M_BUS+1, M_EFFECT+1, 0, paramIndex, value)

var text$
get_module_param(M_GROUP+0, 0, 0, 1, text$)  ' get display text
```

## set_module_params / get_module_params

Set or read ALL parameters of a module at once.

```
var params[20]
get_module_params(M_GROUP+0, M_MOD_SRC+1, 0, params)  ' first value = count

params[3] = 500000  ' change attack
set_module_params(M_GROUP+0, M_MOD_SRC+1, 0, params)
```

## find_module_param(module, subModule, modRouting, "name")

Find parameter index by name (case sensitive). Returns index or -1. **Cache the result in `on init`.**

```
on init
  const CutoffParam = find_module_param(M_GROUP+0, M_FILTER+1, 0, "Cutoff")
  const LatencyParam = find_module_param(M_BUS+1, M_EFFECT+1, 0, "Latency")
end on
```

## get_module_param_name(module, subModule, modRouting, param)

Returns parameter name as string, or empty string if not found.

## set_effect_order(bus, effectIndexes[startPos])

Reorder effects in a bus without changing their indexes.

## Zone and Sample Functions

| Function | Description |
|----------|-------------|
| `get_num_zones(group)` | Zone count in group (negative for mapping) |
| `get_sample_length(zone)` | Sample length in μs |
| `num_slices_zone(zone)` | Number of slices |
| `zone_slice_start(zone, index)` | Slice position in μs |
| `zone_slice_length(zone, index)` | Slice length in μs at current tempo |
| `get_slice_length(group, zoneIndex)` | Slice Length param in μs |
| `find_zone(name)` | Find zone by sample path |

Zone ID for `get_sample_length()` etc.: use `prop_waveform` value or `1000000*groupIndex + zoneIndex`.

For mappings, use negative: `-1000000*mappingNumber + zoneIndex`.

```
var zoneID = -1000000 + 1  ' mapping 1, zone 1
var length = get_sample_length(zoneID)
var start = zone_slice_start(zoneID, 0)
```

## Group Functions

| Function | Description |
|----------|-------------|
| `find_group("name")` | Returns group index or -1. Cache in `on init`. |
| `find_mapping("name")` | Returns mapping index or 0. Cache in `on init`. |
| `purge_group(group, loaded)` | Unload (0) or load (1) samples. `ALL_GROUPS` supported. |
| `declare_latency(frames)` | Report audio latency to host for PDC |

## Inter-Script Communication

```
' Set parameter in another script
set_module_param(M_SCRIPT+2, 0, 0, paramIndex, value)

' Read parameter from another script
get_module_param(M_SCRIPT+2, 0, 0, paramIndex, outVar)

' Shared Data File
var Globals["My Data File"]  ' declare in each script

' Trigger event across scripts
trigger_new_event()  ' fires on new_event in all scripts

' Set EVENT_PARAMs for later scripts to read
set_event_param(EVENT_ID, EVENT_PARAM_0, myValue)
```
