import { useSelector, useDispatch } from 'react-redux';

// Import from classes
import { SFXSettingKeysType } from 'src/classes/Settings';

// Import from state
import { AppDispatch } from 'src/state';

// Import from state/settings
import {
  toggleDarkModeAction,
  setSFXStatusAction,
  performTasksRequireSettingsAction,
  settingsSelector
} from 'src/state/settings';

export const {
  useSettings,
  useSettingsState,
  useSettingsActions
} = (function() {
  const createActions = function(dispatch: AppDispatch) {
    return {
      /**
       * Use this dispatcher to change dark mode status.
       */
      toggleDarkMode: function() {
        dispatch(toggleDarkModeAction());
      },

      /**
       * Use this dispatcher to change SFX Settings status.
       * @param soundName 
       * @param status 
       */
      setSFXStatus: function(soundName: SFXSettingKeysType, status?: boolean) {
        dispatch(setSFXStatusAction({ sound: soundName, status }));
      },

      performTasksRequireSettings: function() {
        dispatch(performTasksRequireSettingsAction());
      }
    }
  }

  return {
    /**
     * Use this hook to access state and actions of settings.
     * @returns 
     */
    useSettings: function() {
      const settings = useSelector(settingsSelector);
      const dispatch = useDispatch();

      return { settings, settingsDispatcher: createActions(dispatch) }
    },

    /**
     * Use this hook to access only state of settings.
     * @returns 
     */
    useSettingsState: function() {
      return useSelector(settingsSelector);
    },

    /**
     * Use this hook to use only actions of settings.
     * @returns 
     */
    useSettingsActions: function() {
      const dispatch = useDispatch();
      return createActions(dispatch);
    }
  }
})();