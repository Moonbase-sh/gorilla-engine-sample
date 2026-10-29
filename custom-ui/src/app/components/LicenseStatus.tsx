import * as React from 'react';
import licensing, { useLicensing } from '../../licensing';

const FONT_M = 'fonts/Roboto-Medium.otf';
const FONT_R = 'fonts/Roboto-Regular.otf';

export function LicenseStatus() {
  const { license, error } = useLicensing();

  let text = 'Not activated';
  if (license && error) {
    // A deactivation that failed, which keeps the license
    text = error.message;
  } else if (license?.trial) {
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
        textColor={license && error ? 'E85D5D' : '8A93A8'}
        font={FONT_R}
        fontSize={12}
        textAlign="centered right"
      />
      {/* Frees this computer's seat, and locks the plugin again. When Moonbase
          can't be reached the license is kept, and the error says why. */}
      {license && (
        <geButton
          x={770}
          y={4}
          width={110}
          height={20}
          text="Deactivate"
          backgroundColor="21242E"
          textColor="E1E6F5"
          font={FONT_M}
          fontSize={12}
          cornerRadius={4}
          onClick={() => licensing.deactivate().catch(() => {})}
        />
      )}
    </>
  );
}
