import { useSelector, useDispatch } from 'react-redux';

// Import from state
import { AppDispatch } from 'src/state';

// Import from state/settings
import {
  toggleDarkModeAction,
  setSFXStatusAction,
  settingsSelector
} from 'src/state/settings';

export const {
  useSettings,
  useSettingsState,
  useSettingsActions
} = (function() {
  const createSettingsActionFns = function(dispatch: AppDispatch) {
    return {
      toggleDarkModeAction: function() {
        dispatch(toggleDarkModeAction());
      },

      // setSFXStatusAction: function(id: string) {
      //   dispatch(setSFXStatusAction(id));
      // }
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

      return { settings, settingsDispatcher: createSettingsActionFns(dispatch) }
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
      return createSettingsActionFns(dispatch);
    }
  }
})();