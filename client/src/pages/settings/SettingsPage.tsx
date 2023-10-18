import React from 'react'

// Import hooks
import { useSettings } from 'src/hooks/useSettings';

// Import components
import Switch from 'src/components/switch/Switch';
import MySelect from 'src/components/my_select/MySelect';
import MyDetails from 'src/components/my_details/MyDetails';

// Import types
import { SettingsPageProps } from './SettingsPage.props';

// Import styles
import './SettingsPage.styles.css';

export default function SettingsPage(props: SettingsPageProps) {
  const { settings, settingsDispatcher } = useSettings();

  console.log("Settings: ", settings);

  return (
    <div className="settings-page p-2">
      <h1 className="txt-center">Cài đặt</h1>
      <div className="settings">
        <h3>Hệ thống</h3>
        <div className="ps-1 pt-1">
          {/* Sound Effect Setting */}
          <div className="setting mb-1">
            <p>Hiệu ứng âm thanh</p>
            <Switch initialStatus onChange={status => console.log(status)} />
          </div>

          {/* Theme Setting */}
          <div className="setting mb-1">
            <p>Màu tối</p>
            <Switch
              initialStatus={settings.isDarkMode}
              onChange={status => {
                settingsDispatcher.toggleDarkModeAction()
              }}
            />
          </div>

          {/* Language Setting */}
          <div className="setting mb-1">
            <p>Ngôn ngữ</p>
            <MySelect
              defaultValue="vie"
              onChangeValue={(value) => console.log("Selected value: ", value)}
              options={[
                {
                  label: <span><i className="twa twa-flag-vietnam"></i> <strong>VIE</strong></span>,
                  value: "vie"
                },
                {
                  label: <span><i className="twa twa-flag-united-states"></i> <strong>US-ENG</strong></span>,
                  value: "us-eng"
                }
              ]}
            />
          </div>
        </div>
        
        
        <h3>Thông tin khác</h3>
        {/* About me */}
        <MyDetails
          label={<p>Về tôi</p>}
          content={"Xin chào, mình là Nguyen Anh Tuan"}
        />

        {/* About app */}
        <MyDetails
          label={<p>Về ứng dụng</p>}
          content={"Xin chào, mình là Nguyen Anh Tuan"}
        />
      </div>
    </div>
  )
}