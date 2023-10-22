import React from 'react'

// Import styles
import './Switch.styles.css';

// Import type
import { SwitchProps } from './Switch.props';

/**
 * This component allow you create a switch that has 2 status - true and false.
 * @param props 
 * @returns 
 */
export default function Switch(props: SwitchProps) {
  const [status, setStatus] = React.useState(Boolean(props.initialStatus));
  const switchRef = React.useRef<HTMLDivElement>(null);
  const switchData = React.useRef({
    prevStatus: !Boolean(props.initialStatus)
  });
  
  const animationData = React.useMemo(() => {
    return {
      options: {
        duration: 400,
        easing: "ease-in-out",
        fill: "both"
      } as KeyframeAnimationOptions,
      keyframes: {
        whenTrue: [{ transform: "translateX(100%)" }],
        whenFalse: [{ transform: "translateX(0)" }]
      }
    }
  }, []);

  React.useEffect(() => {
    // For old device, if element doesn't have animate() method, don't call it.
    if(!switchRef.current?.animate) {
      if(status) {
        // When true
        switchRef.current!.style.transform = animationData.keyframes.whenTrue[0].transform;
      } else {
        // When false
        switchRef.current!.style.transform = animationData.keyframes.whenFalse[0].transform;
      }
      return;
    }
      

    if(status) {
      // When true
      switchRef.current?.animate(animationData.keyframes.whenTrue, animationData.options);
    } else {
      // When false
      switchRef.current?.animate(animationData.keyframes.whenFalse, animationData.options);
    }
  }, [status]);

  return (
    <div className="switch-container outline">
      <div
        onClick={() => {
          props.onChange(!status);
          setStatus(prevState => {
            return !prevState;
          })
        }}
        className="switch outline-x"
        ref={switchRef}
      ></div>
    </div>
  )
}