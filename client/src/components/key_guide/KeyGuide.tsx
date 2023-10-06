import React from 'react'

// Import types
import { KeyGuideProps } from './KeyGuide.props';

// Import styles
import './KeyGuide.styles.css';

/**
 * Component is used to render a guide for keys.
 * @param props 
 * @returns 
 */
export default function KeyGuide(props: KeyGuideProps) {
  return (
    <div className={"keyguide" + (props.extendClassName ? " " + props.extendClassName : "")}>
      {
        typeof props.title === "string"
          ? <span className="me-1">{props.title}</span>
          : props.title
      }
      {
        typeof props.keys === "string"
          ? <span className="fw-bold">{props.keys}</span>
          : props.keys
      }
    </div>
  );
}