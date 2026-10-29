# Quick Start

The mandatory workflow and script language contract live in [SKILL.md](../SKILL.md). Load the focused references linked there for indexing, module control, events, properties, timing, and module-specific behavior.

## Script Example

```
on init
  prop_linear Volume(0, 1000000, 1) = 500000
  prop_exp Cutoff(1000000, 20000, 25000000) = 549000  ' 20 Hz to 25 kHz
  prop_boolean Filter_On = 1
end on

on Volume
  set_module_param(M_INST, 0, 0, 4, Volume)  ' Instrument Volume (Name=1 str, BlobNum=2, BlobPath=3 str, Volume=4)
end on

on Cutoff
  set_module_param(M_GROUP+0, M_FILTER+1, 0, 2, Cutoff)  ' Filter Cutoff (Bypass=1, Cutoff=2 for all voice effects)
end on

on note
  if Filter_On == 0
    group_off(EVENT_ID, ALL_GROUPS)
    group_on(EVENT_ID, 1)  ' play only the unfiltered group
  end if
end on
```

---

## Minimal working example: instrument file

```json
{
  "Module": "Instrument",
  "Name": "Default Instrument",
  "Version": "2.0.4",
  "Groups": [
    {
      "Module": "Group",
      "ModSources": [
        {
          "Module": "ModSourceADSR",
          "Name": "Amp Env",
          "Sustain": 1.0
        }
      ],
      "ModRoutings": [
        { "Module": "ModRouting", "Source": "Mod 1", "Depth": 1.0 },
        { "Module": "ModRouting", "Source": "Velocity", "Depth": 1.0 },
        {
          "Module": "ModRouting",
          "Source": "Pitch Bend",
          "Depth": 1.0,
          "Smooth": 0.25906554,
          "Dest": "Tune"
        }
      ]
    }
  ],
  "Voice Groups": [{ "Module": "VoiceGroup" }],
  "Scripts": [
    {
      "Module": "Script",
      "Script Path": "script.txt",
      "Script": "on init\nend on\n\non note\nend on\n\non release\nend on\n"
    }
  ]
}
```

For oscillator-only instruments (no sample), add an empty zone inside the group so voices trigger:

```json
"Zones": [
  { "Module": "Zone", "Sample": "" }
]
```
