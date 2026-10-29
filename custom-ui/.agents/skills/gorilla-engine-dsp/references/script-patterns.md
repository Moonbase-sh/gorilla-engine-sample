# Script Patterns Reference

Real-world patterns for common audio DSP tasks in Gorilla Engine scripts.

## Arpeggiator

Uses `delay_ppq()` in a `while` loop to step through held notes at musical intervals. Cancel with `end_delay()`.

```
on init
  var seqCallback
  var seqEvent = -1
  var seqPos
  var heldKeys[16]
  var numHeldKeys
  var i

  prop_stepped Rate = 6
    add_step(Rate, "1/4")
    add_step(Rate, "1/8")
    add_step(Rate, "1/16")
  var rateToPPQ[3] = (960, 480, 240)

  prop_linear Gate(0, 100, 1) = 75
    set_prop_param(Gate, PROP_UNITS, "%")

  prop_stepped Mode
    add_step(Mode, "Up")
    add_step(Mode, "Down")
    add_step(Mode, "Random")
end on

function NextStep()
  release_note(seqEvent)

  ' advance position
  select Mode
    case 0  ' Up
      inc(seqPos)
      if seqPos >= numHeldKeys
        seqPos = 0
      end if
    case 1  ' Down
      dec(seqPos)
      if seqPos < 0
        seqPos = numHeldKeys - 1
      end if
    case 2  ' Random
      seqPos = random(0, numHeldKeys - 1)
  end select

  seqEvent = new_note(heldKeys[seqPos], 100, 0, 0)
  group_on(seqEvent, ALL_GROUPS)

  i = rateToPPQ[Rate]
  delay_ppq((i * Gate) / 100)  ' gate portion

  if seqCallback == CALLBACK_ID
    release_note(seqEvent)
    delay_ppq(i - (i * Gate) / 100)  ' rest
  end if
end function

function StopSequence()
  var temp = seqCallback
  seqCallback = 0
  end_delay(temp, 0)
  release_note(temp)
  release_note(seqEvent)
end function

function StartSequence()
  if seqCallback
    StopSequence()
  end if
  seqPos = -1
  seqCallback = CALLBACK_ID
  while seqCallback == CALLBACK_ID
    NextStep()
  end while
end function

on note
  ' ... add to heldKeys, then:
  group_off(EVENT_ID, ALL_GROUPS)
  StartSequence()
end on

on release
  ' ... remove from heldKeys
  if numHeldKeys == 0
    StopSequence()
  else if EVENT_ID == seqCallback
    ignore_event(EVENT_ID)
  end if
end on
```

## Mono / Legato / Glide

Maintains a held-note stack. When in mono mode, one voice is re-used with pitch changes instead of creating new voices.

### Simple Mono with Glide via EVENT_PARAM

```
on init
  prop_boolean Mono = 1
  prop_exp Glide_Time(1000000, 0, 10000) = 250000
    set_prop_param(Glide_Time, PROP_UNITS, "sec")

  var heldNotes[128]
  var numHeldNotes
  var currentEvent = 0
  var i
end on

on Glide_Time
  ' Set smoothing on the mod routing from Event Param 0 to Tune
  set_module_param(M_GROUP+0, 0, M_MOD+4, 6, Glide_Time)
end on

on note
  ' ... add EVENT_KEY to heldNotes ...
  if Mono
    ignore_event(EVENT_ID)
    if currentEvent == 0
      currentEvent = new_note(60, EVENT_VEL, 0, 0)
    end if
    set_event_param(currentEvent, EVENT_PARAM_0, 83333 * (EVENT_KEY - 60))
  end if
end on

on release
  ' ... remove from heldNotes ...
  if Mono and numHeldNotes
    set_event_param(currentEvent, EVENT_PARAM_0, 83333 * (heldNotes[numHeldNotes-1] - 60))
  else if currentEvent
    release_note(currentEvent)
    currentEvent = 0
  end if
end on
```

### Glide via ModSourceCustom + set_controller (CC Bridge)

A second approach where the glide curve shape and speed are controlled by a `ModSourceCustom` whose internal timing is driven by a MIDI CC. The script forwards a UI property to the CC; the instrument's mod matrix does the rest.

**Required .inst topology** — set up in Gorilla Editor because this pattern depends on an editor-generated `ModSourceCustom` curve and modulation curve whose array formats must not be synthesized:

1. Add a `ModSourceCustom` to the group (e.g. `"Glide Curve"`)
2. Inside it, add a `ModRouting`: `Source: "MIDI CC"`, `CC: 5`, `Dest: "Time 1"`, `Curve Active: "On"` with a timing curve baked in
3. Add a group-level `ModRouting` from this mod source to `Dest: "Tune"`

```
on init
  prop_linear Glide_Time(0, 127, 1) = 64  ' range matches CC 0–127
end on

on Glide_Time
  set_controller(5, Glide_Time)  ' CC 5 → Custom Env "Time 1" → glide speed
end on
```

**Advantage over EVENT_PARAM + Smooth:** The glide curve shape is fully editable in the editor; you can have non-linear glide responses without any additional script logic.

**General CC Bridge rule:** `set_controller(cc, value)` broadcasts to all mod routings with a matching MIDI CC source — one script line drives any number of mod matrix destinations simultaneously.

```
prop_stepped Mono_Mode = 2
  add_step(Mono_Mode, "Retrig")    ' release + new note
  add_step(Mono_Mode, "Repitch")   ' set_tune on existing voice
  add_step(Mono_Mode, "Xfade")     ' crossfade old→new at playback position

function legatoTrigger()
  select Mono_Mode
    case 0  ' Retrig
      release_note(monoEvent)
      monoEvent = new_note(newKey, newVel, 0, 0)

    case 1  ' Repitch
      set_event_param(monoEvent, EVENT_PARAM_0, ...)

    case 2  ' Crossfade
      fade_out(monoEvent, 1000 * Xfade_Length, 1)
      monoEvent = new_note(newKey, newVel, get_event_param(monoEvent, EVENT_PARAM_PLAY_POS), 0)
      fade_in(monoEvent, 1000 * Xfade_Length)
      delay(1)
      set_mod_sources(monoEvent, oldEvent, 1023, 0)  ' copy envelope state
  end select
end function
```

## Round Robin

Cycle through alternate sample sets using `EVENT_PARAM_ALT_MAPPING`.

```
on init
  const MAX_RR = 5
  var rr_value
  var rr_time

  prop_stepped RR_Mode
    add_step(RR_Mode, "Cycle")
    add_step(RR_Mode, "Random")
    add_step(RR_Mode, "Random Excl.")

  prop_linear RR_Min_Time(0, 100, 1) = 50
    set_prop_param(RR_Min_Time, PROP_UNITS, "ms")
end on

on note
  var now = TIME_MSEC
  if now - rr_time >= RR_Min_Time
    select RR_Mode
      case 0; rr_value = (rr_value + 1) mod MAX_RR
      case 1; rr_value = random(0, MAX_RR - 1)
      case 2; rr_value = (rr_value + random(1, MAX_RR - 1)) mod MAX_RR
    end select
    rr_time = now
  end if
  set_event_param(EVENT_ID, EVENT_PARAM_ALT_MAPPING, rr_value)
end on
```

## Crossfade Between Layers

Crossfade between groups using MIDI CCs or direct module params.

### Using CC-controlled mod routings

```
' Each group has a mod routing: CC(n) → Volume
' Script sets CC values for each group to control crossfade

on init
  const MAX_LAYERS = 5
  var currentLayer
  var x

  prop_linear Num_Layers(1, MAX_LAYERS, 1) = MAX_LAYERS
  prop_boolean Equal_Power = 1
end on

function update_crossfade()
  if x == 127
    x = 128 * (Num_Layers - 1)
  else
    x = x * (Num_Layers - 1)
  end if

  var layer = x >> 7
  var fade = x .and. 127

  ' Silence old layers
  if currentLayer != layer
    set_controller(currentLayer, 0)
    set_controller(currentLayer + 1, 0)
    currentLayer = layer
  end if

  var ep = 0
  if Equal_Power
    ep = (fade * (127 - fade)) / 152
  end if

  set_controller(currentLayer, 127 - fade + ep)
  set_controller(currentLayer + 1, fade + ep)
end function

on controller
  if EVENT_CC == 1
    x = CC[1]
    update_crossfade()
  end if
end on
```

### Using FilterDownmix (multi-channel crossfade)

```
' For multi-channel samples with a Downmix voice effect
function set_channel_mix()
  set_module_param(M_GROUP+0, M_FILTER+1, 0, param, value)      ' L
  set_module_param(M_GROUP+0, M_FILTER+1, 0, param + 1, value)  ' R
end function
```

## Step Sequencer

Step through a pitch sequence using held notes as the base key.

```
on init
  prop_array Step_Seq[16](-12, 12, 1) = (0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)
  prop_linear Steps(1, 16, 1) = 16

  var seqPos
  var seqEvent = -1
  ' ... sequencer variables ...
end on

function NextStep()
  release_note(seqEvent)
  inc(seqPos)
  if seqPos >= Steps
    seqPos = 0
  end if
  seqEvent = new_note(heldKeys[numHeldKeys-1] + Step_Seq[seqPos], seqVel, 0, 0)
  group_on(seqEvent, ALL_GROUPS)
  delay_ppq(rateToPPQ[Rate])
end function
```

## Sliced Loop Playback

Play tempo-synced slices from a sample with markers.

```
on init
  const FADE_LEN = 5000
  var zoneID = -1000000 + 1  ' mapping 1, zone 1
  var sliceEvent
  var sliceIndex
end on

on note
  group_off(EVENT_ID, ALL_GROUPS)

  sliceIndex = 0
  var start = zone_slice_start(zoneID, sliceIndex)
  var length = zone_slice_length(zoneID, sliceIndex)

  while length
    sliceEvent = new_note(EVENT_KEY, EVENT_VEL, start, -1)
    group_on(sliceEvent, 0)
    inc(sliceIndex)

    var sliceEnd = zone_slice_start(zoneID, sliceIndex)
    if sliceEnd < 0  ' end of loop
      sliceIndex = 0
      sliceEnd = -sliceEnd
    end if
    fade_out_after(sliceEvent, sliceEnd - start - FADE_LEN, FADE_LEN)

    delay(length)  ' tempo-synced wait

    fade_out(sliceEvent, FADE_LEN, 1)
    start = zone_slice_start(zoneID, sliceIndex)
    length = zone_slice_length(zoneID, sliceIndex)
  end while
end on
```

## Velocity Curve

Scale incoming velocities with a custom curve.

### Simple 3-point curve

```
on init
  prop_linear Velocity_Min(1, 127, 1) = 1
  prop_linear Velocity_Mid(1, 127, 1) = 64
  prop_linear Velocity_Max(1, 127, 1) = 127
end on

on note
  var vel = EVENT_VEL
  if vel < 64
    vel = Velocity_Min + (vel * (Velocity_Mid - Velocity_Min)) / 64
  else
    vel = Velocity_Mid + ((vel - 63) * (Velocity_Max - Velocity_Mid)) / 64
  end if
  set_vel(EVENT_ID, vel)
end on
```

### Full 127-point lookup table

```
on init
  prop_array Velocity_Curve[128](1, 127, 1)
  var vel = 1
  while vel < 128
    Velocity_Curve[vel] = vel
    inc(vel)
  end while
end on

on note
  set_vel(EVENT_ID, Velocity_Curve[EVENT_VEL])
end on
```

## Global LFO (Mod Source Shared Across Groups)

Convert a group's mod source output to a MIDI CC so other groups and effects can use it.

```
on init
  var globalModEvent = TAG_1  ' no event yet
end on

on note
  ' ... manage held notes ...
  if numHeldNotes == 1  ' first note
    fade_out(globalModEvent, 0, 1)
    globalModEvent = new_note(EVENT_KEY, EVENT_VEL, 0, 0)
    group_off(globalModEvent, ALL_GROUPS)
    group_on(globalModEvent, 0)  ' group 0 has the LFO → CC99 routing
  end if
  group_off(EVENT_ID, 0)  ' normal notes skip group 0
end on

on controller
  if EVENT_CC == 99
    ignore_controller()  ' block external CC99
  end if
end on
```

## Held-Notes Stack (Reusable Pattern)

Most mono/arpeggiator scripts maintain a list of currently held MIDI keys:

```
on init
  const MAX_HELD = 32
  var heldNotes[MAX_HELD]
  var numHeldNotes
  var i
end on

function removeFromHeldNotes()
  i = 0
  while i < numHeldNotes
    if heldNotes[i] == EVENT_KEY
      dec(numHeldNotes)
      while i < numHeldNotes
        heldNotes[i] = heldNotes[i + 1]
        inc(i)
      end while
      return
    end if
    inc(i)
  end while
end function

on note
  removeFromHeldNotes()  ' in case duplicate (sustain pedal, etc.)
  heldNotes[numHeldNotes] = EVENT_KEY
  inc(numHeldNotes)
end on

on release
  removeFromHeldNotes()
end on

on controller
  if EVENT_CC == 123
    numHeldNotes = 0
  end if
end on
```

## MPE (MIDI Polyphonic Expression)

Enable per-note modulation by setting "Use MIDI Channel" on mod routings. Handle RPN 6 for MPE configuration:

```
on init
  var mpeMasterChannel = -1
  prop_linear Pitch_Bend_Range(0, 96, 1) = 48
end on

on controller
  if EVENT_CC == CC_PITCHBEND and EVENT_CHAN == mpeMasterChannel
    ' Master pitch bend → apply to all voices via CC
    set_controller_hd(0, 100, Master_Bend_Range * CC[CC_PITCHBEND], 8192 * 12)
    ignore_controller()
  end if
end on
```

## Piano Behaviours (Voice Stealing)

Intelligent voice stealing based on velocity and decay:

```
' Track all playing notes with their trigger time
' When max polyphony reached, steal the quietest:
'   quietness = (current_time - note_time) * decay_rate[key]
' Prefer stealing a repeated key over a different note
```
