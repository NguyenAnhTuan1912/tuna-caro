import React from 'react';

// Import from classes.
import { SoundEffects, SFXPathsType } from 'src/classes/SoundEffects';

// Import from hooks
import { useSettingsState } from './useSettings';

/**
 * Use this hook for sfx in app.
 * @param st 
 * @returns 
 */
export function useSFX() {
  const st = useSettingsState();
  const sfx = React.useMemo(() => {
    return SoundEffects.createSoundEffects(st);
  },
    [
      st.sfx.hasSoundWhenClickButton,
      st.sfx.hasSoundWhenClickTable
    ]
  );

  const play = React.useCallback(
  async function(soundName: SFXPathsType) {
    await SoundEffects.play(sfx, soundName);
  },
    [
      st.sfx.hasSoundWhenClickButton,
      st.sfx.hasSoundWhenClickTable
    ]
  );

  return {
    play
  }
}