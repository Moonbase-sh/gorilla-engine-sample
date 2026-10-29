import { createMoonbase } from '@moonbase.sh/gorilla-engine';

// The license is kept in the manufacturer's folder for user data, where every
// instance of the plugin shares it, so neither needs setting here
const moonbase = createMoonbase({
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

  // Gorilla Engine has no version of its own to read, so keep this in step
  // with pluginConfig.version in the .ugep file
  appVersion: '1.0.0',

  // The built-in activation overlay, which comes up whenever the plugin has no license
  ui: {
    // Draw the overlay with the plugin's own fonts, rather than the system's
    fonts: {
      regular: 'fonts/Roboto-Regular.otf',
      medium: 'fonts/Roboto-Medium.otf',
      semibold: 'fonts/Roboto-Bold.otf',
    },
  },
});

// Validate the stored license and keep watching it. MIDI and audio stay off
// until the plugin has a license or a trial, and go off again if it loses it.
moonbase.start();

export default moonbase;
