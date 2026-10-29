import path = require('path');
import os = require('os');

import * as React from 'react';
import { ActivationController, ActivationState } from '@moonbase.sh/licensing';

// Every instance of the plugin, in any number of hosts, shares the license in the
// manufacturer's folder for user data, so activating one unlocks the others
const userData =
  process.platform === 'win32'
    ? (process.env.APPDATA ?? path.join(os.homedir(), 'AppData', 'Roaming'))
    : path.join(os.homedir(), 'Library', 'Application Support');

// The SDK's activation state machine: it validates the stored license, runs
// browser and offline activation, and keeps watching the license while the plugin runs
const licensing = new ActivationController({
  productId: 'demo-app',
  endpoint: 'https://demo.moonbase.sh',
  publicKey: `-----BEGIN RSA PUBLIC KEY-----
MIIBCgKCAQEAutOqeUiPMgYjAwQ53CyKhJSqojr2bejce0CshQi9Hd8mNZbkoROx
oS56eIzehFSlX4YwHnF47AR1+fPOe7Q33Cgzd6d9xqksiMH7sWK2mADIlB66vZdW
uk3Me0UMB22Biy1RQbSRMivu79MxCofsympoL/5CFjJLd1u37kxjuRWVLjJS84Rr
3L2W7R7Exnno/giC+L/Dv711mjgstmtlAQm5ZINvFvoLA1eFTDs6nlCs3dpJSiq3
fsBUMT9FtudzS5As54jeT/8MB66fJJ0A1LQ/v5CW8ACQYseFSIoOKErD3xU7QLIJ
ERUn++6CVMPvZo67jVbTY+GCXYfW4gGVZQIDAQAB
-----END RSA PUBLIC KEY-----`,

  // Reported with every activation and validation, and checked against the
  // versions a license covers. Gorilla Engine has no version of its own to read,
  // so keep this in step with pluginConfig.version in the .ugep file.
  appVersion: '1.0.0',

  licenseFile: path.join(
    userData,
    GorillaEngine.getManufacturerName(),
    GorillaEngine.getPluginName(),
    'license.mb',
  ),

  // Activation is finished in the customer's browser
  openUrl: (url) => GorillaEngine.openURLinBrowser(url),

  // Named in the error messages the controller words for the customer
  productName: GorillaEngine.getPluginName(),
});

// The .ugep keeps MIDI and audio off at startup. Turn them on while the plugin
// has a license or a trial, and off again whenever it loses it.
let enabled: boolean | null = null;
licensing.subscribe((state) => {
  if (state.status === 'loading' || state.licensed === enabled) return;
  enabled = state.licensed;
  GorillaEngine.getPluginMM(enabled);
  GorillaEngine.getPluginAE(enabled);
});

// Create the controller once, at the top level of the script: it lives as long
// as the plugin instance does
licensing.start();

// The license state, kept current: once the plugin is activated, and when the
// license is refreshed, expires or is deactivated
export function useLicensing(): ActivationState {
  const [state, setState] = React.useState(() => licensing.state());
  React.useEffect(() => {
    setState(licensing.state());
    return licensing.subscribe(setState);
  }, []);
  return state;
}

export default licensing;
