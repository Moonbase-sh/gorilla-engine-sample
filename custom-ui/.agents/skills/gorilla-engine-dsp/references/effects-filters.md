# Effects & Filters Reference

## Voice Effects (per-voice, in Groups)

Voice effects are inserted in Groups and process audio individually for each voice. Addressed as `M_FILTER+n` (from 1).

### Filter Types

| Module                | Description                            | Key Params                                             |
| --------------------- | -------------------------------------- | ------------------------------------------------------ |
| LP6 Filter            | 1-pole (6 dB/oct) lowpass. Lowest CPU. | Cutoff, Key Tracking                                   |
| LP12 Filter           | 2-pole (12 dB/oct) lowpass             | Cutoff, Resonance, Key Tracking                        |
| LP24 Filter           | 4-pole (24 dB/oct) lowpass             | Cutoff, Resonance, Key Tracking                        |
| HP6 Filter            | 1-pole (6 dB/oct) highpass             | Cutoff, Key Tracking                                   |
| HP12 Filter           | 2-pole (12 dB/oct) highpass            | Cutoff, Resonance, Key Tracking                        |
| BP6 Filter            | 2-pole (6 dB/oct) bandpass             | Cutoff, Bandwidth, Key Tracking                        |
| Ladder Filter         | 4-pole vintage analog simulation       | Cutoff, Resonance, Key Tracking, Type                  |
| State-Variable Filter | 2-pole multi-mode vintage analog       | Cutoff, Resonance, Key Tracking, Type (LP/HP/BP/Notch) |
| Multi-Mode Filter     | General purpose up to 4-pole           | Cutoff, Resonance, Key Tracking, Type, Slope           |
| MS12 Filter           | 2-pole vintage analog                  | Cutoff, Resonance, Key Tracking, Type                  |
| Damping Filter        | Acoustic damping simulation            | Cutoff, Key Tracking. More natural than filter sweep.  |
| Comb Filter           | Delay line with feedback               | Cutoff, Feedback, Damping, Key Tracking, Mix           |

### Oscillators (Voice Effects)

| Module               | Description                                              |
| -------------------- | -------------------------------------------------------- |
| Analog Oscillator    | Independently mixed Saw, Pulse, Triangle, Sub, and Noise |
| FM Oscillator        | 4-operator FM synth with customizable algorithm          |
| Sample Oscillator    | Sample playback with optional granular mode              |
| Sine Oscillator      | Pure sine wave                                           |
| Super Oscillator     | Multi-saw (unison) + sub                                 |
| Wavetable Oscillator | Arbitrary waveform from Wavetable modules                |

### Other Voice Effects

| Module            | Description                           |
| ----------------- | ------------------------------------- |
| Gain              | Volume control between inserts        |
| Send              | Route to output or effect bus         |
| Shaper            | Waveshaping with custom curve         |
| Waveshaper        | Waveshaping with preset curves        |
| Lo-Fi             | Sample rate reduction                 |
| Limiter           | Safety limiter per voice              |
| EQ Band           | Single parametric EQ                  |
| Shelf EQ          | High/low shelving EQ                  |
| Frequency Shifter | Bode frequency shift                  |
| Stereo Matrix     | Channel routing matrix                |
| Downmix           | Multi-channel to stereo               |
| Crossfade         | Fade between sample channels          |
| Envelope Follower | Follow audio level as mod source      |
| Timestretch       | Timestretching per voice              |
| Compressor        | Dynamic range control                 |
| Granulate         | Granular processing                   |
| Phase Modulator   | Modulated delay (chorus/flanger/comb) |
| Tail Loop         | Create loop from playback             |
| Teleport          | Transfer audio between voices         |
| Mod Shaper        | Warp modulation signals               |
| Mod Waveform      | Use sample waveform as mod source     |

### Controlling Voice Effects from Script

```
' Bypass = param 1 for ALL voice effects (filters, oscillators, utilities alike).
' First meaningful control = param 2: Cutoff for filters, Tune for oscillators,
' first DSP param for utilities (e.g. Level for Gain). Verify with Shift+Copy.
' Set filter cutoff (param 2) and resonance (param 3) on Group 0, Filter 1
set_module_param(M_GROUP+0, M_FILTER+1, 0, 2, cutoffValue)
set_module_param(M_GROUP+0, M_FILTER+1, 0, 3, resoValue)

' Analog Oscillator waveforms are separate level parameters, not a waveform enum.
' To implement a selector, clear the waveform levels and set the selected one.
set_module_param(M_GROUP+0, M_FILTER+1, 0, 3, 0)        ' Saw level
set_module_param(M_GROUP+0, M_FILTER+1, 0, 4, 1000000)  ' Pulse level (square at 50% width)
set_module_param(M_GROUP+0, M_FILTER+1, 0, 7, 0)        ' Triangle level

' Enable/disable a mod routing to a voice effect
set_module_param(M_GROUP+0, M_FILTER+1, M_MOD+1, 1, 0)  ' disable mod routing
```

## Bus Effects (post-voice, in Effect Busses)

Bus effects process the mixed output of all voices routed to that bus. Addressed as `M_EFFECT+n` (from 1) within a bus `M_BUS+n`.

### Common Bus Effects

| Module                | Description                   |
| --------------------- | ----------------------------- |
| Reverb                | Algorithmic reverb (deprecated)            |
| Reverb2               | Alternative reverb algorithm  |
| Non-Linear Reverb     | Gated/reverse reverb          |
| Convolution           | Convolution reverb (IR-based) |
| Delay                 | Stereo delay with sync        |
| Multi-Tap Delay       | Multi-tap delay               |
| Chorus                | Chorus effect                 |
| Flanger               | Flanger effect                |
| Phaser                | Phaser effect                 |
| Distortion            | Distortion                    |
| Overdrive             | Overdrive                     |
| Saturation            | Saturation                    |
| Lo-Fi                 | Bit/sample rate reduction     |
| Compressor            | Dynamics compressor           |
| Bus Compressor        | Bus/glue compressor           |
| Multi-Band Compressor | Multi-band dynamics           |
| Limiter               | Brick-wall limiter            |
| Gate                  | Noise gate                    |
| EQ                    | Parametric EQ                 |
| Isolator EQ           | DJ-style isolator             |
| Filter                | Master filter                 |
| Master Filter         | Resonant master filter        |
| Frequency Shifter     | Bode shift                    |
| Grain Pitch           | Granular pitch shift          |
| Guitar Amp            | Amp simulation                |
| Rotary                | Leslie cabinet simulation     |
| Tremolo/Pan           | Tremolo and auto-pan          |
| Vocoder               | Vocoder                       |
| Pan                   | Stereo panning                |
| Send                  | Route to another bus          |
| Sub Bass              | Sub bass enhancer             |
| Transient             | Transient shaper              |
| Resonators            | Resonator bank                |
| Beat Cutter           | Beat slicing effects          |
| Crossover             | Frequency crossover           |
| Multi-Band Distortion | Per-band distortion           |
| Pitch Shifter         | Pitch shifting                |
| Sample Player         | Bus-level sample playback     |
| Audio Meter           | Level metering                |
| Envelope Follower     | Bus-level envelope following  |

### Controlling Bus Effects from Script

```
' Set delay time on Bus 1, Effect 1
set_module_param(M_BUS+1, M_EFFECT+1, 0, 2, delayTime)

' Set delay sync
set_module_param(M_BUS+1, M_EFFECT+1, 0, 3, syncOn)

' Bypass an effect (param 1)
set_module_param(M_BUS+1, M_EFFECT+1, 0, 1, 1)  ' bypass on
set_module_param(M_BUS+1, M_EFFECT+1, 0, 1, 0)  ' bypass off

' Chorus mix on Bus 1, Effect 2
set_module_param(M_BUS+1, M_EFFECT+2, 0, 10, mixValue)

' Reorder effects in a bus
var order[3] = (3, 2, 1)  ' reverse the order of 3 effects
set_effect_order(M_BUS+1, order)
```

## Effect Bus Routing

- Groups route audio to buses via the Group **Output** parameter
- Buses can route to other buses via Bus **Output** parameter
- Voice-level sends: use Voice Effect: Send
- Bus-level sends: use Bus Effect: Send

Output parameters can have positive and negative values. Positive values are used to route to audio outputs, negative values route to other busses (-1 = Bus 1, -2 = bus 2 etc.).

If possible, do not route audio from a later bus back to an earlier bus as this adds latency to the audio signal and can cause runaway audio feedback.

For an effect that must process only a wet branch, use parallel buses rather than placing it serially on the main bus. A ducked reverb topology is:

1. Keep the dry signal on the main bus and send a copy to a wet bus.
2. On the wet bus, place Envelope Follower before a 100% wet Reverb, followed by Gate in Duck mode with `Sidechain = Env Follower`.
3. Route both dry and wet buses to a final master bus when a processor must affect their combined output.

Alternatively split the signal using a Send to route the pre-effect signal to its destination, then the following effects can be 100% wet and use the bus output to route the wet signal.

Create destination buses before assigning sends to them. During direct `.inst` authoring, an output that targets a bus which does not exist yet may be clamped when the file is deserialized.

For a user-facing soft clipper with threshold, drive, shape, and mix controls, use **Saturation**. Limiter in Soft mode is a fixed-threshold dynamics processor; its Drive parameter only has an effect when Maximize is enabled.

```
' Route Group 0 output to Bus 2 (param 7 = Output)
set_module_param(M_GROUP+0, 0, 0, 7, 2)  ' stepped: bus number
```

## Effect Bus Parameters

| Index | Parameter | Description                                   |
| ----- | --------- | --------------------------------------------- |
| 1     | Name      | Bus name                                      |
| 2     | Volume    | Bus output volume                             |
| 3     | Output    | Output destination (audio out or another bus) |
| 4     | Mute      | Mute the bus                                  |
| 5     | Solo      | Solo the bus                                  |

## Latency Reporting

Some effects (like Pitch Shift) introduce latency. Report total to host:

```
on init
  const LatencyParam = find_module_param(M_BUS+1, M_EFFECT+1, 0, "Latency")
  var latency
end on

on controller
  if EVENT_CC == 123  ' audio restart
    get_module_param(M_BUS+1, M_EFFECT+1, 0, LatencyParam, latency)
    declare_latency(latency)
  end if
end on
```
