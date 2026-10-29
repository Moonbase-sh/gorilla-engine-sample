---
name: gorilla-engine-ui
description: 'Write UI using the Gorilla Engine React implementation. Use when: building plugin UIs, creating GE components, using geKnob/geSlider/geButton/geToggle/geLabel/geComboBox, binding instrument properties, discovering concrete instrument parameters from .inst files, loadUI/createUI, useInstrument/useInstrumentProperty hooks, locating installed SDK docs on macOS or Windows, managing npm start standalone watchers, Gorilla React for native audio plugins.'
---

# Gorilla Engine React UI

Build native audio plugin UIs using a custom React reconciler that bridges React components to Gorilla Engine's C++ UI framework.

**Environment Constraints:**

- There is **NO browser DOM**. Do NOT use `div`, `span`, `input`, `html`, etc.
- There is **NO React Native**. Do NOT use `View`, `Text`, `TouchableOpacity`, etc.
- You may ONLY use the primitive components defined in this skill and component libraries that build on top of them.

## SDK Lookup and Process Lifecycle

- Check the installed SDK first: macOS defaults to `/Applications/Gorilla Engine SDK`; Windows defaults to `C:\Program Files\Gorilla Engine SDK` (normally `%ProgramFiles%\Gorilla Engine SDK` in cmd.exe or `Join-Path $env:ProgramFiles 'Gorilla Engine SDK'` in PowerShell). Quote paths containing spaces. If absent, ask for the custom installation location rather than broadly scanning unrelated resources.
- Search the installed SDK's `Documentation` directory first for SDK facts. Module parameters are in `<SDK_ROOT>/Documentation/development-workflow/gorilla-editor/modules/index.html` (use backslashes on Windows); load the DSP skill for module changes. Honor SDK-only research requests and extract narrow HTML sections instead of dumping minified lines. Do not substitute npm packages or unrelated application resources for the module reference.
- Read `package.json` before running commands. Both `npm start` and `npm run deploy` are persistent watchers, not one-shot builds. `npm start` using `--standalone` also launches a native app. Reuse an existing project watcher for either command; repeated launches can create duplicate watchers/apps and misleading audio observations on either OS.
- Prefer one-shot `npm run build:ui` for UI changes, `npm run sync:instruments` for DSP changes, or `npm run prepare:artifacts` for both, when available. Do not use packaging builds as routine validation.
- Keep one live preview running for the active project during iterative development so users can see changes as they happen. Read `package.json` to identify the preview command; in these projects it is normally `npm start`, which owns the watchers and launches the native app.
- **Transport-dependent plugins:** For plugins that require DAW transport, such as the SDK Drum Sequencer example, use `npm run deploy` and test inside a DAW with transport running instead of using `npm start`. The latter launches the standalone application, which does not provide DAW transport. After deployment, remove and re-add the plugin instance to load changes.
- Before launching a preview, check whether this project's preview watcher is already running. Identify it by the project directory and command, not merely by a Node process or an open app; an open native app does not prove its watcher is running. Reuse the existing watcher without claiming ownership of a user-started process. Recheck immediately before launching to avoid duplicate instances.
- If no watcher is running and the environment supports persistent background processes, start one using the environment's normal approval flow. Explain this as "Starting the live preview so you can see changes as we work." Do not routinely ask the user to choose who runs a shell command. Respect an explicit preference that the user manages the preview.
- If the environment cannot launch or retain the preview, explain that limitation in plain language and provide the simplest available launch steps. If process detection is inconclusive, ask whether the live preview is already running before starting another instance.
- If the agent cannot run commands or access terminal output but can read project files, check `package.json` for the logging commands and ask the user to run `npm run start:log` for standalone preview or `npm run deploy:log` for DAW deployment. They work on macOS and Windows and write `standalone.log` or `deploy.log` in the project root while displaying terminal output. Read the latest lines with file-reading tools, or tail the file if shell access is available; the user must keep the command running and handle permission prompts in their terminal. Do not start a second watcher. Logs are overwritten each run, so check for fresh output rather than treating an old log as proof the watcher is running. `deploy.log` captures deployment-tool output, not necessarily plugin debug output inside the DAW. The helper in `dev/scripts/log.cjs` is development-only and must not be added to Gorilla Compiler packaging assets.
- Track the project directory, command, terminal or execution handle, PID, and child processes for previews you start. Leave the preview running between edits and at the end of a turn while development continues. Do not restart it after each edit or stop it merely because a response is complete.
- Stop or restart a preview only when requested, when necessary to recover a failed preview, or when the environment requires cleanup. Stop only processes whose ownership is established; ask if ownership is unclear. Never terminate user-started processes without permission or kill all Node/native app processes by name. On macOS inspect command lines and parent PIDs with `ps`. On Windows use `Get-CimInstance Win32_Process` to inspect `ProcessId`, `ParentProcessId`, and `CommandLine`. Prefer stopping the owned terminal gracefully; when process-tree termination is needed on Windows, use `taskkill /PID <owned-pid> /T`. Verify that targeted processes and surviving children exited when stopping a preview.
- Build success does not establish correct native layout or audible behavior. Report runtime checks separately; a browser preview does not validate this native UI.

## Architecture

- **Custom React Reconciler** — maps React lifecycle to native GE components
- **JSX intrinsic elements** — lowercase tags: `<geKnob />`, `<geSlider />`, `<geLabel />`
- **27 native components** wrapped as React elements
- **Declarative bindings** — bind UI to instrument parameters via `bindings` prop
- **Standard React** — hooks, state, conditionals, fragments all work normally

## Quick Start

```tsx
import { createUI, useInstrument, useInstrumentProperty } from '@gorilla-engine-sdk/gorilla-engine-react';

function App() {
  const [instrument] = useInstrument();
  if (!instrument) return null;
  return <PluginUI instrument={instrument} />;
}

function PluginUI({ instrument }) {
  const [volume, setVolume] = useInstrumentProperty(instrument, 'volume');
  return (
    <geLabel x={0} y={0} width={400} height={300} backgroundColor="FF222222">
      <geKnob
        x={50}
        y={50}
        width={80}
        height={80}
        min={0}
        max={100}
        value={volume.value}
        onChange={(v) => setVolume(v)}
        filmstrip={{ path: 'knob.png', count: 128 }}
      />
      <geLabel x={50} y={140} width={80} height={20} text={volume.text} textColor="FFFFFF" />
    </geLabel>
  );
}

createUI(<App />, 400, 300);
```

## Concrete Instrument Parameters

When you need the actual parameter names for a specific instrument, do not guess them from the script or UI code. Query the compiled instrument directly:

```bash
blob-export --parameter-info <INST_FILE>
```

This returns JSON describing the parameters exposed by that `.inst` file. Use that output as the source of truth for control bindings, `useInstrumentProperty(...)`, and any parameter-specific UI generation.

Preferred `blob-export` locations:

- macOS: `/Applications/Gorilla Engine SDK/Tools/blob-export`
- Windows: `%SystemDrive%\\Program Files\\Gorilla Engine SDK\\Tools\\blob-export.exe`
- Fallback: `blob-export` from `PATH`

When binding by name, remember that instrument parameter identifiers in bindings are lowercase even if the instrument script declared them with uppercase letters.

## Reference Files

Load these as needed for detailed information:

| Topic             | File                                                            | When to load                                                                     |
| ----------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Getting Started   | [getting-started.md](./references/getting-started.md)           | Entry points, hooks, app structure                                               |
| Base Props        | [base-props.md](./references/base-props.md)                     | Common, Bounds, Background, Font, Clickable interfaces                           |
| Event Handlers    | [event-handlers.md](./references/event-handlers.md)             | onClick, onChange, onMouseDrag, etc.                                             |
| Bindings          | [bindings.md](./references/bindings.md)                         | Data binding syntax and view model integration                                   |
| Basic Controls    | [basic-controls.md](./references/basic-controls.md)             | geLabel, geButton, geKnob, geSlider, geToggle, geTextBox                         |
| Advanced Controls | [advanced-controls.md](./references/advanced-controls.md)       | geComboBox, geXYPad, geMidiKeyboard, gePad                                       |
| Visualization     | [visualization.md](./references/visualization.md)               | geLevelMeter, geWaveform, geCurve, geAmpEnv, geLottieAnimation                   |
| Editors           | [editors.md](./references/editors.md)                           | geSliceEditor, geListBox, geStepEditor, geBarStepEditor, geMappingEditor         |
| Containers        | [containers.md](./references/containers.md)                     | geScrollView, geDragContainer, geDragTarget, geDropZone, geRubberband            |
| Tags & Composite  | [composite-components.md](./references/composite-components.md) | geTagBrowser, geTagEditor, RadioGroup, LabeledKnob, LabeledSlider, LabeledToggle |
| GorillaEngine API | [gorilla-engine-api.md](./references/gorilla-engine-api.md)     | GorillaEngine global namespace, UI utilities, File I/O, Preset, Licensing        |
| Instrument API    | [instrument-api.md](./references/instrument-api.md)             | Blob, Instrument, InstrumentProperty, MIDI, path accessors, dynamic params       |

## Key Rules

1. **All components use `Partial<Props>`** — every prop is optional
2. **JSX tag names are lowercase** — `geKnob`, not `GEKnob`
3. **Position is absolute** — use `x`, `y`, `width`, `height` (no CSS layout). Children are clipped to parent bounds.
4. **Colors are hex strings** — `"FF0000"` for red, prefix with alpha `"80FF0000"` for 50% opacity
5. **Assets are file paths** — relative to the plugin's resource path
6. **`geLabel` doubles as a container** — it has Background, so use it for panels/groups
7. **`createUI()`** for pure React entry, **`loadUI()`** when using a YAML layout
8. **Bindings** connect props to instrument parameters: `bindings={{ value: instrument.volume }}` (object preferred) or `bindings={{ value: 'instrument.volume' }}` (string). Be aware that the instrument parameters are always lowercase in both cases, even if defined in uppercase in the instrument script.
