import React from 'react'

import { HeaderProps } from './Header.props';

export default function Header(props: HeaderProps) {
  return (
    <div className="app-header p-2">
      {
        (typeof props.title === "string" || !props.title)
          ? <h4>{"Caro - " + props.title || "Caro"}</h4>
          : (typeof props.title === "function")
            ? props.title()
            : props.title
      }
      <div className="flex-box ait-center">
        <button className="btn-transparent no-outline rounded-8 p-1 me-1">
          <span><i className="twa twa-flag-vietnam"></i> <strong>VIE</strong></span>
        </button>
        <button className="btn-transparent no-outline rounded-8 p-1 me-1">
          <span className="material-symbols-outlined">dark_mode</span>
        </button>
        <button className="btn-transparent no-outline rounded-8 p-1">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </div>
  )
}