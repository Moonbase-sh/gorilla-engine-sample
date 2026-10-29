import path = require('path');
import os = require('os');
import fs = require('fs/promises');

import * as React from 'react';
import { ActivationState } from '@moonbase.sh/licensing';
import licensing, { useLicensing } from '../../licensing';

const FONT_M = 'fonts/Roboto-Medium.otf';
const FONT_B = 'fonts/Roboto-Bold.otf';
const FONT_R = 'fonts/Roboto-Regular.otf';

const PANEL_WIDTH = 420;

const BUTTON = {
  height: 32,
  textColor: 'E1E6F5',
  font: FONT_M,
  fontSize: 14,
  cornerRadius: 4,
};

// What the panel says for each state the plugin can be locked in
function describe(state: ActivationState, tokenSaved: boolean): [title: string, message: string] {
  const plugin = GorillaEngine.getPluginName();
  if (state.status === 'loading') {
    return ['Checking your license', 'This only takes a moment.'];
  }
  if (state.status === 'activating') {
    return [
      'Finish in your browser',
      `Activate in the browser window that opened. ${plugin} unlocks by itself once you are done.`,
    ];
  }
  if (tokenSaved) {
    return [
      `Activate ${plugin} offline`,
      'Upload the device token at demo.moonbase.sh/activate, then select the license file you get back.',
    ];
  }
  if (state.status === 'trialExpired') {
    return ['Your trial has ended', `Buy a license to keep using ${plugin}, then activate it.`];
  }
  if (state.status === 'notCovered') {
    return [
      'Your license does not cover this version',
      `Upgrade your license to use version ${state.notCovered?.appVersion} of ${plugin}, then check it again.`,
    ];
  }

  // Why the plugin lost its license, when it had one
  switch (state.lockReason) {
    case 'deactivated':
      return [`Activate ${plugin}`, 'This computer was deactivated. Activate it again to keep using it.'];
    case 'expired':
      return ['Your license has expired', 'Renew your license, then activate it again.'];
    case 'invalid':
      return ['Your license is no longer valid', 'Moonbase no longer accepts it on this computer.'];
    case 'unverified':
      return ['Your license needs a check', 'Connect to the internet and activate again.'];
  }
  return [`Activate ${plugin}`, 'Activate in your browser, where you can also start a free trial.'];
}

type Props = {
  width: number;
  height: number;
};

// Covers the plugin, and takes every click, while it has no license
export function LicenseActivation({ width, height }: Props) {
  const state = useLicensing();
  const [tokenSaved, setTokenSaved] = React.useState(false);
  const [problem, setProblem] = React.useState<string | null>(null);

  if (state.licensed) return null;

  const run = (action: () => Promise<unknown>) => () => {
    licensing.dismissError();
    setProblem(null);
    action().catch((err: Error) => {
      // The controller words its own failures for the customer in state.error,
      // anything else, such as a file that could not be saved, is shown as it is
      if (!licensing.state().error) setProblem(err.message);
    });
  };

  // Offline activation, for a computer with no internet: save a device token, which
  // the customer exchanges for a license file in the customer portal
  const saveDeviceToken = async () => {
    const token = await licensing.deviceToken();
    const [file] = await GorillaEngine.openFileChooser({
      saveDialog: true,
      warnOnOverwrite: true,
      hint: 'Save device token',
      allowedExtensions: '*.dt',
      defaultLocation: path.join(os.homedir(), 'Downloads', 'device.dt'),
    });
    if (!file) return;
    await fs.writeFile(file, token);
    setTokenSaved(true);
  };

  // Then select the license file they got back
  const selectLicenseFile = async () => {
    const [file] = await GorillaEngine.openFileChooser({
      hint: 'Select your license file',
      allowedExtensions: '*.mb',
    });
    if (!file) return;
    await licensing.activateOffline(await fs.readFile(file, 'utf8'));
  };

  const [title, message] = describe(state, tokenSaved);
  const error = problem ?? state.error?.message;
  const browserUrl = state.activation?.browserUrl;
  const canActivate = state.status !== 'loading' && state.status !== 'activating';
  const notCovered = state.status === 'notCovered';
  const panelHeight = error ? 300 : 232;

  return (
    <geLabel
      x={0}
      y={0}
      width={width}
      height={height}
      backgroundColor="CC17191F"
      alwaysOnTop={true}
      interceptsMouseClicks={true}
    >
      <geLabel
        x={(width - PANEL_WIDTH) / 2}
        y={(height - panelHeight) / 2}
        width={PANEL_WIDTH}
        height={panelHeight}
        backgroundColor="2F333F"
        cornerRadius={6}
        border={{ width: 1, color: '3F4354' }}
      >
        <geLabel
          x={24}
          y={24}
          width={372}
          height={28}
          text={title}
          textColor="E1E6F5"
          font={FONT_B}
          fontSize={20}
          textAlign="centered left"
        />
        <geLabel
          x={24}
          y={60}
          width={372}
          height={56}
          text={message}
          textColor="B4BCCF"
          font={FONT_R}
          fontSize={14}
          textAlign="top left"
          multiLine={true}
        />

        {state.status === 'activating' && (
          <>
            {browserUrl && (
              <geButton
                {...BUTTON}
                x={24}
                y={132}
                width={372}
                text="Open the browser again"
                backgroundColor="5177E0"
                onClick={() => GorillaEngine.openURLinBrowser(browserUrl)}
              />
            )}
            <geButton
              {...BUTTON}
              x={24}
              y={176}
              width={372}
              text="Cancel"
              backgroundColor="21242E"
              onClick={() => licensing.cancelActivation()}
            />
          </>
        )}
        {canActivate && (
          <>
            {/* Moonbase starts trials in the same browser flow as purchases */}
            <geButton
              {...BUTTON}
              x={24}
              y={132}
              width={372}
              text={notCovered ? 'Upgrade' : 'Activate'}
              backgroundColor="5177E0"
              onClick={run(() => (notCovered ? licensing.upgradeLicense() : licensing.activate()))}
            />
            {notCovered ? (
              // The upgrade page doesn't unlock the plugin by itself: once the
              // customer has bought the upgrade, checking the license again does
              <geButton
                {...BUTTON}
                x={24}
                y={176}
                width={182}
                text={state.refreshing ? 'Checking…' : 'Check again'}
                backgroundColor="21242E"
                onClick={run(() => licensing.refresh())}
              />
            ) : (
              <geButton
                {...BUTTON}
                x={24}
                y={176}
                width={182}
                text="Activate offline"
                backgroundColor="21242E"
                onClick={run(saveDeviceToken)}
              />
            )}
            <geButton
              {...BUTTON}
              x={214}
              y={176}
              width={182}
              text="Select license"
              backgroundColor="21242E"
              onClick={run(selectLicenseFile)}
            />
          </>
        )}

        {error && (
          <geLabel
            x={24}
            y={224}
            width={372}
            height={52}
            text={error}
            textColor="E85D5D"
            font={FONT_M}
            fontSize={13}
            textAlign="top left"
            multiLine={true}
          />
        )}
      </geLabel>
    </geLabel>
  );
}
