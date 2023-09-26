import React from 'react'

// Import components
import Switch from 'src/components/switch/Switch';

// Import types
import { SettingsPageProps } from './SettingsPage.props';

// Import styles
import './SettingsPage.styles.css';

export default function SettingsPage(props: SettingsPageProps) {
  return (
    <div className="settings-page full-container p-2">
      <h1>Hello, Welcome to Settings Page</h1>
      <div className="settings">
        <div className="setting mb-1">
          <strong>Hiệu ứng âm thanh</strong>
          <Switch initialStatus onChange={status => console.log(status)} />
        </div>
        <div className="setting">
          <strong>Chủ đề màu tối</strong>
          <Switch onChange={status => console.log(status)} />
        </div>
      </div>
    </div>
  )
}