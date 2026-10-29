# Time & Tempo Reference

## Delay Functions

### delay(microseconds)

Pause the current callback. The callback resumes after the delay. Other callbacks can run during the wait.

```
on note
  ' trigger note, wait 500ms, then change pitch
  delay(500000)
  set_tune(EVENT_ID, 100000, 1)  ' pitch up 1 semitone
end on
```

### delay_msec(milliseconds)

Approximate delay (~1-2ms accuracy). More CPU efficient than `delay()`.

```
delay_msec(100)  ' approximately 100ms
```

### delay_ppq(ppq)

Delay by musical time. 960 ppq = quarter note. Follows tempo changes.

| PPQ Value | Musical Duration |
| --------- | ---------------- |
| 3840      | Whole note       |
| 2880      | Dotted half      |
| 1920      | Half note        |
| 1440      | Dotted quarter   |
| 960       | Quarter note     |
| 720       | Dotted 8th       |
| 480       | 8th note         |
| 360       | Dotted 16th      |
| 240       | 16th note        |
| 120       | 32nd note        |

Triplets: multiply by 2 then divide by 3 (e.g., quarter triplet = 640 ppq, 8th triplet = 320 ppq).

```
delay_ppq(480)   ' wait one 8th note
delay_ppq(240)   ' wait one 16th note
```

### end_delay(callbackID, andFutureDelays)

Cancel a delay in a specific callback. If `andFutureDelays` ≠ 0, future delays in that callback are also skipped.

```
' Store callback ID for later cancellation
seqCallback = CALLBACK_ID
while seqCallback == CALLBACK_ID
  ' do sequencer step...
  delay_ppq(480)
end while

' To stop the sequence from another callback:
var temp = seqCallback
seqCallback = 0
end_delay(temp, 0)
```

## Time Variables

| Variable       | Description                                                                   |
| -------------- | ----------------------------------------------------------------------------- |
| `TIME_MSEC`    | Elapsed time in milliseconds since audio started (always increasing)          |
| `TIME_USEC`    | Elapsed time in microseconds, sample-accurate. Reset with `reset_time_usec()` |
| `BEAT_USEC`    | Duration of one quarter note in microseconds at current tempo                 |
| `BAR_USEC`     | Duration of one bar in microseconds                                           |
| `BAR_POS_PPQ`  | Position within current bar in ppq                                            |
| `BAR_POS_USEC` | Position within current bar in μs                                             |
| `SONG_POS_PPQ` | Transport position in ppq (960 per quarter)                                   |
| `SONG_PLAYING` | 0 = stopped, 1 = playing                                                      |
| `TIME_SIG_NUM` | Time signature numerator (beat type: 4=quarter, 8=eighth)                     |
| `TIME_SIG_DEN` | Time signature denominator (beats per bar)                                    |

## Tempo Sync Pattern

Common pattern for switchable free/synced rate:

```
on init
  prop_boolean LFO_Sync
  prop_linear LFO_Rate(0, 1000, 10) = 500

  prop_stepped LFO_Beats = 6
    add_step(LFO_Beats, "1/1")
    add_step(LFO_Beats, "1/2 D")
    add_step(LFO_Beats, "1/1 T")
    add_step(LFO_Beats, "1/2")
    add_step(LFO_Beats, "1/4 D")
    add_step(LFO_Beats, "1/2 T")
    add_step(LFO_Beats, "1/4")
    add_step(LFO_Beats, "1/8 D")
    add_step(LFO_Beats, "1/4 T")
    add_step(LFO_Beats, "1/8")
    add_step(LFO_Beats, "1/16 D")
    add_step(LFO_Beats, "1/8 T")
    add_step(LFO_Beats, "1/16")

  ' Precomputed LFO rate values for each beat division at module param scale
  var lfoLookup[13] = (650515, 619280, 606492, 575257, 544023, 531235, 500000,
                        468765, 455977, 424743, 393508, 380720, 349485)
end on

function SetLfoRate()
  if LFO_Sync
    set_module_param(M_GROUP+0, M_MOD_SRC+1, 0, 3, lfoLookup[LFO_Beats])
  else
    set_module_param(M_GROUP+0, M_MOD_SRC+1, 0, 3, 1000 * LFO_Rate)
  end if
end function

on LFO_Sync
  set_module_param(M_GROUP+0, M_MOD_SRC+1, 0, 4, LFO_Sync)  ' LFO Sync param
  SetLfoRate()
end on

on LFO_Rate
  SetLfoRate()
end on
```

## Time Conversion

| Function                | Description                                  |
| ----------------------- | -------------------------------------------- |
| `usec_to_ppq(usec)`     | Convert microseconds to ppq at current tempo |
| `ppq_to_usec(ppq)`      | Convert ppq to microseconds at current tempo |
| `usec_to_samples(usec)` | Convert microseconds to sample frames        |
| `reset_time_usec()`     | Reset TIME_USEC to zero                      |
| `set_bar_start(ppq)`    | Set custom position for beat-synced effects  |

## Transport Callback

```
on transport
  if SONG_PLAYING
    ' transport started
  else
    ' transport stopped
    release_note(ALL_EVENTS)
  end if
end on
```

Also available via `on listener` (periodic polling):

```
on listener
  if SONG_PLAYING
    ' playing
  else
    ' stopped
  end if
end on
```

## CC 123 — All Notes Off / Audio Restart

CC 123 is sent when the audio engine starts or restarts. Use it to initialize state:

```
on controller
  if EVENT_CC == 123
    numHeldNotes = 0
    release_note(ALL_EVENTS)
    ' Also good place to report latency:
    declare_latency(value)
  end if
end on
```

## Seconds to Envelope Time Conversion

Envelope times are exponentially scaled. To convert seconds to parameter values, use a lookup table:

```
on init
  prop_linear Attack(0, 10000, 1000)
    set_prop_param(Attack, PROP_UNITS, "sec")

  ' Lookup table: 0.00 to 16.00 seconds in 0.01 steps → parameter values
  const sec_to_envTime[1601] = (0, 10000, 103012, 157420, ...)

  var value
  var temp
end on

function convertToEnvTime()
  if value >= 16000000
    value = 1000000
  else
    temp = value / 10000
    value = sec_to_envTime[temp] + ...
      ((value mod 10000) * (sec_to_envTime[temp + 1] - sec_to_envTime[temp])) / 10000
  end if
end function

on Attack
  value = 1000 * Attack  ' time in microseconds
  convertToEnvTime()
  set_module_param(M_GROUP+0, M_MOD_SRC+1, 0, 2, value)  ' ADSR Attack
end on
```
