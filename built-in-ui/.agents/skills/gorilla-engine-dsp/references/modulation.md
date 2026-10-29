# Modulation Reference

## Modulation Architecture

Each Group can contain:

- Up to **16 mod sources** (ADSR envelopes, Custom envelopes, LFOs, Step Sequencers)
- Up to **64 mod routings** connecting sources to destinations
- Up to **16 voice effects/filters** that can be modulation destinations

Mod routings in the instrument are set up in Gorilla Editor but can be fully controlled from script.

`M_MOD+n` identifies the routing's one-based position in the Group's `ModRoutings` array, not the selected source. For example, a routing whose Source is `Mod 4` may be `M_MOD+5` when it is the fifth array entry.

## Mod Source Types

### ADSR Envelope (ModSourceADSR)

Standard synthesizer envelope. Parameters:

1. Name
2. Attack (0–1,000,000 → exponential time)
3. Attack Curve (-100% to +100%)
4. Hold
5. Decay (exponential time)
6. Decay Curve (-100% to +100%)
7. Sustain (0–1,000,000 = 0–100%)
8. Release (exponential time)
9. Release Curve (-100% to +100%)
10. Hold End Level
11. Times x10
12. Tempo Sync

```
' Set ADSR Attack for first mod source in Group 0
set_module_param(M_GROUP+0, M_MOD_SRC+1, 0, 2, attackValue)

' Set Sustain (param 7 — Decay Curve occupies param 6)
set_module_param(M_GROUP+0, M_MOD_SRC+1, 0, 7, sustainValue)
```

### LFO (ModSourceLFO)

Low Frequency Oscillator. Parameters:

1. Name
2. Wave (Sine, Triangle, Square, Saw, Random, Drift, Saw Up, Saw Exp)
3. Rate (exponential: Hz)
4. Sync (tempo sync on/off)
5. Retrigger
6. Start Phase
7. Unipolar (0 = bipolar ±1, 1 = unipolar 0–1)

```
set_module_param(M_GROUP+0, M_MOD_SRC+2, 0, 3, rateValue)   ' LFO Rate
set_module_param(M_GROUP+0, M_MOD_SRC+2, 0, 4, syncOn)       ' LFO Sync
set_module_param(M_GROUP+0, M_MOD_SRC+2, 0, 5, 1)            ' Retrigger on
```

An LFO can contain its own `ModRoutings` array. These nested routes modulate LFO parameters such as Intensity. For example, an active MIDI CC route to Intensity can reduce the LFO output to zero while that CC is zero. Inspect nested routes when an LFO appears silent; disable an unwanted first nested route with:

```
set_module_param(M_GROUP+0, M_MOD_SRC+2, M_MOD+1, 1, 0)
```

### Step Sequencer (ModSourceStepSeq)

Step sequence generator. Parameters include steps array, rate, sync, smooth, retrigger.

### Custom Envelope (ModSourceCustom)

Multi-point customizable curve with editable points.

## Mod Routing Parameters

Each mod routing (M_MOD+n) has these parameters:

| Index | Parameter        | Description                                                    |
| ----- | ---------------- | -------------------------------------------------------------- |
| 1     | Active           | Enable/disable routing                                         |
| 2     | Source           | Mod source index (see table below)                             |
| 3     | CC               | MIDI CC number for CC-based sources                            |
| 4     | Invert           | Invert the modulation signal                                   |
| 5     | Depth            | Modulation amount (0–1,000,000)                                |
| 6     | Smooth           | Smoothing/glide time (0–1,000,000, exponential)                |
| 7     | Dest             | Destination parameter (in display order)                       |
| 8     | Curve Active     | Enable curve shaping of the source signal.                     |
| 9     | Curve            | Custom curve points applied to source when Curve Active is on. |
| 10    | Use MIDI Channel | Per-channel modulation (for MPE)                               |

### Mod Source Index Values

| Index                    | Source                                 |
| ------------------------ | -------------------------------------- |
| 0                        | Constant                               |
| 1                        | Random                                 |
| 2                        | Random (positive only)                 |
| 3                        | Pitch Bend                             |
| 4                        | Aftertouch                             |
| 5                        | MIDI CC (specify CC number in param 3) |
| 6                        | Key Position                           |
| 7                        | Velocity                               |
| 8                        | Release Velocity                       |
| 9                        | Glide                                  |
| 10                       | Release Timer                          |
| FIRST_GROUP_MOD_SOURCE+0 | First group mod source (e.g., Amp Env) |
| FIRST_GROUP_MOD_SOURCE+1 | Second group mod source (e.g., LFO)    |
| FIRST_GROUP_MOD_SOURCE+n | nth group mod source                   |

## set_mod_dest — Scriptable Mod Matrix

```
set_mod_dest(group, modRouting, subModule, dest, ampMod)
```

Dynamically route a mod routing to any destination in the group.

- `group`: `M_GROUP+n`
- `modRouting`: `M_MOD+n`
- `subModule`: `M_GROUP` (group itself), `M_MOD_SRC+n`, or `M_FILTER+n`
- `dest`: Modulation-destination ordinal from 1, in the same order shown by that module's Mod Routing Dest menu
- `ampMod`: 0 = offset, 1 = scale

```
' Route Mod Routing 4 to Filter 2 Cutoff (first modulatable destination)
set_mod_dest(M_GROUP+0, M_MOD+4, M_FILTER+2, 1, 0)

' Route to Group Tune (third group modulation destination)
set_mod_dest(M_GROUP+0, M_MOD+5, M_GROUP, 3, 0)

' Route to Group Volume (first group modulation destination)
set_mod_dest(M_GROUP+0, M_MOD+5, M_GROUP, 1, 1)

' Disable routing (dest 0)
set_mod_dest(M_GROUP+0, M_MOD+4, 0, 0, 0)
```

> **Do not use `set_module_param` indices for `dest`.** `set_mod_dest` counts only destinations exposed in the Mod Routing Dest menu. For example, FilterLadder Cutoff is module parameter 2 because Bypass is parameter 1, but it is modulation destination 1; Group Tune is module parameter 5 but modulation destination 3.

`set_mod_dest` changes only the destination and offset/scale mode. It does not configure Active, Source, CC, Invert, Depth, or Smooth. Set those route parameters separately with `set_module_param`.

### Initialize Script-Controlled Routes

Property defaults do not invoke property callbacks. If callbacks control a route, configure its initial source, destination, depth, active state, and relevant mod-source parameters directly in `on init` as well. Otherwise the initial sound depends on values serialized in the `.inst` file.

```
on init
  const LFO = M_MOD_SRC + 4      'fourth ModSources entry
  const LFO_ROUTE = M_MOD + 5    'fifth ModRoutings entry

  prop_exp LFO_Rate(1000000, 10, 100000) = 694589
  prop_linear LFO_Amount(0, 1000, 10) = 250

  set_module_param(M_GROUP+0, LFO, 0, 3, LFO_Rate)
  set_module_param(M_GROUP+0, LFO, M_MOD+1, 1, 0) 'disable unwanted nested intensity route
  set_module_param(M_GROUP+0, 0, LFO_ROUTE, 1, 1) 'Active
  set_module_param(M_GROUP+0, 0, LFO_ROUTE, 2, FIRST_GROUP_MOD_SOURCE+3)
  set_mod_dest(M_GROUP+0, LFO_ROUTE, M_FILTER+2, 1, 0) 'Cutoff is mod destination 1
  set_module_param(M_GROUP+0, 0, LFO_ROUTE, 5, 1000 * LFO_Amount)
end on
```

## set_mod_sources — Analog-Style Triggering

```
set_mod_sources(destEventID, sourceEventID, mask, retrig)
```

Copy or retrigger envelope/LFO states between events.

- `mask`: Bitmask of mod sources (1=first, 2=second, 4=third, 8=fourth...)
- `retrig`: 0 = continue from current position, 1 = retrigger from start

```
' Retrigger all mod sources for mono legato
set_mod_sources(currentEvent, 0, 0xF, 0)

' Copy mod source state from old event to new (for crossfade transitions)
set_mod_sources(newEvent, oldEvent, 1023, 0)

' Retrigger just the amp envelope (first mod source)
set_mod_sources(currentEvent, 0, 1, 1)
```

## Mod Matrix Pattern

Complete example of a scriptable mod matrix:

```
on init
  const MOD_MATRIX = M_MOD + 4  ' first routing reserved for mod matrix

  ' Define sources
  const NUM_SOURCES = 5
  const SourceNames[NUM_SOURCES] = ("Velocity", "Mod Wheel", "Aftertouch", "LFO", "Envelope")
  const SourceIndex[NUM_SOURCES] = (7, 5, 4, FIRST_GROUP_MOD_SOURCE+1, FIRST_GROUP_MOD_SOURCE+2)
  const SourceCC[NUM_SOURCES] = (1, 1, 1, 0, 0)

  ' Define destinations
  const NUM_DESTS = 4
  const DestNames[NUM_DESTS] = ("-", "Cutoff", "Resonance", "Volume")
  const DestModule[NUM_DESTS] = (0, M_FILTER+1, M_FILTER+1, 0)
  const DestParam[NUM_DESTS] = (0, 1, 2, 1)  ' modulation-destination ordinals, not module parameter indices
  const DestAmpMod[NUM_DESTS] = (0, 0, 0, 1)

  ' Properties
  prop_stepped Mod_Source
  prop_squared Mod_Depth(-1000000, 1000000, -100, 100)
  prop_stepped Mod_Dest

  var i = 0
  while i < NUM_SOURCES
    add_step(Mod_Source, SourceNames[i])
    inc(i)
  end while
  i = 0
  while i < NUM_DESTS
    add_step(Mod_Dest, DestNames[i])
    inc(i)
  end while
end on

on Mod_Source
  set_module_param(M_GROUP+0, 0, MOD_MATRIX, 2, SourceIndex[Mod_Source])
  set_module_param(M_GROUP+0, 0, MOD_MATRIX, 3, SourceCC[Mod_Source])
end on

on Mod_Depth
  set_module_param(M_GROUP+0, 0, MOD_MATRIX, 4, Mod_Depth < 0)
  set_module_param(M_GROUP+0, 0, MOD_MATRIX, 5, abs(Mod_Depth))
end on

on Mod_Dest
  set_mod_dest(M_GROUP+0, MOD_MATRIX, DestModule[Mod_Dest], DestParam[Mod_Dest], DestAmpMod[Mod_Dest])
  set_module_param(M_GROUP+0, 0, MOD_MATRIX, 1, Mod_Dest > 0)  ' Active
end on
```

## Effect Modulation (EffectMod)

Bus effects can be modulated using EffectMod modules. These have:

- Source selection (CC, LFO, envelope follower, step LFO)
- Destination parameter selection
- Depth and smoothing
- Built-in step LFO with custom pattern

Controlled via `set_module_param(M_BUS+n, M_EFFECT+n, ...)` where the effect is an EffectMod.
