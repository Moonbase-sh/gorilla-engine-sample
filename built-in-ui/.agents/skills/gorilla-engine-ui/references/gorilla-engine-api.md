# GorillaEngine Native API

The global `GorillaEngine` namespace is available at runtime inside the plugin's JavaScript environment. It provides access to the audio engine, instruments, blobs, UI utilities, and platform services.

## Global Functions

### Resource & Plugin Info

```ts
GorillaEngine.getResourcePath(): string
// Returns the platform-specific path where assets, blobs, etc. are installed.

GorillaEngine.getPluginName(): string
GorillaEngine.getPluginType(): string
GorillaEngine.getPluginPath(): string
GorillaEngine.getManufacturerName(): string
GorillaEngine.getHostDescription(): string   // Name of the host DAW
GorillaEngine.getBuildInformation(): any
```

### Instrument Management

```ts
// Load a blob file and then get an instrument from it:
// encryptionKey is optional — only needed for encrypted blobs (32-char hex string)
const blob = GorillaEngine.loadBlob(blobPath: string, encryptionKey?: string): Blob;  // throws on failure
blob.getInstrumentNames(): string[];  // list all instruments in the blob
const instrument = blob.loadInstrument(name: string): Instrument;

// Usage Example:
const blob = GorillaEngine.loadBlob('PATH_TO_BLOB');
const instrument = GorillaEngine.loadInstrument(blob.getInstrumentNames()[0]);

// Other ways to obtain an instrument:
GorillaEngine.createEmptyInstrument(): Instrument;
GorillaEngine.LoadInstrumentFromFile(instFilePath: string): Instrument;  // loads .inst file

// Activate (route MIDI+audio) — only one instrument active at a time:
GorillaEngine.setActiveInstrument(instrument): void;
GorillaEngine.disposeInstrument(instrument): void;
```

### Preset

```ts
// Session save/load callbacks (return serialised state string):
GorillaEngine.setSessionSaveCallback((state: string) => string, instance): void;
GorillaEngine.setSessionLoadCallback((state: string) => string, instance): void;
GorillaEngine.sessionSaveLoadCallbackTimeoutMs: number;  // writable, default timeout
```

Session Dirty State

```ts
GorillaEngine.setParametersDirty(dirty: boolean): void;
GorillaEngine.areParametersDirty(): boolean;
GorillaEngine.setParametersDirtyCallback(callback: any): void;

// Usage example
const [isPresetDirty, setIsPresetDirty] = React.useState((GorillaEngine.areParametersDirty());
React.useEffect(() => {
  GorillaEngine.setParametersDirtyCallback(setIsPresetDirty);

  return () => {
    GorillaEngine.setParametersDirtyCallback(() => {});
  };
}, []);
```

### Startup / Ready Signalling

```ts
// Call before async init; then call signalReady() when done.
// Not calling signalReady() after shouldWaitForReadySignal() causes DAW hangs.
GorillaEngine.shouldWaitForReadySignal(): void;
GorillaEngine.signalReady(): void;
```

### Licensing (Codemeter)

```ts
GorillaEngine.checkLicense(): boolean;       // true if valid license or codemeter not enabled
GorillaEngine.isTrial(): boolean;            // true if running as trial
GorillaEngine.trialExpirationTimestamp(): number;  // 0 if no trial
```

### Error Handling

```ts
GorillaEngine.registerUncaughtUIExceptionCallback((err: Error) => void): void;
```

### UI / Window Utilities

```ts
GorillaEngine.quitApplication(): void;
GorillaEngine.openURLinBrowser(path: string): void;
GorillaEngine.updateHostDisplay(): void;  // Refreshes automatable parameter list in DAW (not all DAWs)
GorillaEngine.calculateTextWidth(text: string, font: string, fontSize: number, fontKerning: number): Promise<number>;

GorillaEngine.showNativeMessageBoxSync(options: MessageBoxOptions): void;
GorillaEngine.showNativeMessageBox(options: MessageBoxOptions): Promise<void>;
// MessageBoxOptions: { title: string; message: string; iconType: "info"|"question"|"warning"|"error" }

GorillaEngine.registerEditorCallbacks(openCallback?: any, closeCallback?: any): void;
```

### File I/O

```ts
GorillaEngine.openFileChooser({
  allowMultiple?: boolean;
  browseDirectory?: boolean;
  saveDialog?: boolean;
  warnOnOverwrite?: boolean;
  hint?: string;
  allowedExtensions?: string;  // e.g. "wav;aiff"
  defaultLocation?: string;
}): Promise<string[]>;

GorillaEngine.convertMp3ToWav(mp3Filepath: string, wavFilePath: string): Promise<boolean>;
```

### Preview Player

```ts
const player = GorillaEngine.getPreviewPlayer(): PreviewPlayer;
player.on(eventName: string, callback: any): void;
```

---

## `GorillaEngine.UI` Namespace

```ts
// Load a YAML layout file (used by loadUI() helper in gorilla-engine-react):
GorillaEngine.UI.loadUIfromYAML(ymlPath: string): void;

// Auto-generate a generic UI from the active blob (useful for prototyping):
GorillaEngine.UI.autoGenerate(): void;

// Get a component by its id from the loaded YAML:
GorillaEngine.UI.getControlById(id: string): Component;  // throws if not found

// Create the native window from a Window control:
GorillaEngine.UI.createWindow(window: Window): void;
```
