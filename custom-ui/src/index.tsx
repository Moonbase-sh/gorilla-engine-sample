import path = require('path');
import os = require('os');

import * as React from 'react';
import * as GEReact from '@gorilla-engine-sdk/gorilla-engine-react';
import { Root } from './app/Root';
import { ErrorBoundary } from './app/components/ErrorBoundary';
import {
  SessionAndPresetsConfig,
  SessionAndPresetsDispatchTypes,
  SessionAndPresetsState,
  SessionAndPresetsStateProvider,
  SessionAndPresetsWrapper,
  defaultSessionAndPresetsConfig,
  defaultSessionAndPresetsState,
  useSessionAndPresetsStateDispatch,
} from '@gorilla-engine-sdk/ge-session-presets-lib';
import {
  Dialogs,
  DialogsStylesState,
  dialogsDefaultStyle,
} from '@gorilla-engine-sdk/ge-dialogs-lib';
import {
  PresetBrowser,
  PresetBrowserConfig,
  PresetBrowserStyle,
  defaultPresetBrowserConfig,
  defaultPresetBrowserStyle,
} from '@gorilla-engine-sdk/ge-preset-browser';

import { DefaultModalProps, DefaultModal, useModal } from '@gorilla-engine-sdk/ge-dialogs-lib';

import { BlobManager, loadBlob } from '@gorilla-engine-sdk/ge-blob-manager';
import { presetBrowserCustomStyle, presetBrowserSaveModalStyle } from './presetBrowserCustomStyle';
import { dialogsCustomStyle } from './dialogsCustomStyle';
import { LicenseActivation } from './app/components/LicenseActivation';

const PLUGIN_WIDTH: number = 920;
const PLUGIN_HEIGHT: number = 590;

const MANUFACTURER: string = GorillaEngine.getManufacturerName();
const PLUGINNAME = GorillaEngine.getPluginName();

/**
 * Factory Preset location
 */
const FACTORY_PRESET_LOCATION: string = path.resolve(
  GorillaEngine.getResourcePath(),
  'presets',
  'Factory',
);

const USER_CONTENT_PATH: string = path.resolve(os.homedir(), 'Documents', MANUFACTURER, PLUGINNAME);
const USER_PRESET_LOCATION: string = path.resolve(USER_CONTENT_PATH, 'Presets');

const dialogsStyle: DialogsStylesState = {
  ...dialogsCustomStyle,
  pluginWidth: PLUGIN_WIDTH,
  pluginHeight: PLUGIN_HEIGHT,
};

/**
 *
 * Session Save/Restore & Presets config & content-state
 *
 */
const sessionAndPresetsConfiguration: SessionAndPresetsConfig = {
  ...defaultSessionAndPresetsConfig,

  presetFileSuffix: '.preset',
  // Location of factory presets
  factoryPresetPath: FACTORY_PRESET_LOCATION,
  // Location of user presets
  userPresetPath: USER_PRESET_LOCATION,

  // Factory library display name
  factoryPresetType: 'Factory',
  // User library display name
  userPresetType: 'User',

  handleErrors: true,
};

const initialSessionAndPresetsState: SessionAndPresetsState = {
  ...defaultSessionAndPresetsState,
  instrument: undefined,
  initialPresetPath: path.join(FACTORY_PRESET_LOCATION, 'Category 1', 'Init.preset'),
};

/**
 * Preset Browser Config
 */
const presetBrowserConfig: PresetBrowserConfig = {
  ...defaultPresetBrowserConfig,
  enforceCategories: true,
};

function Main() {
  const sessionAndPresetStateDispath = useSessionAndPresetsStateDispatch();

  const [instrument, setInstrument] = React.useState<GorillaEngine.Runtime.Instrument | undefined>(
    undefined,
  );
  const [instrumentLoaded, setInstrumentLoaded] = React.useState(false);
  const [instrumentName, setInstrumentName] = React.useState('');
  let showRelocateTrigger = false;
  // Logic has a different flow since it does not allow a popup if the UI is not visible
  if (GorillaEngine.getHostDescription() == 'Apple Logic') {
    showRelocateTrigger = true;
  }

  // setup Modal
  const defaultModalProps = {
    width: 400,
    height: 200,

    title: 'An Error Occured!',
    message: 'Error message',

    cancelTrigger: showRelocateTrigger,
    cancelTriggerLabel: 'Locate',
    onCancelTrigger: onLocate,
    approveTrigger: false,
    closeTrigger: false,
  };
  const [modalProps, setModalProps] = React.useState<DefaultModalProps>({
    ...defaultModalProps,
  });

  const modalPropsRef = React.useRef(modalProps);
  modalPropsRef.current = modalProps;

  const [showModal, hideModal] = useModal(
    () => <DefaultModal {...modalPropsRef.current} />,
    [true, false],
  );

  async function onLocate() {
    hideModal();
    loadBlob({
      pluginName: GorillaEngine.getPluginName(),
      blobName: PLUGINNAME,
      defaultBlobPath: path.join(GorillaEngine.getResourcePath(), 'assets', 'instruments'),
      manufacturerName: GorillaEngine.getManufacturerName(),
      onErrorLoadingInstrument: onErrorLoadingInstrument,
      onInstrumentLoaded: onInstrumentLoaded,
    });
  }

  // Callback when the BlobManager finds the blob and loads the instrument successfully
  const onInstrumentLoaded = (instrument: GorillaEngine.Instrument, instrumentName: string) => {
    const runtimeInstrument = instrument as GorillaEngine.Runtime.Instrument;
    setInstrument(runtimeInstrument);
    setInstrumentName(instrumentName);
    setInstrumentLoaded(true);

    // MIDI and audio processing are turned on in licensing.ts, once the
    // plugin has a license or a trial

    sessionAndPresetStateDispath({
      type: SessionAndPresetsDispatchTypes.setInstrument,
      payload: {
        instrument: instrument,
      },
    });
  };

  // Callback when the BlobManager cannot locate the blob
  const onErrorLoadingInstrument = (errorMessage: string) => {
    setModalProps({
      ...defaultModalProps,
      title: 'Error Loading Blob',
      message: errorMessage,
    });
    showModal();
  };

  return (
    <>
      <BlobManager
        pluginName={GorillaEngine.getPluginName()}
        blobName={PLUGINNAME}
        defaultBlobPath={path.join(GorillaEngine.getResourcePath(), 'assets', 'instruments')}
        manufacturerName={GorillaEngine.getManufacturerName()}
        onErrorLoadingInstrument={onErrorLoadingInstrument}
        onInstrumentLoaded={onInstrumentLoaded}
      />
      {instrumentLoaded && <Root instrument={instrument} instrumentName={instrumentName} />}
    </>
  );
}

GEReact.createUI(
  <React.StrictMode>
    <ErrorBoundary>
      <SessionAndPresetsStateProvider
        config={sessionAndPresetsConfiguration}
        state={initialSessionAndPresetsState}
      >
        <Dialogs styleState={dialogsStyle}>
          <SessionAndPresetsWrapper>
            <Main />
            <PresetBrowser
              config={presetBrowserConfig}
              browserStyle={presetBrowserCustomStyle}
              saveModalStyle={presetBrowserSaveModalStyle}
            />
          </SessionAndPresetsWrapper>
        </Dialogs>
      </SessionAndPresetsStateProvider>
    </ErrorBoundary>
    {/* Rendered last, so the activation panel lies over the rest of the plugin */}
    <LicenseActivation width={PLUGIN_WIDTH} height={PLUGIN_HEIGHT} />
  </React.StrictMode>,
  PLUGIN_WIDTH,
  PLUGIN_HEIGHT,
);
