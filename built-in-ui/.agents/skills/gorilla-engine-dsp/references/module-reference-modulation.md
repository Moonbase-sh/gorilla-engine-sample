# Gorilla Editor — Module Reference: Modulation Modules

Covers: ADSR Env, Custom Env, LFO, Step Seq, and Mod Routing.

> **Cross-references:** `ModRouting` is defined in this file and referenced throughout voice effects and bus effects files.

## Contents
1. [ADSR Env](#ADSR-Env)
2. [Custom Env](#Custom-Env)
3. [LFO](#LFO)
4. [Step Seq](#Step-Seq)
5. [Mod Routing](#Mod-Routing)

---

## ADSR Env
Standard synthesizer envelope, to use as a mod source.
| Parameter | Description |
| --------- | ----------- |
| Name | Name to display for this mod source. |
| ModRoutings | See [Mod Routing](#Mod-Routing) |
| Attack | Attack time. |
| Attack Curve | -100% (slow to reach final value) to +100% (fast to reach final value). |
| Hold | Hold time at maximum level. |
| Decay | Decay time. |
| Decay Curve | -100% (slow to reach final value) to +100% (fast to reach final value). Typically 75 - 90% for exponential curves. |
| Sustain | Sustain Level. |
| Release | Release time. |
| Release Curve | Typically +90% for exponential fade out, or 0% for linear. |
| Hold End Level | Level at the end of the Hold stage. |
| Times x10 | Multiplies all time parameters by 10. |
| Tempo Sync | Sync envelope times to host tempo. |

## Custom Env
Customizable multi-point curve, to use as a mod source.
| Parameter | Description |
| --------- | ----------- |
| Name | Name to display for this mod source. |
| ModRoutings | See [Mod Routing](#Mod-Routing) |
| Sync | Measure envelope stage lengths in seconds or quarternote beats. |
| Curve | Edit the envelope points. |
| Randomize Levels | Randomize the level of each envelope point on each trigger. |

> **Scripting tip — Controllable segment timing:** A `Custom Env`'s internal `ModRoutings` can use `Dest: "Time 1"`, `"Time 2"`, etc. to modulate individual segment durations from an external mod source (e.g. `MIDI CC`). Set the routing up in Gorilla Editor, then use `set_controller(cc, value)` in the script to control the timing at runtime. This is the standard way to make custom envelope speed scriptable. See the *Glide via ModSourceCustom + set_controller* pattern in [script-patterns.md](./script-patterns.md).

## LFO
Low Frequency Oscillator, to use as a mod source.
| Parameter | Description |
| --------- | ----------- |
| Name | Name to display for this mod source. |
| ModRoutings | See [Mod Routing](#Mod-Routing) |
| Wave | Sine, Triangle, Square, Saw, Random (random steps), Drift (smooth random), Saw Up, Saw Exp (exponential decay). |
| Rate | Duration of 1 cycle of the LFO waveform. |
| Sync | Set Rate units to Hz (cycles per second) or beats (quarternotes per cycle). |
| Retrigger | When Off, all voices will be modulated together in sync. When On, the LFO for each voice starts from the beginning when the note is triggered. |
| Start Phase | This shifts the starting point in the LFO waveform. It is most useful when Retrigger is off and Sync is set to beats: then it adjusts the alignment of the LFO waveform relative to beats on the song timeline. |
| Unipolar | When On, the LFO output varies between 0.0 and 1.0, rather than -1.0 and 1.0. |

## Step Seq
Step sequence generator, to use as a mod source.
| Parameter | Description |
| --------- | ----------- |
| Name | Name to display for this mod source. |
| ModRoutings | See [Mod Routing](#Mod-Routing) |
| Rate | Length of each step in beats. |
| Steps | Number of steps to repeat (1 to 32). |
| Sequence | Level for each step. |
| Retrigger | When Off, all voices will be modulated together in sync. When On, the sequence for each voice starts from the beginning when the note is triggered. |

## Mod Routing
Modulation routing, to modulate a parameter of the module containing the routing by one of the available mod source signals. Each Group can contain up to 64 mod routings.
| Parameter | Description |
| --------- | ----------- |
| Active | Switch the modulation routing on and off (an inactive routing still uses a little CPU, so delete any that are no longer needed). |
| Source | Modulation Source. External (MIDI) and Group (e.g. envelope and LFO) sources are available here. Possible values are: <br />`Constant`: Constant maximum value<br />`Random`: Random bipolar value between -1 and +1<br />`Random +`: Random unipolar value between 0 and 1.<br />`Pitch Bend`: Incoming MIDI pitch bend.<br />`Aftertouch`: Incoming MIDI channel pressure.<br />`MIDI CC`: The current value of the specified MIDI controller.<br />`Use MIDI Channel`: Use the pitch bend, aftertouch or CC value from the note's MIDI channel. When off, uses the last value received on any channel.<br />`Key`: Keyboard position relative to C3. Value increases by 1.0 per octave. For convenience, Key includes all other pitch modulation such as Pitch Bend when used to modulate a voice effect.<br />`Velocity`: Incoming MIDI velocity.<br />`Release Timer`: Set on note release based on Group Release Timer setting. value is 1 if note is released immediately, 0.5 if released after half the Timer time, and so on).<br />`Glide`: Distance relative to previous key, if Instrument Glide setting is active.<br />`Event Param 0`: Value set by script or an envelope follower.<br />`Event Param 1`: Value set by script or an envelope follower.<br />`Event Param 2`: Value set by script or an envelope follower.<br />`Event Param 3`: Value set by script or an envelope follower.<br />`Release Vel`: Release velocity (bipolar, zero until note released).<br />`Vel In Zone`: Velocity relative to zone velocity range (from -1 to 0).<br />`Zone Param 1`: Value read from the Zone being played.<br />`Zone Param 2`: Value read from the Zone being played. |
| CC | Selects the MIDI controller to monitor when Source is set to MIDI CC. |
| Invert | Reduce the destination parameter instead of increasing it. |
| Depth | Amount of modulation. (100% pitch modulation = 1 octave). |
| Smooth | Smoothing of parameter changes - useful for MIDI controllers. At the maximum setting the initial value is held forever. |
| Dest | Destination parameter to be modulated (depends on the module the routing is inserted in). |
| Curve Active | Determines if a custom curve is applied to the source value. |
| Curve | Edit the curve points. |
| Use MIDI Channel | For MIDI source, use the last value on the channel that triggered this voice, rather than the last value on any channel. |
| Freeze In Release | Hold the source value so it doesn't change after the key is released. |
| Custom Dest | Additional destination parameter for advanced routing. |
