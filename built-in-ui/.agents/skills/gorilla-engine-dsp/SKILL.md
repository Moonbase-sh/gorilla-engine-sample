---
name: gorilla-engine-dsp
description: 'Use when developing Gorilla Engine effects, MIDI-controlled effects, sample-based instruments or oscillator synths; editing scripts, bus routing, feedback, meters, background notes, timers or zone mappings; looking up installed SDK module documentation on macOS or Windows; exporting instruments; or managing npm start standalone watchers.'
---

# Gorilla Engine DSP — Instrument Scripting

---

## SDK Lookup and Process Lifecycle

- Check the installed SDK first: macOS defaults to `/Applications/Gorilla Engine SDK`; Windows defaults to `C:\Program Files\Gorilla Engine SDK` (normally `%ProgramFiles%\Gorilla Engine SDK` in cmd.exe or `Join-Path $env:ProgramFiles 'Gorilla Engine SDK'` in PowerShell). Quote paths containing spaces. If absent, ask for the custom installation location rather than broadly scanning unrelated resources.
- The module reference is `<SDK_ROOT>/Documentation/development-workflow/gorilla-editor/modules/index.html` (use backslashes on Windows). Verify parameter numbers, ranges, and encodings there; bundled references may be outdated. Search installed SDK docs first, honor SDK-only research requests, and extract narrow HTML sections instead of dumping minified lines. Do not substitute npm packages or unrelated application resources for the module reference.
- The export tool is `<SDK_ROOT>/Tools/blob-export` on macOS or `<SDK_ROOT>\Tools\blob-export.exe` on Windows. In PowerShell, invoke a quoted executable path with `&`.
- Read `package.json` before running commands. Both `npm start` and `npm run deploy` are persistent watchers, not one-shot builds. `npm start` using `--standalone` also launches a native app. Reuse an existing project watcher for either command; repeated launches can create duplicate watchers/apps and misleading audio observations on either OS.
- Prefer one-shot `npm run sync:instruments` for DSP changes, `npm run build:ui` for UI changes, or `npm run prepare:artifacts` for both, when available. Do not use packaging builds as routine validation.
- Keep one live preview running for the active project during iterative development so users can see changes as they happen. Read `package.json` to identify the preview command; in these projects it is normally `npm start`, which owns the watchers and launches the native app.
- **Transport-dependent plugins:** For plugins that require DAW transport, such as the SDK Drum Sequencer example, use `npm run deploy` and test inside a DAW with transport running instead of using `npm start`. The latter launches the standalone application, which does not provide DAW transport. After deployment, remove and re-add the plugin instance to load changes.
- Before launching a preview, check whether this project's preview watcher is already running. Identify it by the project directory and command, not merely by a Node process or an open app; an open native app does not prove its watcher is running. Reuse the existing watcher without claiming ownership of a user-started process. Recheck immediately before launching to avoid duplicate instances.
- If no watcher is running and the environment supports persistent background processes, start one using the environment's normal approval flow. Explain this as "Starting the live preview so you can see changes as we work." Do not routinely ask the user to choose who runs a shell command. Respect an explicit preference that the user manages the preview.
- If the environment cannot launch or retain the preview, explain that limitation in plain language and provide the simplest available launch steps. If process detection is inconclusive, ask whether the live preview is already running before starting another instance.
- If the agent cannot run commands or access terminal output but can read project files, check `package.json` for the logging commands and ask the user to run `npm run start:log` for standalone preview or `npm run deploy:log` for DAW deployment. They work on macOS and Windows and write `standalone.log` or `deploy.log` in the project root while displaying terminal output. Read the latest lines with file-reading tools, or tail the file if shell access is available; the user must keep the command running and handle permission prompts in their terminal. Do not start a second watcher. Logs are overwritten each run, so check for fresh output rather than treating an old log as proof the watcher is running. `deploy.log` captures deployment-tool output, not necessarily plugin debug output inside the DAW. The helper in `dev/scripts/log.cjs` is development-only and must not be added to Gorilla Compiler packaging assets.
- Track the project directory, command, terminal or execution handle, PID, and child processes for previews you start. Leave the preview running between edits and at the end of a turn while development continues. Do not restart it after each edit or stop it merely because a response is complete.
- Stop or restart a preview only when requested, when necessary to recover a failed preview, or when the environment requires cleanup. Stop only processes whose ownership is established; ask if ownership is unclear. Never terminate user-started processes without permission or kill all Node/native app processes by name. On macOS inspect command lines and parent PIDs with `ps`. On Windows use `Get-CimInstance Win32_Process` to inspect `ProcessId`, `ParentProcessId`, and `CommandLine`. Prefer stopping the owned terminal gracefully; when process-tree termination is needed on Windows, use `taskkill /PID <owned-pid> /T`. Verify that targeted processes and surviving children exited when stopping a preview.
- Export/build success verifies structure, not audible behavior or parameter scaling. Report documented facts separately from runtime-verified behavior.

## Workflow

1. Read the target `.txt` script and the relevant arrays in the current `.inst` file. The instrument file controls module order, so resolve addresses from its current topology; a full-file inventory or user-facing pre-flight report is not required. For large instrument files, search from the end unless locating Groups or Mappings.
2. Load [indexing.md](./references/indexing.md) before deriving `M_GROUP`, `M_FILTER`, `M_MOD_SRC`, `M_MOD`, `M_BUS`, `M_EFFECT`, or other module indices. Derive each index from the documented array position and scope.
3. Follow the Script Language Reference below, then load [module-control.md](./references/module-control.md) and the reference for each module type used by the change. Load [modulation.md](./references/modulation.md) for modulation work, including `set_mod_dest`, whose destination numbering differs from `set_module_param`. Use the documented parameter number, range, and encoding; do not infer them from a parameter name.
4. Edit the external `.txt` script, not the script copy embedded in `.inst`. Reload the script in Gorilla Editor so the change is applied; saving the instrument then copies the loaded script into the instrument file.
5. Run the narrowest available syntax, test, or build check for the changed script.

## Effect and Instrument Development

Load [effect-and-instrument-development.md](./references/effect-and-instrument-development.md) when building effects, configuring MIDI input, generating background audio, running periodic updates, designing feedback routing, or mapping sample-based/oscillator instruments.

- Effects receive host audio in the first bus. Prefer forward routing through separate input, processing, and output buses; scripts control existing topology, they do not create it.
- Treat editor-only sample Groups as test fixtures and remove them before releasing an effect. Keep intentionally shipped audio-generation Groups.
- MIDI-controlled effects require both `isEffect` and `hasMidiInput` to be `true`; the generated effect scaffold disables MIDI input by default. After changing these flags, run `npm run buildAndInstall` to recompile and install the plugin; script/instrument syncing or live preview alone is not sufficient.
- Backward bus routing adds 64 samples of latency. Deliberate feedback requires the fixed-block processing and delay-compensation precautions in the reference.
- Sample-based instruments and oscillator-only synths both need Zone key/velocity mappings. Oscillator-only Zones may use an empty sample path; overlapping Zones can produce multiple voices per note.
- For sample-based instruments built from a pool of recorded audio, first inspect metadata in the audio files and metadata in the file names to infer root notes, keyboard ranges, and velocity layers. If metadata is missing, ambiguous, or conflicting, do not guess: recommend that the user create the initial mapping in Gorilla Editor, whose superior sample analysis can map samples based on detected pitch and loudness.
- Validate audio, metering, restart behavior, and mapping in the editor/host. A successful export alone does not verify them.

---

## Scope

Write `.txt` scripts that expose controls for a topology the user built in Gorilla Editor. A script can control only modules already present in the instrument definition. Always edit the `.txt` file, not the Script section inside `.inst`. For scripting facts, patterns, and module control, see the reference files below.

---

## Script Language Reference

### General Rules

Gorilla Script is not JavaScript. Use the syntax documented here rather than inferring constructs from another language.

- Write one statement per line. Use `...` to continue a statement on the next line; `;` may separate multiple statements on one line when that improves readability.
- Names are case-sensitive. Variable, constant, property, and function names must start with a letter and contain only letters, numbers, and underscores.
- Declare every `var`, `const`, and property in `on init`.
- Numeric values and variables are 32-bit integers. Limited floating-point calculations are available through the conversion functions described below, but floating-point variables and arrays do not exist.
- The documented control-flow forms are `if ... [else if ...] [else ...] end if`, `select ... case ... end select`, and `while ... end while`. The reference does not define `then` or `for` syntax.
- Both `=` and `==` test equality. Prefer `==` in conditions; use `=` for assignments and property defaults.
- `return` immediately exits the current callback or user-defined function and may be used inside a conditional.
- User-defined functions use `function <name> ... end function`, are declared outside callbacks before first use, and are invoked by name. Function names should end with empty parentheses to make it obvious it's a function. The documented syntax has no parameters or return values.
- Properties expose user-editable or display values. The allowed property declarations are `prop_array`, `prop_boolean`, `prop_decibels`, `prop_exp`, `prop_linear`, `prop_meter`, `prop_squared`, `prop_stepped`, `prop_text`, and `prop_waveform`; Any other property declarations such as `prop_int`, `prop_float`, `prop_string `or `prop_voice` are not allowed. See [properties.md](./references/properties.md).
- A property's default value does not invoke its `on <property_name>` callback. When a callback configures module state it can be useful to apply the corresponding initial state explicitly in `on init` too so the module state already matches the parameter setting. When a lot of configuration is needed, put the code in a user-defined function and call it from both the callback and `on init` .
- Use `'` for a comment through the end of a line and `{ ... }` for a block comment.

### Callbacks

Every script is organized into callbacks — blocks of code that run in response to events.

```
on init
	' Runs once when script loads. Declare all variables and properties here.
end on

on note
	' Runs when a MIDI note-on is received. Any resulting voices start playing when callback returns or delay() is called.
	' Read EVENT_KEY and EVENT_VEL  
end on

on release
	' Runs when a MIDI note-off is received.
	' Read EVENT_KEY  
end on

on controller
	' Runs when a MIDI CC value changes. Check EVENT_CC for which controller.
	' Read EVENT_CC and CC[EVENT_CC]  
end on

on poly_at
	' Runs on polyphonic aftertouch. Check POLY_AT_KEY for the key.
end on

on program_change
	' Runs on MIDI program change. Read MIDI_PROGRAM.
end on

on transport
	' Runs when host playback starts/stops.
	' Read SONG_PLAYING
end on

on <property_name>
	' Runs when a declared property changes value.
end on

on new_event
	' Runs when trigger_new_event() fires.
end on

on mapping_changed
	' Runs when a zone, mapping, or sample changes.
end on

on midi_drag
	' Runs when user drags MIDI data from instrument. Fill MIDI_DRAG_DATA.
end on

on chord_changed
	' Runs when host sends chord info.
end on

on section_changed
	' Runs when host sends song section info.
end on

on io_changed
	' Runs when a Rack Extension audio output is connected or disconnected.
end on
```

### Variables

```
on init
	var x                          ' integer variable, default 0
	var name$ = "hello"            ' string variable
	var arr[10]                    ' array of 10 integers (index 0-9)
	var init_arr[4] = (1,2,3,4)   ' array with initial values
	const MAX = 128                ' constant (read-only)
	var shared["My Data File"]     ' array backed by a Data File module
end on
```

- All `var` and `const` must be in `on init`
- Values are 32-bit signed integers
- String variables end with `$` or are initialized with a string

### Functions

```
function MyFunction()
	' code here — inlined at call site, zero performance cost
end function

on note
	if EVENT_KEY < 60
		return
	end if
	MyFunction()
end on
```

- Define outside callbacks, before first use
- The documented declaration has no parameters or return value
- `return` exits the current function or callback immediately
- Always inlined — no call overhead

### Control Flow

```
' If/Else
if x > 10
	' ...
else if x > 5
	' ...
else
	' ...
end if

' Select/Case
select x
	case 0
		' ...
	case 1 to 5
		' ...
	case 10
		' ...
end select

' While loop
x = 0
while x < 100
	inc(x)
end while
```

### Operators

| Operator                 | Description                                              |
| ------------------------ | -------------------------------------------------------- |
| `+`, `-`, `*`, `/`       | Arithmetic (integer division rounds down, div by 0 = 0)  |
| `mod`                    | Modulus (remainder)                                      |
| `<<`, `>>`               | Bit shift left/right                                     |
| `.and.`, `.or.`, `.xor.`, `.not.` | Bitwise AND, OR, XOR, NOT                                     |
| `and`, `or`, `not`       | Logical operators (in conditions)                        |
| `==`, `=`                | Equal (`==` preferred in conditions; both are supported) |
| `!=`, `<>`               | Not equal                                                |
| `<`, `>`, `<=`, `>=`     | Comparison                                               |
| `&`                      | String concatenation                                     |

### Math Functions

| Function                | Description                              |
| ----------------------- | ---------------------------------------- |
| `abs(x)`                | Absolute value                           |
| `inc(x)`                | Increment by 1 (faster than `x = x + 1`) |
| `dec(x)`                | Decrement by 1                           |
| `in_range(x, min, max)` | Returns 1 if min ≤ x ≤ max               |
| `random(min, max)`      | Random integer in [min, max]             |

### Floating-Point (Single-Line Only)

```
x = real_to_int(int_to_real(a) * sin(int_to_real(b) / int_to_real(1000)))
```

Available in float expressions: `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `exp`, `log`, `pow`, `sqrt`, `ceil`, `floor`, `round`.

Use `real_to_int(realValue)` to convert a result back to an integer or `real_to_string(realValue, decimalPlaces)` to convert it to text. No float variables or arrays exist; floats are limited to a single expression.

### String Functions

| Function                        | Description                            |
| ------------------------------- | -------------------------------------- |
| `string_find(str, sub, start)`  | Find substring, returns position or -1 |
| `string_length(str)`            | Character count                        |
| `string_range(str, start, len)` | Extract substring                      |
| `character_code(str, pos)`      | ASCII code at position                 |
| `&`                             | Concatenate strings and numbers        |

### Array Utilities

| Function                                     | Description                                               |
| -------------------------------------------- | --------------------------------------------------------- |
| `array_copy(src, dest)`                      | Copy array contents                                       |
| `array_equal(a, b)`                          | Returns 1 if same length and content                      |
| `array_fill(src[start], dest[start], count)` | Copy/fill range (same array OK). The source can be a single numeric value instead of an array, which is useful for clearing an array                           |
| `array_find(arr, value)`                     | First index of value, or -1                               |
| `array_find_range(arr[start], value, count)` | Find in range                                             |
| `array_find_max(arr[start], count)`          | Maximum in range                                          |
| `array_find_min(arr[start], count)`          | Minimum in range                                          |
| `array_find_difference(a[start], b[start])`  | First differing index, or -1                              |
| `array_length(arr)`                          | Declared size                                             |
| `array_sort(arr, dir)`                       | 0=ascending, 1=descending; -N sorts the first N ascending |
| `array_sum(arr, start, count)`               | Sum a range                                               |
| `load_array(arr, nameOrIndex)`               | Load from Data File module                                |
| `save_array(arr, nameOrIndex)`               | Save to Data File module                                  |
| `load_midi_file(nameOrIndex)`                | Select MIDI File module; returns its index or -1          |

### Comments

```
' Single-line comment (everything after single quote)
{ Block comment
	spanning multiple lines }
```

### Line Continuation

```
var long_array[8] = ( 1, 2, 3, 4, ...
											5, 6, 7, 8 )
```

Use `...` at end of line to continue on next line.

### Conditional Compilation

```
USE_CODE_IF(FEATURE_X)
	' Only compiled if "FEATURE_X" is included in the Script Defines parameter of the Instrument module
END_USE_CODE

USE_CODE_IF_NOT(DEBUG)
	' Only compiled if "DEBUG" is NOT included in the Script Defines parameter of the Instrument module
END_USE_CODE
```

### Printing / Debugging

```
print("value is " & x)       ' Print to status line and debug window
print_active_events()         ' Debug only; do not use in a released product
```

### Optimization Tips

- `inc(x)` / `dec(x)` faster than `x = x + 1`
- `if x` is shorthand for `if x != 0` (faster)
- Combine expressions: `a = 3 * x + 1` instead of two statements
- Constant expressions like `10 * MAX_VEL` are precomputed at compile time
- Functions are always inlined — no overhead
- Check most likely `case` values first

---

## Reference Files

**Load before writing code — not after something breaks.** If you have not verified a parameter's encoding in this session, look it up **first**.

| Topic              | File                                                                                | When to load                                                                                                                                                                                                    |
| ------------------ | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Core modules       | [module-reference-core.md](./references/module-reference-core.md)                   | Instrument, Script, Group, Zone, trigger Conditions                                                                                                                                                             |
| Modulation modules | [module-reference-modulation.md](./references/module-reference-modulation.md)       | ADSR Env, Custom Env, LFO, Step Seq, Mod Routing parameters                                                                                                                                                     |
| Voice effects      | [module-reference-voice-effects.md](./references/module-reference-voice-effects.md) | **Load before scripting any oscillator or filter** — per-voice filters, oscillators, and voice-level FX parameters; contains known footguns (e.g. Sine Oscillator Tune is absolute frequency, not a semitone offset) |
| Bus effects        | [module-reference-bus-effects.md](./references/module-reference-bus-effects.md)     | Effect Bus, Effect Mod, and all bus-level effect parameters                                                                                                                                                     |
| Misc modules       | [module-reference-misc.md](./references/module-reference-misc.md)                   | Voice Group, Alternate Mapping, Wavetable, MIDI File, Data File parameters                                                                                                                                      |
| Properties         | [properties.md](./references/properties.md)                                         | Declaring UI-bound parameters (prop_linear, prop_exp, prop_boolean, etc.)                                                                                                                                       |
| Note Events        | [note-events.md](./references/note-events.md)                                       | MIDI note handling, new_note, set_tune, set_vol, fade_in/out, groups, set_controller CC bridge                                                                                                                  |
| Module Control     | [module-control.md](./references/module-control.md)                                 | `set_module_param`, parameter addressing, ranges, and module-specific encoding                                                                                                                                  |
| Modulation         | [modulation.md](./references/modulation.md)                                         | Mod sources, mod routing, mod matrix, set_mod_dest, ADSR/LFO/StepSeq                                                                                                                                            |
| Effects & Filters  | [effects-filters.md](./references/effects-filters.md)                               | Voice effects, bus effects, filter types, oscillators, effect bus routing                                                                                                                                       |
| Effect & Instrument Development | [effect-and-instrument-development.md](./references/effect-and-instrument-development.md) | Host audio input, gain/meters, MIDI-controlled effects, background notes/timers, feedback latency, sample and oscillator Zone mappings |
| Time & Tempo       | [time-tempo.md](./references/time-tempo.md)                                         | delay, delay_ppq, tempo sync, song position, transport                                                                                                                                                          |
| Script Patterns    | [script-patterns.md](./references/script-patterns.md)                               | Arpeggiators, mono/legato/glide, round robins, crossfades, step sequencers, velocity curves, sliced loops                                                                                                       |
| Instrument Files   | [instrument-files.md](./references/instrument-files.md)                             | Format, handling, basic audio routing                                                                                                                                                                           |
| Index Derivation   | [indexing.md](./references/indexing.md)                                             | Deriving any M_XXX index from the .inst file; 0 vs 1 base rules; per-group scope of M_FILTER/M_MOD_SRC/M_MOD                                                                                                    |
| Quick Start        | [key-rules.md](./references/key-rules.md)                                           | Minimal script and instrument examples                                                                                                                                                                          |
