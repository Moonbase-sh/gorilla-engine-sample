import * as React from 'react';
import { useMoonbaseState } from '@moonbase.sh/gorilla-engine';
import moonbase from '../../licensing';

const FONT_M = 'fonts/Roboto-Medium.otf';
const FONT_R = 'fonts/Roboto-Regular.otf';

export function LicenseStatus() {
  // The license state, kept current: once the plugin is activated, and when the
  // license is refreshed or deactivated
  const { license } = useMoonbaseState(moonbase);

  let text = 'Not activated';
  if (license?.trial) {
    text = `Trial for ${license.issuedTo.name}, ${license.daysRemaining} days left`;
  } else if (license) {
    text = `Licensed to ${license.issuedTo.name}`;
  }

  return (
    <>
      <geLabel
        x={450}
        y={4}
        width={310}
        height={20}
        text={text}
        textColor="8A93A8"
        font={FONT_R}
        fontSize={12}
        textAlign="centered right"
      />
      {/* The built-in license details, where the customer can copy their license
          ID for support, or deactivate this computer */}
      <geButton
        x={770}
        y={4}
        width={110}
        height={20}
        text="Manage license"
        backgroundColor="21242E"
        textColor="E1E6F5"
        font={FONT_M}
        fontSize={12}
        cornerRadius={4}
        onClick={() => moonbase.present('license')}
      />
    </>
  );
}
