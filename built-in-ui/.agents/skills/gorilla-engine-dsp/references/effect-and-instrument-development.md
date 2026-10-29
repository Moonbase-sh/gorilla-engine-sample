# Effect and Instrument Development

These recipes capture DSP-engineering guidance for Gorilla Engine projects. Resolve indices from the actual `.inst` topology and verify module parameters in the installed SDK documentation before adapting code. The examples assume the required modules already exist.

## Effect Audio Path and Editor Testing

Host audio input arrives in the first bus. Route it through the desired effects and then to the plugin output. Prefer separate buses for input gain/metering, processing, and output gain/metering:

```text
Host input -> Bus 1: input gain/meter -> Bus 2: effects -> Bus 3: output gain/meter -> Output
```

Processing may span multiple buses. Keep destinations later than their sources wherever possible. Configure bus Output destinations in the instrument; declaring bus constants in a script does not create buses or wire them together. Do not assume an existing scaffold already has this three-bus layout.

For editor testing, temporarily add samples to a Group and route that Group through the effect chain. Remove these editor-only Groups/samples before release so the shipped effect does not contain an unintended instrument or sound source. Do not remove Groups deliberately used for background audio or modulation.

### Input and Output Controls

For the three-bus layout above, this script exposes input/output levels and stereo meters. `M_BUS + 1`, `M_BUS + 2`, and `M_BUS + 3` refer to the first, second, and third buses. Effect Bus Volume is parameter `2`; the other address fields below are `0`. `prop_decibels` values are engine values, not literal dB numbers.

```text
on init
  const INPUT_BUS = M_BUS + 1
  const EFFECT_BUS = M_BUS + 2
  const OUTPUT_BUS = M_BUS + 3

  prop_decibels Input_Level(1000000, 12)
  prop_meter Input_Meter[2]
  attach_meter(Input_Meter, INPUT_BUS, 0)

  prop_decibels Output_Level(1000000, 12)
  prop_meter Output_Meter[2]
  attach_meter(Output_Meter, OUTPUT_BUS, 0)

  set_module_param(INPUT_BUS, 0, 0, 2, Input_Level)
  set_module_param(OUTPUT_BUS, 0, 0, 2, Output_Level)
end on

on Input_Level
  set_module_param(INPUT_BUS, 0, 0, 2, Input_Level)
end on

on Output_Level
  set_module_param(OUTPUT_BUS, 0, 0, 2, Output_Level)
end on
```

Add the processing controls for modules on `EFFECT_BUS` using their documented addresses. Initial gain assignments are explicit because property defaults do not invoke property callbacks. Adapt the output index if processing uses more than one bus. Meter attachment `0` measures the bus, not an individual effect's gain reduction.

## MIDI-Controlled Effects

An effect that receives MIDI needs both flags in its `.ugep`/Gorilla Compiler configuration:

```json
{
  "isEffect": true,
  "hasMidiInput": true
}
```

The generator's ordinary effect scaffold sets `hasMidiInput` to `false`; enable it deliberately for a MIDI-controlled effect, without changing `isEffect` to `false`. In AU format this is a **MIDI Controlled Effect**. Logic Pro lists it alongside instrument plugins, not in its ordinary audio-effect list. Check the correct host category before concluding the plugin is missing.

After changing `isEffect` or `hasMidiInput`, run `npm run buildAndInstall` to recompile and install the plugin with the updated configuration. Script/instrument syncing or live preview alone cannot apply these compiled plugin settings. This configuration change requires a compile-and-install step even though packaging builds are not used for routine script validation. Test the newly installed plugin in the host.

## Background Audio and Group Modulation

For background audio such as noise, a Sample Player effect in a bus is an option. For more flexible audio generation or Group LFO modulation, trigger a sustained note in a Group and route its output as required. That Group needs an appropriate Zone, sample or oscillator, and modulation topology.

CC 123 (all notes off) is also received when audio starts or restarts. Use it to replace the background note, so an audio restart does not leave generation stopped or create duplicate notes:

```text
on init
  var backgroundEvent
end on

on note
  ignore_event(EVENT_ID)
end on

on controller
  if EVENT_CC == 123
    trigger_new_event()
  end if
end on

on new_event
  release_note(backgroundEvent)
  backgroundEvent = new_note(60, 100, 0, 0)
end on
```

The final `0` in `new_note` makes the note indefinite until released. Releasing the previous event before creating its replacement prevents accumulation. The `on note` callback suppresses incoming MIDI note playback; use it only when that is intended. Integrate this recipe with existing callbacks rather than defining duplicate callbacks or suppressing notes needed by a MIDI-controlled effect. Ensure key 60 and velocity 100 trigger the intended Group/mapping, and check which other Groups they may also trigger.

### Periodic Updates Instead of a Background Note

If only periodic measurement or state updates are needed, reuse the `on init` declaration and CC 123 restart handler above, but **replace** `on new_event` with this timer callback:

```text
on new_event
  backgroundEvent = EVENT_ID
  while backgroundEvent == EVENT_ID
    delay_msec(50)
  end while
end on
```

Insert the required measurement/update statements before `delay_msec(50)`. This is an alternative to the sustained-note callback, not a second `on new_event` callback. Each restart stores the new event ID; the older loop exits when its ID no longer matches. Always yield using a delay, never busy-loop. This timer does not create an audio voice or replace a Group note needed to run voice modulation. It starts through the audio-start/restart CC 123 path, not from a UI wall-clock timer.

## Backward Routing and Deliberate Feedback

Buses render from first to last. Routing audio from a higher bus index to a lower index adds **64 samples of latency**. Prefer forward routing unless the backward route is deliberate, such as a feedback loop.

For intentional backward routing:

1. Include at least one **Convolution** effect somewhere in a bus. This ensures a fixed audio block size even when the DAW varies its block size; without it, the backward route can produce glitchy audio.
2. For an exact feedback round-trip delay, use the Delay effect's **Time Trim** parameter to subtract 64 samples from the displayed delay time. Verify the parameter's index and unit/encoding in the installed SDK; do not pass a guessed raw value of `-64`.
3. Test with restrained feedback gain and output levels. Check the actual round-trip timing and audio stability in the host, including varying block sizes and audio restarts.

The 64-sample feedback adjustment is not a substitute for reporting plugin latency to the host. Consult the existing latency-reporting guidance when the overall signal path requires host compensation.

## Sample and Oscillator Zone Mappings

### Initial Mapping for Recorded Samples

When the user wants a sample-based instrument built from a pool of recorded audio, inspect metadata embedded in the audio files and metadata encoded in the file names before creating Zones. Use available root-note, key-range, and velocity-layer information to work out the keyboard mapping. Confirm filename conventions with the user if they are ambiguous; do not invent missing mapping information or silently resolve conflicting metadata.

When metadata is insufficient or audio analysis is needed, recommend that the user create the initial mapping in Gorilla Editor. Its superior sample analysis functionality can map samples based on detected pitch and loudness, helping establish keyboard placement and velocity layers. Continue development from the instrument mapping the user saves, and validate key/velocity boundaries and intended overlaps in the editor/host.

A Group needs a Zone to define which keys and velocities trigger it, even if its sound comes entirely from oscillators rather than samples. For oscillator-only Groups, the Zone's sample path can be empty:

```json
{ "Module": "Zone", "Sample": "" }
```

This shows the empty-sample field, not a complete Group or mapping. Configure the Zone's key/velocity range and the Group's oscillator/modulation modules in the instrument. For sample-based instruments, use the intended sample paths and test each key/velocity range, including boundaries, gaps, and deliberate overlaps. An empty sample path permits oscillator voices; it does not itself generate sound.

### Layered Zones for Unison

Alternate mappings can contain different numbers of Zones layered over the same key/velocity range. When the Group plays that mapping, overlapping Zones trigger multiple voices per incoming note, producing unison. Pan and detune the Zones and use **Zone Parameter 1** and **Zone Parameter 2** as modulation sources for per-Zone variation. Verify their destination parameters and modulation encodings in the SDK before scripting them.

Check the intended voice count, level increase, and CPU cost as layers are added. Distinguish intentional layering from accidental duplicate Zones. Test switching alternate mappings as well as the initial mapping.

### Drum Synth Mapping

Use a separate Group for each drum sound and set its Zones to the key or keys that should trigger it. The Zones may have empty sample paths when the Group uses oscillators. Use Zone Parameter 1 and Zone Parameter 2 as modulation sources for variations such as tom pitch or hi-hat decay. Check that each mapped key triggers only the intended drum Groups unless layering is intentional.

## Validation and Release Checks

- Export/syntax-check after topology or scripting edits, then verify the behavior in the editor and host. Report export success separately from audible verification.
- For effects, confirm host input reaches the first bus, the full chain reaches output, and both gain controls/meters respond correctly.
- For MIDI-controlled effects, verify both compiler flags, host plugin category, and the intended MIDI response.
- For background notes/timers, test audio start, stop/restart, and repeated CC 123 events; check that there is only one active background note or update loop.
- For feedback, verify the Convolution fixed-block precaution and actual delay/stability; do not validate it using export success alone.
- For instruments, test key/velocity coverage, intended layering, alternate mappings, and drum key isolation.
- Remove editor-only sample test fixtures from release effects; preserve intentional sound-generation content.