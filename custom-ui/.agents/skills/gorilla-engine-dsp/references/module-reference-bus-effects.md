# Gorilla Editor — Module Reference: Bus Effects

Covers: Effect Bus, Effect Mod, and all bus-level effect modules.

> **Cross-references:** `EffectMod` is defined in this file (see [Effect Mod](#Effect-Mod)). `ModRouting` definition → see [module-reference-modulation.md](./module-reference-modulation.md)

## Contents

1. [Effect Bus](#Effect-Bus)
2. [Effect Mod](#Effect-Mod)
3. [Bus Effect: Beat Cutter](#Bus-Effect-Beat-Cutter)
4. [Bus Effect: Bus Compressor](#Bus-Effect-Bus-Compressor)
5. [Bus Effect: Chorus](#Bus-Effect-Chorus)
6. [Bus Effect: Compressor](#Bus-Effect-Compressor)
7. [Bus Effect: Convolution](#Bus-Effect-Convolution)
8. [Bus Effect: Crossover](#Bus-Effect-Crossover)
9. [Bus Effect: Delay](#Bus-Effect-Delay)
10. [Bus Effect: Distortion](#Bus-Effect-Distortion)
11. [Bus Effect: Envelope Follower](#Bus-Effect-Envelope-Follower)
12. [Bus Effect: EQ](#Bus-Effect-EQ)
13. [Bus Effect: Filter](#Bus-Effect-Filter)
14. [Bus Effect: Flanger](#Bus-Effect-Flanger)
15. [Bus Effect: Frequency Shifter](#Bus-Effect-Frequency-Shifter)
16. [Bus Effect: Gate](#Bus-Effect-Gate)
17. [Bus Effect: Grain Pitch](#Bus-Effect-Grain-Pitch)
18. [Bus Effect: Guitar Amp](#Bus-Effect-Guitar-Amp)
19. [Bus Effect: Isolator EQ](#Bus-Effect-Isolator-EQ)
20. [Bus Effect: Limiter](#Bus-Effect-Limiter)
21. [Bus Effect: Lo-Fi](#Bus-Effect-Lo-Fi)
22. [Bus Effect: Master Filter](#Bus-Effect-Master-Filter)
23. [Bus Effect: Multi-Band Compressor](#Bus-Effect-Multi-Band-Compressor)
24. [Bus Effect: Multi-Band Distortion](#Bus-Effect-Multi-Band-Distortion)
25. [Bus Effect: Multi-Tap Delay](#Bus-Effect-Multi-Tap-Delay)
26. [Bus Effect: Non-Linear Reverb](#Bus-Effect-Non-Linear-Reverb)
27. [Bus Effect: Overdrive](#Bus-Effect-Overdrive)
28. [Bus Effect: Pan](#Bus-Effect-Pan)
29. [Bus Effect: Phaser](#Bus-Effect-Phaser)
30. [Bus Effect: Resonators](#Bus-Effect-Resonators)
31. [Bus Effect: Reverb](#Bus-Effect-Reverb)
32. [Bus Effect: Rotary](#Bus-Effect-Rotary)
33. [Bus Effect: Saturation](#Bus-Effect-Saturation)
34. [Bus Effect: Send](#Bus-Effect-Send)
35. [Bus Effect: Sub Bass](#Bus-Effect-Sub-Bass)
36. [Bus Effect: Transient](#Bus-Effect-Transient)
37. [Bus Effect: Tremolo/Pan](#Bus-Effect-TremoloPan)
38. [Bus Effect: Vocoder](#Bus-Effect-Vocoder)

---

## Effect Bus

Each Effect Bus contains a number of effects, and can have audio routed to it by Groups or other Effect Busses. Each Effect Bus can route its output signal to an audio output or to another Effect Bus.
| Parameter | Description |
| --------- | ----------- |
| Name | Name to display for this Effect Bus. |
| Volume | Output level. |
| Output | Destination output or bus. |
| Mute | Mute the output of this bus (unless Solo is on). Does not stop the effects in the bus from running. |
| Solo | Solo this bus and mute any non-soloed busses. Set to Ignore if soloing other busses should not mute this one. |
| Effects | [Effect\*](#Effect*) |

## Effect Mod

Automation of an effect parameter from various sources and/or a built-in step LFO.
| Parameter | Description |
| --------- | ----------- |
| Active | Switch this modulation routing on or off. |
| Source | Select a mod source. 'Env Follower' uses the output of the previous Envelope Follower effect in the bus. 'Prev Mod' uses the value of the previous effect modulator in the bus, for modulating multiple parameters the same way. |
| CC | When Source is set to MIDI CC, selects which CC number to read from. |
| Smooth | Optional smoothing of the source value. |
| LFO | Activate the step LFO. |
| Steps | Edit the LFO steps. |
| Start | First step to play (allows switching between a few different waveforms). |
| Length | Number of steps to repeat. |
| Rate | Adjust the LFO rate (time per step). |
| Sync | Set the LFO rate in steps per beat rather than steps per second. |
| Retrig | Restart the LFO after pauses in the bus input audio (unsynced only), and when the reference bar beat changes. |
| Randomize | Scale each step by a random amount. |
| Ramp | Ramping between LFO steps. 0 % switches from one value to the next. Large steps (1.0 or more) are only ramped when set to 100 %. |
| Rate Mod | How much the selected Source value affects the LFO rate. |
| Depth Mod | How much the selected Source value affects the LFO depth. |
| Invert | Reduce the destination parameter instead of increasing it. |
| Depth | Amount of modulation from the LFO, or direct from the Source value if the LFO is not active. |
| Dest | Destination parameter to be modulated in the effect. |
| Curve Active | Determines if a custom curve is applied to the source value. |
| Curve | Edit the curve points. |

## Bus Effect: Beat Cutter

Cut up the incoming audio and apply various 'glitch' effects.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Grid | Rate that the audio is cut into steps/slices. |
| Swing | Adjust length of even steps relative to odd steps, for a shuffle feel. |
| Grid Per Beat | Number of grid steps that are grouped together to treat as one beat. |
| Beat Mask | How each beat can be processed. Consists of 8 digits (beats 1 to 8) which are each a sum of the following values: 1=can gate, 2=can repeat, 4=can repitch or reverse. |
| Can Gate | Probability that each grid step will be gated (enabled/disabled by the Beat Mask). |
| Gate Length | Length of gated steps before they are muted, as a proportion of the step length. |
| Gate Depth | Attenuation when gating is applied. |
| Gate Filter | Filter cutoff applied to gated steps. |
| Filter Random | Random filter cutoff per step. |
| Can Repeat | Probability that each grid step will repeat the audio of the previous step (enabled/disabled by the Beat Mask). |
| Can Reverse | Probability that each grid step will be played in reverse (enabled/disabled by the Beat Mask). |
| Reverse Offset | Delay offset when playing in reverse, to allow reversed transients to be aligned where they are wanted. |
| Can Repitch | Probability that each grid step will be pitched up or down one octave (enabled/disabled by the Beat Mask). |
| Smooth | Crossfade between each grid step to reduce clicks and make transitions smoother. |
| Mix | Dry/wet mix. |

## Bus Effect: Bus Compressor

Punchy compressor with configurable envelope detection.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| ModRoutings | [EffectMod](#Effect-Mod) |
| Detector LF | Highpass filter in sidechain, to reduce response to low frequencies. |
| Detector HF | High frequency boost in sidechain, to increase response to high frequencies. |
| Detector Att | Additional attack smoothing in the envelope detector. For an average rather than peak response, set Att and Rel to the same value around 20 ms. For additional release smoothing and shaping, leave Att at zero and increase Rel. |
| Detector Rel | Additional release smoothing in the envelope detector. |
| Detector Mode | Punch: Follow envelope below threshold, which increases attack punch as the envelope has further to come back up. Fast: Normal envelope detection with fast attack and release. Smooth: Release slows down as signal falls below threshold. |
| Threshold | Audio level above which compression is applied. |
| Ratio | Amount of gain reduction to apply. |
| Slam | Boosts the compression ratio so much that the output gets quieter as the input gets louder. |
| Attack | Time it takes for gain reduction to increase when the signal level rises. |
| Release | Time it takes for gain reduction to decrease when the signal level falls. |
| Output | Adjust the output volume to compensate for any loss in level due to compression. |
| Parallel Mix | Mixes compressor output with input signal. |
| Sidechain | Optionally use the next effect bus (after the one containing this compressor) as a sidechain input. |

## Bus Effect: Chorus

Chorus effect for creating a thicker, fatter, wider sound.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Rate | Modulation rate. |
| Depth | Depth of delay (pitch) modulation. |
| Delay | Pre-delay for each voice. |
| Voices | Number of chorus voices. |
| Dry | Level of the unprocessed input signal sent to the output. |
| Wet | Level of the effected signal. |
| Damping | Attenuate high frequencies. |
| Modulation | Square or sine wave LFO. |
| Mix | Mix between dry and wet signal (both unaffected at 50% mix). |

## Bus Effect: Compressor

Compressor effect for controlling dynamic range and shaping transients.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Threshold | Audio level above which compression is applied. |
| Ratio | Amount of gain reduction to apply. |
| Soft Knee | Gradual increase in ratio as signal level crosses threshold. |
| Slam | Boosts the compression ratio so much that the output gets quieter as the input gets louder. |
| Attack | Time it takes for gain reduction to increase when the signal level rises. |
| Release | Time it takes for gain reduction to increase when the signal level falls. |
| Output | Adjust the output volume to compensate for any loss in level due to compression. |

## Bus Effect: Convolution

Process the incoming audio with an impulse response, to add reverberation or the character of another audio device, acoustic space, or signal chain.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Impulse | Drop one or more impulse files (.wav or .aiff). Mono files will perform one convolution (left+right > mono output). Stereo files will perform two convolutions (left > left, right > right). To convolve left and right separately by the same impulse, use a stereo file containing mono audio. To reduce CPU load, keep impulses as short as possible. |
| Mode | Displays the current mode (Mono, Stereo). |
| Quality | Reduce bandwidth to save CPU - should be set as low as possible without hearing artifacts. |
| Input Width | Reduce to mix the left and right inputs together before convolution. |
| Pre Delay | Initial delay before reverb (it is a good idea to trim any pre-delay from the impulse file). |
| Dry | Level of the unprocessed input signal sent to the output. |
| Wet | Level of the effected signal. |
| Decay | Applies a volume ramp (decreasing or increasing) to the impulse to adjust the perceived reverb time. |
| Select Impulse | Switch between the loaded impulses, when more than one. |
| Mix | Mix between dry and wet signal (both unaffected at 50% mix). |

## Bus Effect: Crossover

Splits the audio into three frequency bands which are output into this and the next two effect busses.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Low Freq | Crossover frequency between low and mid bands. |
| High Freq | Crossover frequency between mid and high bands. |
| Slope | Crossover roll-off. Higher values give more separation between the bands. |

## Bus Effect: Delay

Stereo delay effect with adjustable feedback routing and left/right spread.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Time | Delay time. |
| Sync | Sets Time parameter to seconds or quarternote beats. |
| Feedback | Feedback from delay output to input to create multiple repeats. |
| Feedback Mode | Sets which channel(s) feedback is taken from. |
| Ratio | Negative values reduce the left channel delay, positive values reduce the right channel delay. |
| Dry | Level of the unprocessed input signal sent to the output. |
| Wet | Level of the effected signal. |
| Damping | Lowpass filter for progressive damping of each delay repeat. |
| Mix | Mix between dry and wet signal (both unaffected at 50% mix). |

## Bus Effect: Distortion

Stereo distortion/overdrive effect.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Drive | Input gain to the distortion. |
| Mode | Transistor (stereo hard clipping), Tube (soft clipping with DC bias), or custom waveshaping curve. |
| Low Cut | Highpass filter before distortion. |
| High Cut | Lowpass filter before distortion. |
| Dry | Level of the unprocessed input signal sent to the output. |
| Wet | Level of the effected signal. |
| Rectify | Degree to which negative signal peaks are converted to positive. |
| Curve | Edit the waveshaping curve. |
| Mix | Mix between dry and wet signal (both unaffected at 50% mix). |

## Bus Effect: Envelope Follower

Does not modify the audio signal, but instead measures its level to use as a modulation source elsewhere.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Mode | Type of envelope detection. Possible values are: <br />`Lin`: Linear (voltage) measurement up to the threshold level.<br />`Log`: Logarithmic (dB) measurement above the threshold level.<br />`Gate`: Switch off and on as the signal level passes the threshold. |
| Thresh | Lin: audio level for full modulation. Log: audio level for no modulation. Gate: switching threshold. |
| Attack | Rise time when the audio level increases or the gate opens. |
| Release | Fall time when the audio level decreases or the gate closes. |
| Output CC | Write the envelope level to the selected MIDI CC, which can be used as a mod source. Note the instrument script does not receive these CC changes because they are happening continuously. |

## Bus Effect: EQ

Four-band equalizer with parametric mid bands.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Low Gain | Low frequency boost or cut. |
| Low Freq | Low shelf frequency. |
| Low Contour | Shape of low shelf: Baxandall at 0%, values above 50% add a notch. |
| Mid 1 Gain | Low-mid frequency boost or cut. |
| Mid 1 Freq | Low-mid center frequency. |
| Mid 1 Width | Low-mid bell bandwidth. |
| Mid 2 Gain | High-mid frequency boost or cut. |
| Mid 2 Freq | High-mid center frequency. |
| Mid 2 Width | High-mid bell bandwidth. |
| High Gain | High frequency boost or cut. |
| High Freq | High shelf frequency. |
| High Contour | Shape of high shelf: Baxandall at 0%, values above 50% add a notch. |
| Output | Level trim to compensate for any gain change due to equalization. |

## Bus Effect: Filter

Filter effect which can be used as an alternative to the per-voice Filter modules in Groups if you want to apply a filter after other effects, or don't need to modulate the filter independently for each voice.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Mode | Type of filter to apply Possible values are: <br />`LP12`: 12 dB/oct lowpass.<br />`LP24`: 24 dB/oct lowpass.<br />`LP+`: Brickwall lowpass (no resonance).<br />`BP6`: Bandpass with 6 dB/oct roll-offs.<br />`HP12`: 12 dB/oct highpass.<br />`HP+`: Brickwall highpass (no resonance).<br />`Comb+`: Comb filter.<br />`Comb-`: Comb filter with inverted phase.<br />`SVF`: State Variable filter. |
| Cutoff | Cutoff frequency. |
| Resonance | Strength of resonant peak at cutoff frequency. |
| SVF Low/High | Fade between lowpass and highpass response in SVF filter mode. |
| SVF Notch/Peak | Fade between notch and bandpass response in SVF filter mode. |

## Bus Effect: Flanger

Flanger effect based on a modulated delay line.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Rate | Modulation rate. |
| Depth | Delay modulation depth. |
| Delay | Minimum delay. |
| Feedback | Add resonant peaks. |
| Phase | Phase offset between left and right modulation. |
| Mix | Dry/wet mix. |

## Bus Effect: Frequency Shifter

Bode frequency shift (inharmonic shift in Hertz, not pitch).
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the module. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Mode | Shift frequencies up, down, or left and right channels in opposite directions. |
| Range | Frequency shift in Hertz. Low values result in barber's pole phasing when Mix is set to 50%. |
| Depth | Linear scaling of shift amount, can also be inverted. Useful as a mod destination. |
| Feedback | Add feedback to add overtones or increase depth of phasing. |
| Mix | Dry/wet mix. |
| Balance | Fade between selected direction (100%) to the opposite direction through ring modulation (0%). |

## Bus Effect: Gate

Noise gate with duck mode and optional sidechain.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Mode | Gate (attenuate when signal below threshold) or Duck (attenuate when signal above threshold). |
| Sidechain | Trigger input. Possible values are: <br />`Off`: No sidechain - use effect input level.<br />`Env Follower`: Use envelope follower in effect bus as sidechain input.<br />`Next Bus`: Use signal in next effect bus as sidechain input.<br />`Manual Only`: Only respond to Manual Trigger parameter. |
| Manual Trigger | Trigger the gate manually or from the instrument script. |
| Threshold | Adjust the audio level that causes the gate to open. |
| Range | Adjust the attenuation when the gate is closed. |
| Attack | Time the gate takes to open. |
| Hold | Minimum time the gate will stay open for. |
| Release | Time the gate takes to close. |

## Bus Effect: Grain Pitch

Granular Pitch-Shift and Delay.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Delay | Delay time before grains play. |
| Sync | Sets the delay time in seconds or quarternote beats. |
| Random Delay | Randomize grain position in the delay line (100% = anywhere from zero to delay time). |
| Feedback | Feedback from grain output back to delay input. |
| Grain Size | Grain duration in milliseconds. |
| Tempo Track | Adjust grain size relative to the tempo. |
| Random Size | Random variation in grain size. |
| Density | Overlap between grains. Set below 1.0 for sparse blips, 2.0 or above for a thicker sound or if alternating between two pitches (uses more CPU). |
| Snap To Grid | Quantizes the next grain to the specified beat grid (and therefore limits the grain density to not more than one per grid). |
| Direction | Set the grain playback direction to forwards, reverse, alternating forward/reverse, or random for each grain. |
| Pitch | Playback speed for each grain, to vary the pitch up to 2 octaves. |
| De-Glitch | Phase-align grains for smoother pitch shifting (disable if not needed to reduce CPU load). |
| Alt. Pitch | Even grains have this value added to their pitch, odd grains have it subtracted. |
| Random Pitch | Random pitch variation for each grain. |
| Alt. Pan | Alternating pan for each grain. Use with Alt Pitch to tune one side up and the other side down. |
| Random Pan | Random pan for each grain. |
| Low Cut | Highpass filter before output and delay feedback. |
| Limiter | Release time of limiter before output and delay feedback. Set to low values for saturation/distortion. |
| Dry | Level of the unprocessed input signal sent to the output. |
| Wet | Level of the effected signal. |
| Mix | Mix between dry and wet signal (both unaffected at 50% mix). |

## Bus Effect: Guitar Amp

Models of three classic guitar amplifiers. Mono output.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Model | Select the amp model |
| Gain | Input gain. |
| Bass | Bass tone control. |
| Mid | Mid tone control. |
| Treble | Treble tone control. |
| Volume | Amp volume control. |
| Output | Output level trim. |
| Mode | Optionally process the left or right channel only. |

## Bus Effect: Isolator EQ

DJ-style EQ that can be used to eliminate the low mid or high frequencies.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Low | Level of low frequencies. |
| Mid | Level of mid frequencies. |
| High | Level of high frequencies. |
| Low Freq | Crossover frequency between low and mid bands. |
| High Freq | Crossover frequency between mid and high bands. |

## Bus Effect: Limiter

Low-CPU safety limiter to keep levels in check, with a fixed 0 dBFS threshold.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Release | Recovery time. |
| Mode | Soft knee, hard knee, or hard clipping. |
| Maximize | Enable maximizer mode which boosts and compresses the input to the limiter. |
| Drive | Maximizer input level (only has an effect when Maximize is On). |

## Bus Effect: Lo-Fi

Sample rate and bit depth reduction.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Sample Rate | Downsampling rate. |
| Jitter | Random modulation of downsampling rate. |
| Mix | Dry/wet mix. |
| Bit Depth | Bit reduction. |
| Bit Bias | Offset to adjust the quietest audio that jumps from one bit level to the next. |
| Slew Rate | Limit the change from one sample to the next. Simulates ADPCM/companding converters. |

## Bus Effect: Master Filter

Master EQ and high/low filter.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Cutoff | Turn left for lowpass, right for highpass. Set to exactly 0.0 to save CPU. |
| Low Reso | Resonance of lowpass filter. |
| Low Reso Track | Adjust resonance at high versus low cutoffs. |
| High Reso | Resonance of highpass filter. |
| High Reso Track | Adjust resonance at high versus low cutoffs. |
| Low Boost | Psycho-acoustic low shelf filter. |
| Low Freq | Adjust the frequency of the low boost. |
| High Boost | Psycho-acoustic high shelf filter. |
| High Freq | Adjust the frequency of the high boost. |

## Bus Effect: Multi-Band Compressor

Separate compression of low, mid and high frequencies.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Low Drive | Low frequency input gain. |
| Mid Drive | Mid frequency input gain. |
| High Drive | High frequency input gain. |
| Low Out | Low frequency output level trim. |
| Mid Out | Mid frequency output level trim. |
| High Out | High frequency output level trim. |
| Low Attack | Low frequency compression onset time. |
| Mid Attack | Mid frequency compression onset time. |
| High Attack | High frequency compression onset time. |
| Low Release | Low frequency compression recovery time. |
| Mid Release | Mid frequency compression recovery time. |
| High Release | High frequency compression recovery time. |
| Low Freq | Crossover frequency between low and mid bands. |
| High Freq | Crossover frequency between mid and high bands. |
| Slope | Crossover roll-off. Higher values give more separation between the bands. |
| Soft Knee | Gradual increase in ratio as signal level crosses threshold. |
| Overshoot | When active, knee is extra hard at minimum setting. |

## Bus Effect: Multi-Band Distortion

Stereo mix of four distortions each preceded by a multi-mode filter.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Band 1 | Switch band 1 on and off. |
| 1 Curve | Select different distortion curves. |
| 1 Cutoff | Adjust cutoff frequency of pre-distortion filter |
| 1 Resonance | Adjust filter resonance (values below 11% result in a notch rather than a peak). |
| 1 Tilt | Adjust filter mode from highpass, through notch or bandpass, to highpass. |
| 1 Drive | Distortion input drive. |
| 1 Level | Distortion output volume. |
| 1 Pan | Stereo position of the distorted signal. Also fades the distortion input between the left and right inputs to allow true stereo processing. |
| Band 2 | Switch band 2 on and off. |
| 2 Curve | Select different distortion curves. |
| 2 Cutoff | Adjust cutoff frequency of pre-distortion filter |
| 2 Resonance | Adjust filter resonance (values below 11% result in a notch rather than a peak). |
| 2 Tilt | Adjust filter mode from highpass, through notch or bandpass, to highpass. |
| 2 Drive | Distortion input drive. |
| 2 Level | Distortion output volume. |
| 2 Pan | Stereo position of the distorted signal. Also fades the distortion input between the left and right inputs to allow true stereo processing. |
| Band 3 | Switch band 3 on and off. |
| 3 Curve | Select different distortion curves. |
| 3 Cutoff | Adjust cutoff frequency of pre-distortion filter |
| 3 Resonance | Adjust filter resonance (values below 11% result in a notch rather than a peak). |
| 3 Tilt | Adjust filter mode from highpass, through notch or bandpass, to highpass. |
| 3 Drive | Distortion input drive. |
| 3 Level | Distortion output volume. |
| 3 Pan | Stereo position of the distorted signal. Also fades the distortion input between the left and right inputs to allow true stereo processing. |
| Band 4 | Switch band 4 on and off. |
| 4 Curve | Select different distortion curves. |
| 4 Cutoff | Adjust cutoff frequency of pre-distortion filter |
| 4 Resonance | Adjust filter resonance (values below 11% result in a notch rather than a peak). |
| 4 Tilt | Adjust filter mode from highpass, through notch or bandpass, to highpass. |
| 4 Drive | Distortion input drive. |
| 4 Level | Distortion output volume. |
| 4 Pan | Stereo position of the distorted signal. Also fades the distortion input between the left and right inputs to allow true stereo processing. |
| Low Bypass | Cuts distorted low frequencies and lets dry lows pass through. |
| High Bypass | Cuts distorted high frequencies and lets dry highs pass through. |
| Mix | Dry/wet mix. |

## Bus Effect: Multi-Tap Delay

Delay effect with up to 16 configurable taps and smoothing of delay time changes.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Time | Delay time. |
| Sync | Sets Time parameter to seconds or quarternote beats. |
| Input Width | Reduce (or flip for negative values) the stereo width of the delay input and each feedback repeat. |
| Feedback | Feedback to the delay input to create multiple repeats. |
| Feedback Tap | Select which output tap the feedback is taken from. |
| Tap Time | Delay time for each tap, as a percentage of the Time parameter. |
| Tap level | Volume for each tap. Set to zero to disable the tap, saving CPU. |
| Tap Pan | Stereo pan position for each tap. |
| Tap Filter | Filter center frequency for each tap. Filters are bypassed at 0% if Resonance is also 0%. |
| Resonance | Filter resonance for all taps. Morphs from a gentle tone control to a narrow bandpass. |
| Low Cut | Highpass filter for progressive thinning of each delay repeat. |
| High Cut | Lowpass filter for progressive damping of each delay repeat. |
| Dry | Level of the unprocessed input signal sent to the output. |
| Wet | Level of the effected signal. |
| Mix | Mix between dry and wet signal (both unaffected at 50% mix). |
| Saturation | Add dirt to the delay/feedback signal. |

## Bus Effect: Non-Linear Reverb

Reverberation with a hard 'gated' cutoff after the reverb time.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Time | Length of reverb tail before it is cut off. |
| Low Cut | Highpass filter cutoff frequency. |
| High Cut | Lowpass filter cutoff frequency. |
| Dry | Level of the unprocessed input signal sent to the output. |
| Wet | Level of the effected signal. |
| Mix | Mix between dry and wet signal (both unaffected at 50% mix). |

## Bus Effect: Overdrive

Mono overdrive effect with algorithms taken from the Scream 4 device in Reason. Only available in Rack Extensions.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Drive | Increase input gain to add distortion. |
| Mode | Choose between Overdrive, Scream or Fuzz emulations. |
| Tone | Adjust tone (result depends on selected mode). |
| Presence | Adjust high frequencies (result depends on selected mode). |

## Bus Effect: Pan

Pan, stereo width and phase adjustment.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Width | Adjust stereo width using an M-S matrix (has no effect on mono signals). |
| Pan | Move the right channel left or the left channel right (different to Group panning which does not move the channels but adjusts their relative levels). |
| Swap Channels | Swap left and right inputs. |
| Invert Phase | Invert the phase of one or both channels. |
| Gain | Output level. |

## Bus Effect: Phaser

Phaser effect with up to 8 poles (4 peaks/notches).
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Rate | Modulation rate. |
| Depth | Center frequency modulation. |
| Feedback | Add resonant peaks between the notches. |
| Center | Center frequency. |
| Spread | Offset between left and right center frequencies |
| Mix | Dry/wet mix. |
| Poles | Number of stages (more stages = more peaks and notches). |
| Invert Feedback | Flip feedback polarity for a different sound character. |

## Bus Effect: Resonators

Tuned resonators for emulating sympathetic resonance of pianos and other instruments.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Decay | Resonance decay time. |
| Keytrack | Faster decay at higher frequencies. |
| Width | Stereo spread of the individual resonators. |
| Dry | Level of the unprocessed input signal sent to the output. |
| Wet | Level of the effected signal. |
| Mix | Mix between dry and wet signal (both unaffected at 50% mix). |

## Bus Effect: Reverb

Algorithmic reverb emulating a digital reverb unit. For convolution reverb, please use the Convolution module.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Time | Length of reverb tail. |
| Pre Delay | Initial delay before reverb. |
| Low Cut | Highpass filter cutoff frequency. |
| High Cut | Lowpass filter cutoff frequency. |
| Damping | Progressive loss of high frequencies in reverb tail. |
| Dry | Level of the unprocessed input signal sent to the output. |
| Wet | Level of the effected signal. |
| Low Damping | Progressive loss of low frequencies in reverb tail. |
| Mix | Mix between dry and wet signal (both unaffected at 50% mix). |

## Bus Effect: Rotary

Simulates a rotary speaker. Does not contain any overdrive distortion or cabinet simulation, so you might want to combine this effect with the Distortion and Convolution effects.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Speed | Stop, Slow, Fast |
| Crossover | Crossover frequency between Bass and Horn. |
| Balance | Volume balance between Bass and Horn. |
| Mic Angle | The simulated microphone angle towards the simulated rotary speaker cabinet. |
| Bass Accel | Acceleration and deceleration time of the Bass rotor. |
| Bass Slow | Rotation speed of the Bass rotor at 'Slow' speed. |
| Bass Fast | Rotation speed of the Bass rotor at 'Fast' speed. |
| Bass Amp Mod | Amplitude modulation of the Bass signal. |
| Horn Accel | Acceleration and deceleration time of the Horn. |
| Horn Slow | Rotation speed of the Horn at 'Slow' speed. |
| Horn Fast | Rotation speed of the Horn at 'Fast' speed. |
| Horn Amp Mod | Amplitude modulation of the Horn signal. |
| Horn Freq Mod | Frequency modulation of the Horn signal. |

## Bus Effect: Saturation

Gradual distortion of the signal.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Thresh | The audio level at which saturation occurs. Reduce for more distortion without more level. |
| Drive | Increases the input level resulting in more saturation and more level. |
| Low Drive | Increase the distortion of low frequencies. |
| High Drive | Increase the distortion of high frequencies. |
| Density | Adjust the distortion curve from concave to convex. |
| High Bypass | Crossover to allow high frequencies through unprocessed. |
| Mix | Dry/wet mix. |

Use Saturation for a conventional controllable soft clipper: `Thresh` sets the clipping onset, `Drive` pushes the signal into the curve, `Density` shapes the curve, and `Mix` blends processed and dry signals. Limiter in Soft mode is better suited to fixed-threshold output protection.

## Bus Effect: Send

Sends a copy of the signal to another Effect Bus or to an audio output.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Output | Select an output or another Effect Bus to send to. |
| Send Level | Volume of sent signal. |
| Source Chan L | Optionally choose a different channel to send to the left channel of the destination. |
| Source Chan R | Optionally choose a different channel to send to the right channel of the destination. |
| Mute Source | Mute the source channels after sending them. This can be used for splitting a multi-channel signal across more than one bus, which can be useful as most effects only process the first two channels. |

## Bus Effect: Sub Bass

Generate a sub-octave signal (like an octave divider pedal).
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Max Freq | Maximum input frequency a sub octave will be generated for. |
| Tone | Adjust harmonic content of generated sub octave. |
| Dry | Level of the unprocessed input signal sent to the output. |
| Wet | Level of the effected signal. |
| Mix | Mix between dry and wet signal (both unaffected at 50% mix). |

## Bus Effect: Transient

Accentuate or reduce the level of signal transients, independent of audio level.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Attack | Boost or cut the attack transients. |
| Hold | Length of the attack boost/cut. |

## Bus Effect: Tremolo/Pan

Apply tremolo and/or auto-pan effects.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Rate | Adjust the modulation rate. |
| Sync | Switch the modulation rate between cycles per second (Hz) or cycles per beat. |
| Depth | Adjust the amplitude modulation depth. |
| Symmetry | Adjust the 'on' time relative to the 'off' time. |
| Attack | Adjust the attack length as a percentage of the 'on' time. |
| Attack Curve | Adjust the attack curve (slow...linear...fast...S-curve). |
| Release | Adjust the release length as a percentage of the 'off' time. |
| Release Curve | Adjust the release curve (slow...linear...fast...S-curve). |
| Phase | Adjust the initial phase of the modulation (relative to beat positions when sync is on). |
| Spread | Adjust the phase of the right channel relative to the left, to add stereo width and create auto-pan effects. |

## Bus Effect: Vocoder

Apply the spectrum of one sound to another using a filter bank.
| Parameter | Description |
| --------- | ----------- |
| Bypass | Disable the effect. |
| EffectMods | [EffectMod](#Effect-Mod) |
| Mod Input | Use the right audio channel or the signal from the next effect bus as modulator input. |
| Bands | Number of frequency bands in the filter bank. |
| Low Freq | Center frequency of the lowest band. |
| High Freq | Center frequency of the highest band. |
| Resonance | Adjust the width of each band. |
| Band Shape | Resonant bell shape or flat top. |
| Smoothing | How fast the envelope of the modulator signal is tracked. |
| Stereo Spread | Pan alternate band outputs left and right. |
| Gain | Level trim for vocoded signal. |
| Mix | Output mix between modulator at 0%, vocoded signal at 50% and carrier signal at 100% |
