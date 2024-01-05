import { useDispatch, useSelector } from "react-redux";

// Import from state
import { AppDispatch } from 'src/state';
import { getLanguageAsyncThunk } from "src/state/lang/thunks/getLanguageAsyncThunk";
import { LangTexts, LangAbouts, langSelector } from "src/state/lang";

/**
 * Use this function to get LangTextJSON from text.
 * @param text 
 * @param langCode 
 * @returns 
 */
function getLangTextJSON(text: LangTexts, langCode: string) {
  return text[langCode];
};

/**
 * Use this function to get LangAboutJSON from about.
 * @param about 
 * @param langCode 
 * @returns 
 */
function getLangAboutJSON(about: LangAbouts, langCode: string) {
  return about[langCode];
};

export const {
  useLang,
  useLangAction,
  useLangState
} = (function() {
  const createLangDispatchers = function(dispatch: AppDispatch) {
    return {
      /**
       * Use this dispatcher to fetch language with `langCode`.
       * @param langCode 
       */
      getLanguagesAsync: function(langCode: string) {
        dispatch(getLanguageAsyncThunk(langCode));
      }
    }
  };

  return {
    /**
     * Use this hook to get state of lang and get dispatchers to manipulate them.
     * @returns 
     */
    useLang: function() {
      const lang = useSelector(langSelector);
      const dispatch = useDispatch();

      const langDispatcher = createLangDispatchers(dispatch);

      return {
        lang,
        langTextJSON: getLangTextJSON(lang.text, lang.currentLang),
        langAboutJSON: getLangAboutJSON(lang.about, lang.currentLang),
        langDispatcher
      }
    },

    /**
     * Use this hook to get only dispatchers.
     * @returns 
     */
    useLangAction: function() {
      const dispatch = useDispatch();

      return createLangDispatchers(dispatch);
    },

    /**
     * Use this hook to get only state of lang.
     * @returns 
     */
    useLangState: function() {
      const lang = useSelector(langSelector);

      return {
        lang,
        langTextJSON: getLangTextJSON(lang.text, lang.currentLang),
        langAboutJSON: getLangAboutJSON(lang.about, lang.currentLang),
      }
    }
  }
})();