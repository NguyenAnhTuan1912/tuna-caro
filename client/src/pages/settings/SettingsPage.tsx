// Import hooks
import { useLang } from 'src/hooks/useLang';
import { useSettings } from 'src/hooks/useSettings';

// Import layouts
import BaseLayout from 'src/layouts/base_layout/BaseLayout';

// Import from utils
import { ROUTES } from 'src/utils/constant';

// Import components
import Article from 'src/components/article/Article';
import Switch from 'src/components/switch/Switch';
import MySelect from 'src/components/my_select/MySelect';
import MyDetails from 'src/components/my_details/MyDetails';
import Button from 'src/components/button/Button';

// Import types
import { SettingsPageProps } from './SettingsPage.props';

// Import styles
import './SettingsPage.styles.css';

export default function SettingsPage(props: SettingsPageProps) {
  const { settings, settingsDispatcher } = useSettings();
  const { lang, langTextJSON, langDispatcher } = useLang();

  return (
    <BaseLayout
      headerOptions={{
        title: langTextJSON.settingsPage.headerTitle,
        backButton: (navigate) => (
          <Button
            isTransparent
            hasPadding={false}
            hasBorder={false}
            onClick={() => { navigate(ROUTES.Home) }}
            extendClassName="rounded-4 p-1 me-1"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </Button>
        )
      }}
    >
      <div className="settings page p-2">
        <h1 className="txt-center">{langTextJSON.settingsPage.pageTitle}</h1>
        <div className="settings">
          <h2>{langTextJSON.settingsPage.systemSettingsLabel}</h2>
          <div className="pt-1">
            {/* Sound Effect Setting */}
            <Article title={langTextJSON.settingsPage.soundSettingsLabel} hasHorizontalLine>
              <div className="setting mb-1">
                <p>{langTextJSON.settingsPage.playSoundWhenClickButtonSettingsLabel}</p>
                <Switch
                  initialStatus={settings.sfx.hasSoundWhenClickButton}
                  onChange={status => settingsDispatcher.setSFXStatus("hasSoundWhenClickButton", status)}
                />
              </div>

              <div className="setting mb-1">
                <p>{langTextJSON.settingsPage.playSoundWhenClickTableSettingsLabel}</p>
                <Switch
                  initialStatus={settings.sfx.hasSoundWhenClickTable}
                  onChange={status => settingsDispatcher.setSFXStatus("hasSoundWhenClickTable", status)}
                />
              </div>
            </Article>

            {/* Theme Setting */}
            <Article title={langTextJSON.settingsPage.colorThemeSettingsLabel} hasHorizontalLine>
              <div className="setting mb-1">
                <p>{langTextJSON.settingsPage.darkThemeSettingsLabel}</p>
                <Switch
                  initialStatus={settings.isDarkMode}
                  onChange={status => {
                    settingsDispatcher.toggleDarkMode()
                  }}
                />
              </div>
            </Article>

            {/* Language Setting */}
            <Article title={langTextJSON.settingsPage.languageSettingsLabel} hasHorizontalLine>
              <div className="setting mb-1">
                <p>{langTextJSON.settingsPage.languageSettingsLabel}</p>
                <MySelect
                  defaultValue={lang.currentLang}
                  onChangeValue={(value) => {
                    settingsDispatcher.updateLang(value);
                    langDispatcher.getLanguagesAsync(value);
                  }}
                  options={[
                    {
                      label: <span><i className="twa twa-flag-vietnam"></i> <strong>VIE</strong></span>,
                      value: "vie"
                    },
                    {
                      label: <span><i className="twa twa-flag-united-states"></i> <strong>ENG</strong></span>,
                      value: "eng"
                    }
                  ]}
                />
              </div>
            </Article>
          </div>
          
          <h2>{langTextJSON.settingsPage.otherInformationsLabel}</h2>
          <MyDetails
            label={<p>{langTextJSON.settingsPage.aboutMeLabel}</p>}
            content={"Xin chào, mình là Nguyen Anh Tuan"}
          />

          {/* About app */}
          <MyDetails
            label={<p>{langTextJSON.settingsPage.aboutApplicationLabel}</p>}
            content={"Xin chào, mình là Nguyen Anh Tuan"}
          />
        </div>
      </div>
    </BaseLayout>
  )
}