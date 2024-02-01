// Locally Import
import { LoadingIndicatorProps } from './LoadingIndicator.props'

import "./LoadingIndicator.styles.css"

/**
 * Component renders a loading indicator.
 * @param props 
 * @returns 
 */
export default function LoadingIndicator(props: LoadingIndicatorProps) {
  let strokeWidth = props.strokeWidth ? props.strokeWidth : 15;
  let isTextPlaceBeforeIndicator = props.isTextPlaceBeforeIndicator ? props.isTextPlaceBeforeIndicator : false;
  let containerSize = 100;
  let cx = containerSize / 2;
  let cy = cx;
  let r = (containerSize - (5 + strokeWidth)) / 2;

  return (
    <div className="loading">
      {
        isTextPlaceBeforeIndicator && <p className="me-2">{props.text ? props.text : "Loading..."}</p>
      }
      <svg className="indicator" viewBox={`0 0 ${containerSize} ${containerSize}`} xmlns="http://www.w3.org/2000/svg">
        <circle cx={cx} cy={cy} r={r} strokeWidth={strokeWidth} fill="none" />
      </svg>
      {
        !isTextPlaceBeforeIndicator && <p className="ms-2">{props.text ? props.text : "Loading..."}</p>
      }
    </div>
  )
}