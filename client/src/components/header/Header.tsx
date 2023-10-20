import React from 'react';
import { openTMI } from "tunangn-react-modal";

// Import from components
import Button from '../button/Button';

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
        <Button
          isTransparent
          onClick={() => { openTMI("mySideMenu") }}
          extendClassName="rounded-8 p-1"
        >
          <span className="material-symbols-outlined">menu</span>
        </Button>
      </div>
    </div>
  )
}