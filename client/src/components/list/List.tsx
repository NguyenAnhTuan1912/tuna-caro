import React from 'react';

// Locally Import
// Import types
import {
  ListProps,
  ListChildElementRefsType,
  ListInternalDataType
} from './List.props'

// Import styles
import "./List.styles.css";

export default function List<T>(props: ListProps<T>) {
  const elementRefs = React.useRef<ListChildElementRefsType>({
    list: null,
    content: null
  });

  /**
   * This data is state, but it doesn't need to re-render the component.
   */
  const listData = React.useRef<ListInternalDataType>({
    listHeight: 0,
    contentHeight: 0
  });

  React.useEffect(() => {
    // Set some values
    listData.current.contentHeight = elementRefs.current.content?.offsetHeight!;
    listData.current.listHeight = elementRefs.current.list?.offsetHeight!;
  }, []);

  return (
    <div
      className="list"
      ref={ref => elementRefs.current.list = ref}
      onScroll={(e) => {
        let target = e.target as HTMLElement;
        let threshold = listData.current.contentHeight - (listData.current.listHeight + 24);
        
        // If element reaches the threshold, the trigger the if statement.
        if(target.scrollTop >= threshold && props.onReachBottom) props.onReachBottom();
      }}
    >
      <div
        ref={ref => elementRefs.current.content = ref}
      >
        {

        }
      </div>
    </div>
  )
}