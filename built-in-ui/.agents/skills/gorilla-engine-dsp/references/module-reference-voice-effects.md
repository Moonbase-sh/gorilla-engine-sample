# Gorilla Editor — Module Reference: Voice Effects

Covers all per-voice effect modules and oscillators.

> **Cross-references:** `ModRouting` definition → see [module-reference-modulation.md](./module-reference-modulation.md)

> ⚠ **`ModRoutings` does not occupy a param index.** Each parameter table below includes a `ModRoutings` row linking to the modulation reference. That row is a sub-module array — it does **not** count toward param indices. Count only scalar rows: Bypass = param 1, next scalar row = param 2, and so on.

## Contents
1. [Voice Effect: BP6 Filter](#Voice-Effect-BP6-Filter)
2. [Voice Effect: Comb Filter](#Voice-Effect-Comb-Filter)
3. [Voice Effect: Damping Filter](#Voice-Effect-Damping-Filter)
4. [Voice Effect: Downmix](#Voice-Effect-Downmix)
5. [Voice Effect: Envelope Follower](#Voice-Effect-Envelope-Follower)
6. [Voice Effect: EQ Band](#Voice-Effect-EQ-Band)
7. [Voice Effect: Frequency Shifter](#Voice-Effect-Frequency-Shifter)
8. [Voice Effect: Gain](#Voice-Effect-Gain)
9. [Voice Effect: HP6 Filter](#Voice-Effect-HP6-Filter)
10. [Voice Effect: HP12 Filter](#Voice-Effect-HP12-Filter)
11. [Voice Effect: Ladder Filter](#Voice-Effect-Ladder-Filter)
12. [Voice Effect: Limiter](#Voice-Effect-Limiter)
13. [Voice Effect: Lo-Fi](#Voice-Effect-Lo-Fi)
14. [Voice Effect: LP6 Filter](#Voice-Effect-LP6-Filter)
15. [Voice Effect: LP12 Filter](#Voice-Effect-LP12-Filter)
16. [Voice Effect: LP24 Filter](#Voice-Effect-LP24-Filter)
17. [Voice Effect: Stereo Matrix](#Voice-Effect-Stereo-Matrix)
18. [Voice Effect: Multi-Mode Filter](#Voice-Effect-Multi-Mode-Filter)
19. [Voice Effect: Send](#Voice-Effect-Send)
20. [Voice Effect: Shaper](#Voice-Effect-Shaper)
21. [Voice Effect: Shelf EQ](#Voice-Effect-Shelf-EQ)
22. [Voice Effect: State-Variable Filter](#Voice-Effect-State-Variable-Filter)
23. [Voice Effect: Timestretch](#Voice-Effect-Timestretch)
24. [Voice Effect: Analog Oscillator](#Voice-Effect-Analog-Oscillator)
25. [Voice Effect: FM Oscillator](#Voice-Effect-FM-Oscillator)
26. [Voice Effect: Sample Oscillator](#Voice-Effect-Sample-Oscillator)
27. [Voice Effect: Sine Oscillator](#Voice-Effect-Sine-Oscillator)
28. [Voice Effect: Super Oscillator](#Voice-Effect-Super-Oscillator)
29. [Voice Effect: Wavetable Oscillator](#Voice-Effect-Wavetable-Oscillator)

---

## Voice Effect: BP6 Filter
2-pole (6 dB/oct roll-off) bandpass filter, applied individually to each voice.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the module. |
| ModRoutings | See [module-reference-modulation.md](./module-reference-modulation.md) |
| Cutoff | Center frequency. |
| Resonance | Strength of resonant peak at center frequency. |

## Voice Effect: Comb Filter
Delay line with feedback and damping, applied individually to each voice. Note this module requires additional memory per voice, so currently only the first comb filter or timestretch in each group will be active.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the module. |
| ModRoutings | See [module-reference-modulation.md](./module-reference-modulation.md) |
| Tune | Delay time, displayed as resonant frequency in Hz. |
| Keytrack | Tuning should track playback pitch. |
| Feedback | Feedback from delay output to input. At high settings the delay becomes a tuned resonator. |
| Damping | High cut applied to feedback to make it less harsh. |
| Stiffness | Detunes resonant frequencies away from a harmonic series, similar to stiffness in a vibrating string or rod. |
| Mix | Level of the delay output. Can also be phase inverted for phaser-like canceling. |
| Mix Mode | Set to Post, the Mix parameter adds the delayed signal to the output.  Set to Pre, the Mix parameter fades the delay input between the input signal and the feedback signal. This can be useful for switching with the Mix parameter from the input signal to a frozen 100% feedback signal. |

## Voice Effect: Damping Filter
Acoustic damping simulation, applied individually to each voice. More natural sounding than a filter sweep.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the module. |
| ModRoutings | See [module-reference-modulation.md](./module-reference-modulation.md) |
| Cutoff | Cutoff frequency. Can usually be left at a fixed value, or modulated slightly by Key. |
| Damping | 0 to 24 dB/oct damping above cutoff frequency. Usually modulated by an increasing envelope to simulate damping of strings (for example) as the sound decays. |

## Voice Effect: Downmix
Downmix multi-channel sample to stereo.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the module. |
| ModRoutings | See [module-reference-modulation.md](./module-reference-modulation.md) |
| Smoothing | Smoothing of gain parameter changes. |
| Smooth Start | Smooth from silence at start of the note. |
| Ch1 L | Linear gain factor from sample channel 1 to left output. |
| Ch1 R | Linear gain factor from sample channel 1 to right output. |
| Ch2 L | Linear gain factor from sample channel 2 to left output. |
| Ch2 R | Linear gain factor from sample channel 2 to right output. |
| Ch3 L | Linear gain factor from sample channel 3 to left output. |
| Ch3 R | Linear gain factor from sample channel 3 to right output. |
| Ch4 L | Linear gain factor from sample channel 4 to left output. |
| Ch4 R | Linear gain factor from sample channel 4 to right output. |
| Ch5 L | Linear gain factor from sample channel 5 to left output. |
| Ch5 R | Linear gain factor from sample channel 5 to right output. |
| Ch6 L | Linear gain factor from sample channel 6 to left output. |
| Ch6 R | Linear gain factor from sample channel 6 to right output. |
| Ch7 L | Linear gain factor from sample channel 7 to left output. |
| Ch7 R | Linear gain factor from sample channel 7 to right output. |
| Ch8 L | Linear gain factor from sample channel 8 to left output. |
| Ch8 R | Linear gain factor from sample channel 8 to right output. |
| To Bus | Choose an effect bus to downmix to, instead of downmixing in place. |

## Voice Effect: Envelope Follower
Outputs a control signal that follows the audio level (and/or a mod source signal) individually for each voice.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the module. |
| ModRoutings | See [module-reference-modulation.md](./module-reference-modulation.md) |
| Attack | How fast the envelope follower should react to the audio signal. |
| Release | How fast the envelope follower signal should drop to zero after the input signal has decreased. |
| Mode | Detect peak or RMS (average) level, or ignore the audio level and only use the level modulation signal routed to Dest. |
| Range | How to convert the level to a mod source value: Linear, or a range in dB. |
| Dest | Destination the value is written to (usable as a mod source and accessible in the instrument script). |
| Output CC | Write the value to the selected MIDI CC, which can be used as a mod source. Note the instrument script does not receive these CC changes because they are happening continuously. |

## Voice Effect: EQ Band
Single parametric equalizer band, applied individually to each voice.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the module. |
| ModRoutings | See [module-reference-modulation.md](./module-reference-modulation.md) |
| Freq | Center frequency of the EQ band. |
| Width | Slope of the EQ left and right from the center frequency. |
| Gain | Attenuation/Boost. |

## Voice Effect: Frequency Shifter
Bode frequency shift (inharmonic shift in Hertz, not pitch) applied individually to each voice.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the module. |
| ModRoutings | See [module-reference-modulation.md](./module-reference-modulation.md) |
| Mode | Shift frequencies up, down, or left and right channels in opposite directions. |
| Range | Frequency shift in Hertz. Low values result in barber's pole phasing when Mix is set to 50%. |
| Keytrack | Scale the range to give a consistent sound relative to the note being played. |
| Depth | Linear scaling of shift amount, can also be inverted. Useful as a mod destination. |
| Feedback | Add feedback to add overtones or increase depth of phasing. |
| Mix | Dry/wet mix. |

## Voice Effect: Gain
Volume control, applied individually to each voice. Can be useful between other per-voice inserts.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the module. |
| ModRoutings | See [module-reference-modulation.md](./module-reference-modulation.md) |
| Level | Adjust the audio level. |
| Invert Phase | Flip the phase of the audio. |

## Voice Effect: HP6 Filter
1-pole (6 dB/oct) highpass filter, applied individually to each voice.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the module. |
| ModRoutings | See [module-reference-modulation.md](./module-reference-modulation.md) |
| Cutoff | Cutoff frequency. |

## Voice Effect: HP12 Filter
2-pole (12 dB/oct) highpass filter, applied individually to each voice.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the module. |
| ModRoutings | See [module-reference-modulation.md](./module-reference-modulation.md) |
| Cutoff | Cutoff frequency. |
| Resonance | Strength of resonant peak at cutoff frequency. |

## Voice Effect: Ladder Filter
4-pole (24 dB/oct) filter, applied individually to each voice. Simulates a vintage analog filter.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the module. |
| ModRoutings | See [module-reference-modulation.md](./module-reference-modulation.md) |
| Cutoff | Cutoff frequency. |
| Resonance | Strength of resonant peak at cutoff frequency. Peak is damped when the input signal is loud. |
| Reso Low Cut | Reduce resonance at low frequencies, to control the lowest frequency the filter will self-oscillate. |
| Mode | 12 dB highpass, 6 dB bandpass, or 6 to 24 dB lowpass. |

## Voice Effect: Limiter
Safety limiter, applied individually to each voice. Stops the voice audio getting too loud.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the module. |
| ModRoutings | See [module-reference-modulation.md](./module-reference-modulation.md) |
| Attack | Controls how quickly the audio level should be limited. |
| Release | Controls how slowly the limiting is reduced after the audio level has decreased. |

## Voice Effect: Lo-Fi
Sample rate reduction, applied individually to each voice.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the module. |
| ModRoutings | See [module-reference-modulation.md](./module-reference-modulation.md) |
| Sample Rate | Downsampling rate. |
| Jitter | Random modulation of downsampling rate. |
| Keytrack | Sample rate follows keyboard and other pitch modulation. |
| Bit Depth | Bit reduction. |
| Bit Bias | Offset to adjust the quietest audio that jumps from one bit level to the next. |
| Slew Rate | Limit the change from one sample to the next. Simulates ADPCM/companding converters. |

## Voice Effect: LP6 Filter
1 pole (6 dB/oct) lowpass filter, applied individually to each voice. Lowest CPU load of all filters.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the module. |
| ModRoutings | See [module-reference-modulation.md](./module-reference-modulation.md) |
| Cutoff | Cutoff frequency. |

## Voice Effect: LP12 Filter
2 pole (12 dB/oct) lowpass filter, applied individually to each voice.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the module. |
| ModRoutings | See [module-reference-modulation.md](./module-reference-modulation.md) |
| Cutoff | Cutoff frequency. |
| Resonance | Strength of resonant peak at cutoff frequency. |

## Voice Effect: LP24 Filter
4 pole (24 dB/oct) lowpass filter, applied individually to each voice.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the module. |
| ModRoutings | See [module-reference-modulation.md](./module-reference-modulation.md) |
| Cutoff | Cutoff frequency. |
| Resonance | Strength of resonant peak at cutoff frequency. |

## Voice Effect: Stereo Matrix
Stereo channel routing matrix, applied individually to each voice.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the module. |
| ModRoutings | See [module-reference-modulation.md](./module-reference-modulation.md) |
| Mode | Set how the channels will be combined. Possible values are: <br />`Mix`: Fade each output channel between the left and right input channels.<br />`Pan`: Set pan position of each input channel across the output channels.<br />`M-S`: Adjust the level of the left (M) and right (S) input channels, then M-S decode them.<br />`L+R`: Downmix the sum of the left and right channels to mono.<br />`L-R`: Downmix the difference of the left and right channels to mono. |
| Left | Adjust left channel according to Mode. |
| Right | Adjust right channel according to Mode. |

## Voice Effect: Multi-Mode Filter
General purpose filter with up to 4 poles (24 dB/oct), applied individually to each voice.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the module. |
| ModRoutings | See [module-reference-modulation.md](./module-reference-modulation.md) |
| Cutoff | Cutoff frequency. |
| Resonance | Strength of resonant peak at cutoff frequency. |
| Mode | 12 dB highpass, 6 dB bandpass, or 6 to 24 dB lowpass. |
| Peak Limit | Limit the level of the resonant peak and make the filter sound overdriven. When off, self-oscillation is also disabled to save CPU. |

## Voice Effect: Send
Send to an output or Effect Bus, applied individually to each voice.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the module. |
| ModRoutings | See [module-reference-modulation.md](./module-reference-modulation.md) |
| Output | Select destination output or Effect Bus. |
| Send Level | Volume to send to the destination. |
| Scaling | Optionally scale send level by voice volume (similar to a post-fader send in a mixer). |
| Output Mod | The amount the Output parameter can be offset by modulation. Allows the output bus to be set by note velocity, for example. The offset is calculated when the note starts and won't change while the note is playing. |

## Voice Effect: Shaper
Waveshaping with customizable curve, applied individually to each voice.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the module. |
| ModRoutings | See [module-reference-modulation.md](./module-reference-modulation.md) |
| Drive | Amount of Waveshaping - technically the drive of the input signal against the curve. |
| Curve | Drawable transfer curve (x-axis = input level, y-axis = output level). |
| Oversample | Switch on to improve audio quality, especially for high pitched sounds and high drive. |

## Voice Effect: Shelf EQ
Gentle high or low shelving EQ, applied individually to each voice.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the module. |
| ModRoutings | See [module-reference-modulation.md](./module-reference-modulation.md) |
| Freq | Frequency of the shelf. |
| Low Gain | Attenuation/Boost below the specified frequency. |
| High Gain | Attenuation/Boost above the specified frequency. |

## Voice Effect: State-Variable Filter
2-pole (12 dB/oct) multi-mode filter, applied individually to each voice. Simulates a vintage analog filter.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the module. |
| ModRoutings | See [module-reference-modulation.md](./module-reference-modulation.md) |
| Cutoff | Cutoff frequency. |
| Resonance | Strength of resonant peak at cutoff frequency. Peak is damped when the input signal is loud. |
| Low/High | Fade between lowpass and highpass response. |
| Notch/Peak | Set the Low/High parameter to pass through a notch or bandpass response at its midpoint. |

## Voice Effect: Timestretch
Timestretching, applied individually to each voice. Note this module requires additional memory per voice, so currently only the first comb filter or timestretch in each group will be active.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the module. |
| ModRoutings | See [module-reference-modulation.md](./module-reference-modulation.md) |
| Speed | Playback speed through the zone's sample. |
| Keytrack | Keep the speed constant when played at different pitches across the keyboard. |
| Tempo Track | Adjust the speed to follow tempo changes. |
| Smoothing | Low values preserve the texture of the original sound, but may sound rough. High values increase the clarity of transients. |
| Formant Shift | Adjust formants to make the sound source seem bigger or smaller. To minimize CPU load leave Formant Shift at 0% and Formant Track at 100%. |
| Formant Track | How much the formants shift to follow the pitch. At zero, formant frequencies are fixed. |
| End Decay | Optionally freeze the spectrum at the end of the sample and decay to silence at the specified rate. |
| End Damping | High frequency damping to apply during the End Decay. |

## Voice Effect: Analog Oscillator
Multi-waveform oscillator plus sub, added individually to each voice.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the module. |
| ModRoutings | See [module-reference-modulation.md](./module-reference-modulation.md) |
| Tune | The pitch of the oscillator. |
| Saw | Level of the sawtooth waveform. |
| Pulse | Level of the square/pulse waveform. |
| Pulse Width | Width (duty cycle) of the pulse wave. Square when set to 50%. |
| Min Width | Minimum allowed width for the pulse wave, to avoid the sound getting too thin. |
| Triangle | Level of the triangle waveform. |
| Sub | Level of the square sub-oscillator (1 octave down). |
| Noise | Level of white noise. |
| DC Blocking | Highpass filter to avoid a DC offset, especially when modulating pulse width. Adjust to taste. |
| Phase Mode | Start phase of oscillator waveform for each note: reset to zero, free-running, or random. |

> ⚠ **Scripting note — `Tune` (param 2) is an absolute frequency parameter, not a semitone offset.** Calling `set_module_param` on it with a value of 0 collapses the oscillator to ~2 Hz regardless of Keytrack state. To apply a pitch offset on a key-tracked group, use **Group Tune (param 5, signed, 100k/semitone)** instead — see the Tune Parameter Taxonomy in [module-control.md](./module-control.md).

## Voice Effect: FM Oscillator
4-operator FM synthesizer with customizable algorithm and waveforms. Like the original, aliasing is possible so check the consistency of high notes at all sample rates.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the module. |
| ModRoutings | See [module-reference-modulation.md](./module-reference-modulation.md) |
| Tune | The pitch of the oscillator. |
| HF Damping | Progressively reduce operator 2-4 levels above this breakpoint key. |
| Wavetable | Select a wavetable module as a source for the four Wave parameters. |
| Op1 | Switch operator 1 on and off. |
| Op1 Wave | Select waveform (from sine to triangle when no wavetable is selected). |
| Op1 Level | Operator output level (always routed to output). |
| Op2 | Switch operator 2 on and off. |
| Op2 Ratio | Frequency ratio of operator 2 relative to operator 1. |
| Op2 Wave | Select waveform (from sine to triangle when no wavetable is selected). |
| Op2 Level | Operator output level. |
| Op2 Dest | Operator 2 routing (add to the output, or modulate operator 1). |
| Op3 | Switch operator 3 on and off. |
| Op3 Ratio | Frequency ratio of operator 3 relative to operator 1. |
| Op3 Wave | Select waveform (from sine to triangle when no wavetable is selected). |
| Op3 Level | Operator output level. |
| Op3 Dest | Operator 3 routing (add to the output, or modulate operator 1 or 2). |
| Op4 | Switch operator 4 on and off. |
| Op4 Ratio | Frequency ratio of operator 4 relative to operator 1. |
| Op4 Wave | Select waveform (from sine to triangle when no wavetable is selected). |
| Op4 Feedback | Operator feedback amount, for a richer or noisier waveform. |
| Op4 Level | Operator output level. |
| Op4 Dest | Operator 4 routing (add to the output, or modulate operator 1, 2 or 3). |

## Voice Effect: Sample Oscillator
Sample playback with optional granular mode, added individually to each voice. Ensure the Start Mod Range of zones to be played is set to the whole length of the sample!
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the module. |
| ModRoutings | See [module-reference-modulation.md](./module-reference-modulation.md) |
| Mapping | Select which mapping in the instrument to play. |
| Key Shift | Offset added to the key played before selecting a sample zone in the mapping. |
| Tune | Adjust playback pitch, in addition to any zone tuning. |
| Keytrack | Pitch follows keyboard and other pitch modulation. |
| Sample Pos | Playback start position in the sample. |
| Mix | Playback volume of the sample. |
| Grain Mode | Enable granular playback. |
| Grain Size | The length of each grain. To make this track the keyboard, add a mod routing from Key with an inverted depth of exactly 7.52575%. |
| Sample Speed | The speed the grains move through the sample. |
| Tempo Track | Adjust Sample Speed to track the tempo (relative to the zone Original Tempo setting if any). |
| Random Pitch | Add random tuning to each grain. |
| Random Pos | Add random sample position to each grain. |
| De-Glitch | Use the sample pitch (calculated from zone root note and tuning) to align grain positions to cycles in the waveform. |
| Equal Power Fade | Increase to smooth grain transitions if audio is noisy/uncorrelated. |

## Voice Effect: Sine Oscillator
Sine wave oscillator, added individually to each voice.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the module. |
| ModRoutings | See [module-reference-modulation.md](./module-reference-modulation.md) |
| Tune | The pitch of the generated sine wave. |
| Keytrack | Pitch follows keyboard and other pitch modulation. |
| Mix | The volume of the sine wave, or modulation depth if RingMod is active. |
| Ring Mod | Modulate (multiply) the audio signal by the sine wave, or in Hard mode by the polarity of the sine wave. |

> ⚠ **Scripting note — `Tune` (param 2) is an absolute frequency parameter, not a semitone offset.** Calling `set_module_param` on it with a value of 0 collapses the oscillator to ~2 Hz regardless of Keytrack state. To apply a pitch offset on a key-tracked group, use **Group Tune (param 5, signed, 100k/semitone)** instead — see the Tune Parameter Taxonomy in [module-control.md](./module-control.md).

## Voice Effect: Super Oscillator
Multi-saw oscillator plus sub, added individually to each voice.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the module. |
| ModRoutings | See [module-reference-modulation.md](./module-reference-modulation.md) |
| Oscillators | Number of oscillators (1 to 7). |
| Tune | The center pitch of the generated waveforms. |
| Detune | Amount of detuning between the oscillators. |
| Mix | Volume of the sawtooth oscillators. |
| Sub | Volume of the square sub-oscillators (1 octave down). |

> ⚠ **Scripting note — `Tune` (param 3) is an absolute frequency parameter, not a semitone offset.** Calling `set_module_param` on it with a value of 0 collapses the oscillator to ~2 Hz regardless of Keytrack state. To apply a pitch offset on a key-tracked group, use **Group Tune (param 5, signed, 100k/semitone)** instead — see the Tune Parameter Taxonomy in [module-control.md](./module-control.md).

## Voice Effect: Wavetable Oscillator
Arbitrary waveform oscillator, added individually to each voice. Requires one or more Wavetable modules in the instrument.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the module. |
| ModRoutings | See [module-reference-modulation.md](./module-reference-modulation.md) |
| Tune | The pitch of the generated waveform. |
| Wavetable | Select which wavetable to play (from the Wavetable modules in the instrument). |
| Wave | Select a position in the current wavetable from start to end. The position can be modulated. |
| Index | Displays the number of the waveform in the wavetable currently being played. |
| Smooth | Interpolate between the wavetable indexes, crossfading the waves instead switching from one to the next. |
| Random Phase | Add a random amount to the start phase of the waveform - useful when layering multiple voices. |
| Mix | Adjust the level of the wavetable playback. |
