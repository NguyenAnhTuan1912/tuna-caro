import React from 'react'

// Import hooks
import { useSettings } from 'src/hooks/useSettings';

// Import components
import Article from 'src/components/article/Article';
import Switch from 'src/components/switch/Switch';
import MySelect from 'src/components/my_select/MySelect';
import MyDetails from 'src/components/my_details/MyDetails';

// Import types
import { SettingsPageProps } from './SettingsPage.props';

// Import styles
import './SettingsPage.styles.css';

export default function SettingsPage(props: SettingsPageProps) {
  const { settings, settingsDispatcher } = useSettings();

  return (
    <div className="settings page p-2">
      <h1 className="txt-center">Cài đặt</h1>
      <div className="settings">
        <h2>Hệ thống</h2>
        <div className="pt-1">
          {/* Sound Effect Setting */}
          <Article title="Âm thanh" hasHorizontalLine>
            <div className="setting mb-1">
              <p>Âm thanh khi ấn nút</p>
              <Switch
                initialStatus={settings.sfx.hasSoundWhenClickButton}
                onChange={status => settingsDispatcher.setSFXStatus("hasSoundWhenClickButton", status)}
              />
            </div>

            <div className="setting mb-1">
              <p>Âm thanh khi ấn vào bàn cờ</p>
              <Switch
                initialStatus={settings.sfx.hasSoundWhenClickTable}
                onChange={status => settingsDispatcher.setSFXStatus("hasSoundWhenClickTable", status)}
              />
            </div>
          </Article>

          {/* Theme Setting */}
          <Article title="Chủ đề" hasHorizontalLine>
            <div className="setting mb-1">
              <p>Màu tối</p>
              <Switch
                initialStatus={settings.isDarkMode}
                onChange={status => {
                  settingsDispatcher.toggleDarkMode()
                }}
              />
            </div>
          </Article>

          {/* Language Setting */}
          <Article title="Ngôn ngữ" hasHorizontalLine>
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
                    label: <span><i className="twa twa-flag-united-states"></i> <strong>ENG</strong></span>,
                    value: "eng"
                  }
                ]}
              />
            </div>
          </Article>
        </div>
        
        <h2>Thông tin khác</h2>
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