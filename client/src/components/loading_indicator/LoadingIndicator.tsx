// Locally Import
import { LoadingIndicatorProps } from './LoadingIndicator.props'

import "./LoadingIndicator.styles.css"

/**
 * Component renders a loading indicator.
 * @param props 
 * @returns 
 */
export default function LoadingIndicator(props: LoadingIndicatorProps) {
  let color = props.color ? props.color : "#262626";
  let strokeWidth = props.strokeWidth ? props.strokeWidth : 15;
  let containerSize = 100;
  let cx = containerSize / 2;
  let cy = cx;
  let r = (containerSize - (5 + strokeWidth)) / 2;

  return (
    <div className="loading">
      <svg className="indicator" viewBox={`0 0 ${containerSize} ${containerSize}`} xmlns="http://www.w3.org/2000/svg">
        <circle cx={cx} cy={cy} r={r} stroke={color} strokeWidth={strokeWidth} fill="none" />
      </svg>
      <p className="ms-2">{props.text ? props.text : "Loading..."}</p>
    </div>
  )
}