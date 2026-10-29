import * as React from 'react';
import { UserInterface } from './components/UserInterface';
import { LicenseStatus } from './components/LicenseStatus';
import { useNotification } from '@gorilla-engine-sdk/ge-dialogs-lib';
import {
  IPresetManager,
  useSessionAndPresetsManager,
} from '@gorilla-engine-sdk/ge-session-presets-lib';

export function Root(props) {
  const presetManager: IPresetManager = useSessionAndPresetsManager();
  const [showNotification] = useNotification();

  React.useEffect(() => {
    if (presetManager) {
      // it is possible to add additional logic when saving or loading sessions or presets
      // typically you would add custom logic here to handle additional tasks when saving or loading presets
      presetManager.setAdditionalSavePreset(
        async (
          instrument: GorillaEngine.Instrument,
          presetObj: any,
          fileObj: { filePath: string },
        ) => {
          showNotification({ message: 'Preset saved successfully' });
          return true;
        },
      );
    }
  }, [presetManager]);

  return (
    <geLabel x={0} y={0} width={920} height={590} backgroundColor={'2F323D'}>
      <UserInterface instrument={props.instrument} />
      <LicenseStatus />
    </geLabel>
  );
}
