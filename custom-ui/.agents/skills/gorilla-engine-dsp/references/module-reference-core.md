# Gorilla Editor — Module Reference: Core Modules

Covers: Instrument, Script, Group, Zone, and trigger Conditions.

## Contents
1. [Instrument](#Instrument)
2. [Script](#Script)
3. [Group](#Group)
4. [Zone](#Zone)
5. [Alternate Condition](#Alternate-Condition)
6. [Controller Condition](#Controller-Condition)
7. [Keyswitch Condition](#Keyswitch-Condition)
8. [Random Condition](#Random-Condition)

---

## Instrument
Every instrument has one Instrument module.
| Parameter | Description |
| --------- | ----------- |
| Name | Instrument name. |
| Blob Number | The blob number to use when exporting the instrument to use in a Gorilla Engine based product can be set here. Set to '-' to include a custom blob name in the Blob Path. |
| Blob Path | Folder to save the .blob file (path should be relative to the instrument location). |
| Volume | Volume for the whole instrument (leave at 0.0 dB to minimize CPU load). Often this parameter will be controlled by the instrument script to implement the master volume. |
| Tune | Tuning for the whole instrument - note this is tuning of all samples, not transposition of the MIDI input. |
| Output | Selects the main audio output - normally leave this set to 1. |
| Voices | Displays the current number of voices the instrument is playing. |
| Sustain Pedal | Sets the sustain pedal mode. Possible values are: <br />`Off`: No response to sustain pedal, so it can be handled in the instrument script.<br />`On`: Normal response to sustain pedal.<br />`Latch`: Sustain notes until the next note is played.<br />`Damper`: Sustained voices are not released while the sustain pedal is held, or the key that triggered the voice has been played again and is still held. |
| Glide | Only has an effect in Group modules where the Glide mod source is used. Possible values are: <br />`Off`: No glide.<br />`On`: Always glide.<br />`Auto`: Only glide if a key is already held. |
| Default Keyswitch | Sets which keyswitch key (if any) will be active when the instrument is loaded. |
| Pitch Bend Range | Adjust maximum depth of all modulation routings from Pitch Bend to Group Tune. |
| Active Events | Displays the number of script events currently active - useful for script debugging. Hanging events are most likely note events that were never released. |
| Script Defines | List of words separated by spaces or commas, used with script USE_CODE_IF(). |
| Overview Size | Number of overview points to generate for samples (applied when exporting). |
| Simultaneous Max | If set, limits the number of MIDI note and pedal messages in one audio buffer to reduce the maximum CPU load. Excess messages are delayed until the next audio buffer. |
| Group Solo | Displays if any groups are currently soloed. |
| Bus Solo | Displays if any effect busses are currently soloed. |
| Groups | [Group](#Group) |
| Mappings | [Mapping](#Mapping) |
| Voice Groups | [VoiceGroup](#VoiceGroup) |
| FX Busses | [EffectBus](#EffectBus) |
| Wavetables | [Wavetable](#Wavetable) |
| MIDI Files | [MidiFile](#MidiFile) |
| Data Files | [DataFile](#DataFile) |
| Scripts | [Script](#Script) |

## Script
Contains the instrument script and displays any parameters declared in the script for editing.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Bypass processing of note and controller events by this script. |
| Script Path | Location of script text file on disk. |
| Script | Text of currently active script. |
| Status | Last message printed by the script. |

## Group
The Instrument can have any number of Group modules. A Group module organizes multiple sample zones and allows for setting trigger conditions and other settings that apply to all samples in the Group. Each Group can contain up to 16 mod sources, 64 mod routings and 8 filters.
| Parameter | Description |
| --------- | ----------- |
| Name | Name to display for this Group. |
| Active | When switched off, the Group will not respond to incoming notes. |
| Volume | Volume for all voices in the Group. |
| Pan | Pan (balance if stereo) for all voices in the Group. |
| Tune | Coarse and fine tuning for all voices in the Group. |
| Tracking | Pitch tracking of samples across the keyboard (0% = none, 100% = normal). |
| Output | Select the audio output or Effect Bus to output all Group voices to. |
| Voice Group | Select a Voice Group to control the Group polyphony. |
| Voices | Displays the current number of voices the Group is playing. |
| Quality | Sample playback interpolation mode. Each mode has a different trade-off between CPU load and sound quality. Possible values are: <br />`Eco`: Lowest quality and CPU load. Fine for background sounds, or sounds with little high frequency content.<br />`Mid`: Middle quality and CPU load. Use instead of Lagrange to increase quality if transposing up a long way.<br />`High`: Higher quality and CPU load. Use instead of Sinc 8 to save CPU if transposing up a long way.<br />`Lagrange`: Standard 4-point Lagrange interpolation. Good quality for most sounds. Low CPU load.<br />`Hermite`: 4-point Hermite interpolation. Similar to Lagrange but sounds smoother at the expense of some aliasing.<br />`Sinc 8`: 8-point Sinc interpolation. High quality, but high CPU load especially when transposing up.<br />`Vintage`: Emulates a variable rate DAC without an anti-imaging filter (so you might want to add your own lowpass filter tracking the pitch). Low CPU load. |
| Release Trigger | Group should play when a note-off is received rather than a note-on. |
| Release Timer | Used as a mod source for attenuation of release-triggered voices depending on how long the note was held. |
| Sample Start | Adjust the sample start point of all zones in the Group (subject to the zone Start Mod Range setting). |
| Loop Follows Start |  Possible values are: <br />`Off`: The sample loop set in the Zone is played, unaffected.<br />`On`: The sample loop is shifted to the playback start position, which can then be modulated.<br />`Quantized`: The loop position is rounded to the nearest multiple of the loop length, so startpoint modulation steps through different sections of the sample for wavetable-style playback. For best results set the sample loop to the last wavetable in the sample and Start Mod Range to maximum.<br />`Quant+Phase`: Same as Quantized, but the sample starts playing at a random position within the loop, to avoid unwanted alignment between unison voices. |
| Mapping Shift | This allows the sample mapping to be shifted up or down the keyboard. Usually used in combination with the Tune parameter to transpose the group, compared to just tuning the group which may play samples outside their normal key range. |
| Alternate Mapping | Select an alternative set of sample zones to play, instead of this group's zones. |
| De-glitch Start | Reduce clicks when the sample startpoint is not at a zero crossing. |
| Mute | Mute the output of this group (unless Solo is on). Does not stop voices in the group from playing. |
| Solo | Solo this group and mute any non-soloed groups. Set to Ignore if soloing other groups should not mute this one. |
| Conditions | [Condition*](#Condition*) |
| ModSources | [ModSource*](#ModSource*) |
| ModRoutings | [ModRouting](#ModRouting) |
| Filters | [Filter*](#Filter*) |
| Zones | [Zone](#Zone) |

## Zone
Each Group can contain any number of Zone modules. Each Zone loads and plays one audio file. A Zone with no audio file can still be used to trigger voices that use oscillators to generate their sound.
| Parameter | Description |
| --------- | ----------- |
| Sample | Relative path and filename of sample this zone plays. |
| Status | Displays if the sample was Loaded, Not Loaded, or Not Found. |
| Volume | Volume offset. |
| Pan | Pan position offset. |
| Tune | Tuning offset. |
| Root Key | Key that will play the sample at its original pitch. |
| Low Key | Lowest key that will trigger this zone. |
| High Key | Highest key that will trigger this zone. |
| Low Vel | Lowest velocity that will trigger this zone. |
| High Vel | Highest velocity that will trigger this zone. |
| Low Key Fade | Fade out at bottom of key range. |
| High Key Fade | Fade out at top of key range. |
| Low Vel Fade | Fade out at bottom of velocity range. |
| High Vel Fade | Fade out at top of velocity range. |
| Fade Curve | Curve of fades (0 = linear, 100 = equal power). |
| Start | Start point of sample, in frames. |
| Start Mod Range | Startpoint modulation range in frames. |
| End | End point of sample, in frames. |
| Length | Display available length in frames. |
| Reverse | Play the sample in reverse (from End until Start or Loop Start). |
| Loop | Enable looping. |
| Loop Start | Loop start point, in frames. |
| Loop End | Loop end point, in frames (this frame is not included in the loop). |
| Slice Length | Imported from Recycle files or set manually - can be read by instrument script. |
| Zone Param 1 | Per-zone value to use as a modulation source. |
| Zone Param 2 | Per-zone value to use as a modulation source. |
| Orig Tempo | Imported from Apple Loop, Acid or REX files or set manually - read by Timestretch module. |

## Alternate Condition
Lets you define Round Robins, where each note plays a different group in turn. Note that much more detailed conditions can be set up in the instrument script.
| Parameter | Description |
| --------- | ----------- |
| Position | Position of this Group in the cycle of Groups with Alternate trigger conditions (0 = never play). |
| Next Condition | Logic for combining the result of this trigger condition with the next (if any). 'And' conditions are evaluated before 'Or', so for example: A AND B OR C AND NOT D is evaluated as (A AND B) OR (C AND NOT D). |

## Controller Condition
Only play the group if a MIDI controller is in the specified range, e.g. only when the Sustain Pedal is down. Note that much more detailed conditions can be set up in the instrument script.
| Parameter | Description |
| --------- | ----------- |
| CC | MIDI controller number. |
| From | Lowest controller value that enables this Group. |
| To | Highest controller value that enables this Group. |
| Next Condition | Logic for combining the result of this trigger condition with the next (if any). 'And' conditions are evaluated before 'Or', so for example: A AND B OR C AND NOT D is evaluated as (A AND B) OR (C AND NOT D). |

## Keyswitch Condition
Activate different groups depending on which keyswitch MIDI key was last pressed, e.g. for selecting articulations in Orchestral instruments. Note that much more detailed conditions can be set up in the instrument script.
| Parameter | Description |
| --------- | ----------- |
| From | Lowest keyswitch key that enables this Group. |
| To | Highest keyswitch key that enables this Group. |
| Next Condition | Logic for combining the result of this trigger condition with the next (if any). 'And' conditions are evaluated before 'Or', so for example: A AND B OR C AND NOT D is evaluated as (A AND B) OR (C AND NOT D). |

## Random Condition
Use when you want to alternate between two or more Groups in a random order. Note that much more detailed conditions can be set up in the instrument script.
| Parameter | Description |
| --------- | ----------- |
| Next Condition | Logic for combining the result of this trigger condition with the next (if any). 'And' conditions are evaluated before 'Or', so for example: A AND B OR C AND NOT D is evaluated as (A AND B) OR (C AND NOT D). |
