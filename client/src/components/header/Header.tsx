import React from 'react';
import { openTMI } from "tunangn-react-modal";

// Import types
import { HeaderProps } from './Header.props';

export default function Header(props: HeaderProps) {
  return (
    <div className="app-header p-2" id="app-header">
      {
        (typeof props.title === "string" || !props.title)
          ? <h4>{"Caro - " + props.title || "Caro"}</h4>
          : (typeof props.title === "function")
            ? props.title()
            : props.title
      }
      <div className="flex-box ait-center">
        <button
          onClick={() => { openTMI("mySideMenu") }}
          className="btn-transparent no-outline rounded-8 p-1"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </div>
  )
}