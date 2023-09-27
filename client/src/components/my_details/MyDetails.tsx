import React from 'react'

// Import utils
import { OtherUtils } from 'src/utils/other';

// Import types
import { MyDetailsProps } from './MyDetails.props';

// Import styles
import './MyDetails.styles.css';

export default function MyDetails(props: MyDetailsProps) {
  const [detailsState, setDetailsState] = React.useState({
    isExpand: false
  });
  const elementRefs = React.useRef<{
    arrow: HTMLSpanElement | null,
    details: HTMLDetailsElement | null
  }>({
    arrow: null,
    details: null
  });

  const detailsData = React.useMemo(() => {
    return {
      label: OtherUtils.fromCase([
        {
          case: typeof props.label === "string",
          returnValue: <strong>{props.label as string}</strong>
        },
        {
          case: React.isValidElement(props.label),
          returnValue: props.label
        }
      ])
    }
  }, [props.label]);

  return (
    <details
      className="details btn-transparent rounded-4 p-1"
      ref={ref => elementRefs.current.details = ref}
      onToggle={() => {
        if(elementRefs.current.details?.open) {
          elementRefs.current.arrow!.textContent = "expand_less";
        } else {
          elementRefs.current.arrow!.textContent = "expand_more";
        }
      }}
    >
      <div className="mb-1"></div>
      <summary className="flex-box ali-center jc-space-between">
        {detailsData.label}
        <span
          className="material-symbols-outlined ms-1"
          ref={ref => elementRefs.current.arrow = ref}
        >
          {detailsState.isExpand ? "expand_less" : "expand_more"}
        </span>
      </summary>
      {props.content}
    </details>
  )
}