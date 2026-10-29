# Index Derivation Cheat Sheet

Every script constant (`M_GROUP`, `M_FILTER`, `M_BUS`, etc.) maps directly to an **array position** in the `.inst` JSON file. Read the file, count positions, apply the formula.

> ⚠ **Critical gotcha — the only 0-based constants:** > `M_GROUP` and `M_VGROUP` are the **only** 0-based constants.
> Every other constant (`M_BUS`, `M_FILTER`, `M_MOD_SRC`, `M_MOD`, `M_EFFECT`, `M_COND`, `M_MAPPING`, `M_SCRIPT`, `M_MIDI`, `M_DATA`, `M_ZONE`) starts at **1**.

---

## Complete Derivation Table

`n` = 0-based position of the item in its JSON array (first item = 0, second = 1, …)

| `.inst` JSON array       | Script constant | Base  | Formula           | Example (first item)               |
| ------------------------ | --------------- | ----- | ----------------- | ---------------------------------- |
| `"Groups"[n]`            | `M_GROUP`       | **0** | `M_GROUP+n`       | `M_GROUP+0`                        |
| `"Voice Groups"[n]`      | `M_VGROUP`      | **0** | `M_VGROUP+n`      | `M_VGROUP+0` (= Instrument Voices) |
| `"FX Busses"[n]`         | `M_BUS`         | 1     | `M_BUS+(n+1)`     | `M_BUS+1`                          |
| `"Mappings"[n]`          | `M_MAPPING`     | 1     | `M_MAPPING+(n+1)` | `M_MAPPING+1`                      |
| `"Scripts"[n]`           | `M_SCRIPT`      | 1     | `M_SCRIPT+(n+1)`  | `M_SCRIPT+1`                       |
| `"MIDI Files"[n]`        | `M_MIDI`        | 1     | `M_MIDI+(n+1)`    | `M_MIDI+1`                         |
| `"Data Files"[n]`        | `M_DATA`        | 1     | `M_DATA+(n+1)`    | `M_DATA+1`                         |
| group `"Conditions"[n]`  | `M_COND`        | 1     | `M_COND+(n+1)`    | `M_COND+1`                         |
| group `"ModSources"[n]`  | `M_MOD_SRC`     | 1     | `M_MOD_SRC+(n+1)` | `M_MOD_SRC+1`                      |
| group `"Filters"[n]`     | `M_FILTER`      | 1     | `M_FILTER+(n+1)`  | `M_FILTER+1`                       |
| group `"Zones"[n]`       | `M_ZONE`        | 1     | `M_ZONE+(n+1)`    | `M_ZONE+1`                         |
| group `"ModRoutings"[n]` | `M_MOD`         | 1     | `M_MOD+(n+1)`     | `M_MOD+1`                          |
| bus `"Effects"[n]`       | `M_EFFECT`      | 1     | `M_EFFECT+(n+1)`  | `M_EFFECT+1`                       |

> **A routing index is not a source index.** `M_MOD+n` always identifies the routing's position in the containing `ModRoutings` array. A routing with `"Source": "Mod 4"` can therefore be `M_MOD+5` when it is the fifth array entry. Count the array; do not derive `M_MOD` from the source label.

---

## Per-Group Scope

`M_FILTER`, `M_MOD_SRC`, `M_MOD`, `M_COND`, and `M_ZONE` are **relative to their group**. The same index in two different groups refers to two completely different modules:

```
' M_FILTER+1 in Group 0 → first item in Groups[0].Filters[]
set_module_param(M_GROUP+0, M_FILTER+1, 0, 2, Cutoff)  ' Bypass = param 1, Cutoff = param 2

' M_FILTER+1 in Group 1 → first item in Groups[1].Filters[] — different module type entirely
set_module_param(M_GROUP+1, M_FILTER+1, 0, 2, Cutoff)  ' Bypass = param 1, Cutoff = param 2
```

Always derive indices **per group** when reading the `.inst` file.

---

## Worked Example

Given this `.inst` structure:

```json
{
  "Groups": [
    {
      "Module": "Group",
      "Name": "Synth",
      "ModSources": [{ "Module": "ModSourceADSR" }, { "Module": "ModSourceLFO" }],
      "ModRoutings": [{ "Module": "ModRouting" }, { "Module": "ModRouting" }],
      "Filters": [{ "Module": "FilterAnalogOsc" }, { "Module": "FilterLP12" }]
    },
    {
      "Module": "Group",
      "Name": "Sub",
      "ModSources": [{ "Module": "ModSourceADSR" }],
      "ModRoutings": [{ "Module": "ModRouting" }],
      "Filters": [{ "Module": "FilterSineOsc" }]
    }
  ],
  "Voice Groups": [{ "Module": "VoiceGroup" }],
  "FX Busses": [
    {
      "Module": "EffectBus",
      "Name": "Reverb Bus",
      "Effects": [{ "Module": "EffectReverb" }, { "Module": "EffectDelay" }]
    },
    { "Module": "EffectBus", "Name": "Master", "Effects": [{ "Module": "EffectLimiter" }] }
  ],
  "Mappings": [{ "Module": "Mapping", "Name": "RR2" }],
  "Scripts": [{ "Module": "Script", "Script Path": "script.txt" }]
}
```

Derived indices:

| Item                           | Derived index            |
| ------------------------------ | ------------------------ |
| Group "Synth"                  | `M_GROUP+0`              |
| Group "Sub"                    | `M_GROUP+1`              |
| Instrument Voices              | `M_VGROUP+0`             |
| FX Bus "Reverb Bus"            | `M_BUS+1`                |
| FX Bus "Master"                | `M_BUS+2`                |
| Mapping "RR2"                  | `M_MAPPING+1`            |
| Script                         | `M_SCRIPT+1`             |
| Group 0 — ADSR (ModSourceADSR) | `M_GROUP+0, M_MOD_SRC+1` |
| Group 0 — LFO (ModSourceLFO)   | `M_GROUP+0, M_MOD_SRC+2` |
| Group 0 — first ModRouting     | `M_GROUP+0, … M_MOD+1`   |
| Group 0 — second ModRouting    | `M_GROUP+0, … M_MOD+2`   |
| Group 0 — Analog Oscillator    | `M_GROUP+0, M_FILTER+1`  |
| Group 0 — LP12 Filter          | `M_GROUP+0, M_FILTER+2`  |
| Group 1 — ADSR                 | `M_GROUP+1, M_MOD_SRC+1` |
| Group 1 — Sine Oscillator      | `M_GROUP+1, M_FILTER+1`  |
| Bus 1 — Reverb                 | `M_BUS+1, M_EFFECT+1`    |
| Bus 1 — Delay                  | `M_BUS+1, M_EFFECT+2`    |
| Bus 2 — Limiter                | `M_BUS+2, M_EFFECT+1`    |

---

## Quick Formula Summary

```
' 0-based (only these two):
M_GROUP+0   → Groups[0]
M_VGROUP+0  → Voice Groups[0]

' 1-based (everything else):
M_BUS+1     → FX Busses[0]   (position 0 → index 1)
M_FILTER+1  → group.Filters[0]
M_MOD_SRC+1 → group.ModSources[0]
M_MOD+1     → group.ModRoutings[0]
M_EFFECT+1  → bus.Effects[0]
M_MAPPING+1 → Mappings[0]
M_COND+1    → group.Conditions[0]
M_ZONE+1    → group.Zones[0]
M_SCRIPT+1  → Scripts[0]
M_MIDI+1    → MIDI Files[0]
M_DATA+1    → Data Files[0]
```
