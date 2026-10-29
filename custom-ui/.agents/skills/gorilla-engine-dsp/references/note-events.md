# Note Events Reference

## Built-In Event Variables

Available in `on note`, `on release`, and related callbacks:

| Variable             | Description                                                       |
| -------------------- | ----------------------------------------------------------------- |
| `EVENT_ID`           | Unique ID for the current note event                              |
| `EVENT_KEY`          | MIDI note number (0–127)                                          |
| `EVENT_VEL`          | Velocity (1–127)                                                  |
| `EVENT_CHAN`         | MIDI channel                                                      |
| `EVENT_HELD`         | 1 if key still held, 0 if released                                |
| `EVENT_RELEASE_VEL`  | Release velocity (in `on release`, default 64)                    |
| `CALLBACK_ID`        | Unique ID for current callback instance (used with `end_delay()`) |
| `CC[]`               | Array of current MIDI CC values (0–127)                           |
| `KEY_DOWN[0-127]`    | 1 if MIDI note held, 0 if not                                     |
| `KEY_DOWN_OCT[0-11]` | 1 if any note of that pitch class is held                         |

## Creating and Releasing Notes

### new_note(key, vel, start, length)

Trigger a new note programmatically.

- `key`: MIDI note number (0–127)
- `vel`: Velocity (1–127)
- `start`: Sample start offset in microseconds (0 = normal start)
- `length`: Duration — `0` = until `release_note()`, `-1` = until parent note released, `-2` = one-shot (play to end)
- Returns: event ID

```
' Trigger a note that follows the parent
var child = new_note(EVENT_KEY + 12, EVENT_VEL, 0, -1)

' Trigger a one-shot note
new_note(60, 100, 0, -2)

' Trigger with sample start offset
new_note(EVENT_KEY, EVENT_VEL, 500000, 0)  ' start 500ms into sample
```

### release_note(event)

End a note (as if key released). Can use `ALL_EVENTS` to release all.

```
release_note(myEvent)
release_note(ALL_EVENTS)
```

### ignore_event(EVENT_ID)

- In `on note`: Don't forward event to later scripts, don't trigger voices
- In `on release`: Ignore release so note continues playing

Must be `EVENT_ID` (current event only).

```
on note
  ignore_event(EVENT_ID)  ' suppress — we'll create our own notes
  new_note(EVENT_KEY, EVENT_VEL, 0, 0)
end on
```

### voices_playing(event)

Returns 1 if event has voices still sounding, 0 if silent.

```
if voices_playing(myEvent)
  release_note(myEvent)
end if
```

## Modifying Note Parameters

### set_key(event, key)

Change which key the event plays. **Must be set before voices start** (i.e., before the first `delay()` or end of `on note`).

```
set_key(EVENT_ID, EVENT_KEY + 12)  ' transpose up one octave
```

### set_vel(event, vel)

Change velocity. **Must be set before voices start.**

```
set_vel(EVENT_ID, 127)  ' force max velocity
```

### set_tune(event, tune, relative)

Change pitch of playing voices.

- `tune`: 1,000 per cent, 100,000 per semitone
- `relative`: 0 = absolute, 1 = add to current

```
set_tune(EVENT_ID, 100000, 1)    ' pitch up 1 semitone
set_tune(EVENT_ID, -50000, 1)    ' pitch down half a semitone
set_tune(ALL_EVENTS, 0, 0)       ' reset all to original pitch
```

### set_vol(event, vol, relative)

Change volume in 1/1000ths dB.

- `relative`: 0 = absolute, 1 = add to current

```
set_vol(EVENT_ID, -3000, 1)      ' reduce by 3 dB
set_vol(EVENT_ID, 6000, 0)       ' set to +6 dB
```

### set_pan(event, pan, relative)

Change pan. Range: -1000 (left) to 1000 (right).

```
set_pan(EVENT_ID, -500, 0)       ' pan half-left
```

### fade_in(event, microseconds)

Fade in voices over specified duration.

```
fade_in(myEvent, 20000)  ' 20ms fade in
```

### fade_out(event, microseconds, stop)

Fade out voices. `stop`: 0 = continue silent, 1 = stop voices after fade.

```
fade_out(myEvent, 50000, 1)    ' 50ms fade out then stop
fade_out(ALL_EVENTS, 10000, 0) ' fade all, keep alive
```

### fade_out_after(event, delay_usec, fade_usec)

Fade out after sample position advances by delay_usec. Useful for sliced playback.

```
fade_out_after(sliceEvent, sliceLength, 5000)  ' fade after slice ends
```

## Event Parameters

Per-event values that can be used as mod sources or control playback:

All event parameters default to `0`. Set playback parameters such as `EVENT_PARAM_ALT_MAPPING`, `EVENT_PARAM_REVERSE`, and `EVENT_PARAM_START_POS` before voices start.

### set_event_param(event, param, value) / get_event_param(event, param)

| Parameter                          | Description                                        | When to Set         |
| ---------------------------------- | -------------------------------------------------- | ------------------- |
| `EVENT_PARAM_0` to `EVENT_PARAM_7` | Custom values, usable as mod sources               | Anytime             |
| `EVENT_PARAM_ALT_MAPPING`          | Which alternate mapping to use                     | Before voices start |
| `EVENT_PARAM_DELAY`                | Delay before voices start (μs)                     | Before voices start |
| `EVENT_PARAM_REVERSE`              | Set to 1 for reverse playback                      | Before voices start |
| `EVENT_PARAM_START_POS`            | Sample start offset (μs)                           | Before voices start |
| `EVENT_PARAM_KEY`                  | Read the key (read-only)                           | Anytime             |
| `EVENT_PARAM_VEL`                  | Read the velocity (read-only)                      | Anytime             |
| `EVENT_PARAM_TUNE`                 | Read current tune (read-only)                      | Anytime             |
| `EVENT_PARAM_VOL`                  | Read current volume (read-only)                    | Anytime             |
| `EVENT_PARAM_PAN`                  | Read current pan (read-only)                       | Anytime             |
| `EVENT_PARAM_NOTE_LENGTH`          | Time since event started (μs, read-only)           | Anytime             |
| `EVENT_PARAM_PLAY_POS`             | Sample playback position (μs, read-only)           | Anytime             |
| `EVENT_PARAM_SOURCE`               | -1=external, 0=script 1, 1=script 2... (read-only) | Anytime             |

**Using EVENT_PARAM as mod source for glide/repitch:**

```
' Mod routing: Event Param 0 → Tune (set up in Gorilla Editor)
' Then in script:
set_event_param(monoEvent, EVENT_PARAM_0, 83333 * (prevKey - newKey))
delay(1)  ' let new event start
set_event_param(monoEvent, EVENT_PARAM_0, 0)  ' glide target
```

(83,333 ≈ 100,000/1.2 — the scaling for Event Param to semitones depends on mod routing depth)

## Group Selection

Control which groups play for a note event. **Must be set before voices start.**

```
group_off(EVENT_ID, ALL_GROUPS)  ' disable all groups
group_on(EVENT_ID, 0)           ' enable group 0 only
group_on(EVENT_ID, 2)           ' also enable group 2
```

| Function                  | Description                          |
| ------------------------- | ------------------------------------ |
| `group_off(event, group)` | Disable group. `ALL_GROUPS` for all. |
| `group_on(event, group)`  | Re-enable group after `group_off`.   |

Groups are indexed from 0. `NUM_GROUPS` gives the total count.

## Event Tagging

Tag events for bulk operations:

```
tag_event(myEvent, TAG_1)
tag_event(myEvent, TAG_1 + TAG_2)    ' multiple tags
untag_event(myEvent, TAG_1)

' Apply to all tagged events
set_tune(tagged_events(TAG_1), 100000, 1)
release_note(tagged_events(TAG_2))
```

Available: `TAG_1` through `TAG_16`.

## Event ID Helpers

```
get_event_ids(array)       ' Fill array with IDs of playing events, returns count
get_event_tags(event)      ' Returns combined tag value
```

## MIDI Controller Functions

```
on controller
  if EVENT_CC == 1           ' mod wheel
    ' handle mod wheel
  end if
  if EVENT_CC == CC_PITCHBEND
    ' handle pitch bend (-8192 to 8191)
  end if
  if EVENT_CC == CC_AFTERTOUCH
    ' handle channel aftertouch
  end if
end on

ignore_controller()                 ' Don't update CC for mod routings
set_controller(cc, value)           ' Set a CC value (0–127)
set_controller(CC_PITCHBEND, val)   ' Set pitch bend (-8192 to 8191)
set_controller_hd(ch, cc, val, max) ' High-resolution CC
```

### set_controller — CC Bridge Pattern

`set_controller(cc, value)` sets a MIDI CC globally. Every mod routing in the instrument with `Source: "MIDI CC"` and a matching CC number responds immediately. This is the standard way to bridge a script property to the mod matrix when a routing is already set up in Gorilla Editor — the script just broadcasts the value rather than targeting a specific module param.

Common uses:

- **Crossfade between layers**: CC drives volume mod routings per group (see Crossfade pattern)
- **Custom Env segment timing**: CC routed to `Dest: "Time 1"` inside a `ModSourceCustom` makes envelope speed scriptable (see Glide pattern)
- **Any CC-controlled mod routing**: lighter than `set_module_param` when the routing is static

```
' Script property drives CC 5, which a Custom Env routing maps to glide speed:
on Glide_Time  ' prop_linear Glide_Time(0, 127, 1)
  set_controller(5, Glide_Time)
end on
```

## MIDI Output

```
send_midi_out(MIDI_COMMAND_NOTE_ON + channel, key, velocity)
send_midi_out(MIDI_COMMAND_CC + channel, cc, value)
```

## Polyphonic Aftertouch

```
on poly_at
  ' POLY_AT_KEY = which key
  ' POLY_AT[key] = pressure value
end on
```
