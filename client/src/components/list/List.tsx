import React from 'react';

// Locally Import
// Import types
import {
  ListProps,
  ListChildElementRefsType
} from './List.props'

// Import styles
import "./List.styles.css";

/**
 * This component renders a list of `data` that is passed to it.
 * @param props 
 * @returns 
 */
const List = React.forwardRef(function(props, ref) {
  const elementRefs = React.useRef<ListChildElementRefsType>({
    list: null,
    content: null
  });

  const handleScrollOnList = React.useCallback(function(e: React.UIEvent) {
    let target = e.target as HTMLElement;
    let threshold = elementRefs.current.content?.offsetHeight! - (elementRefs.current.list?.offsetHeight! + 0);
    
    // If element reaches the threshold, the trigger the if statement.
    if(target.scrollTop >= threshold && props.onReachBottom) props.onReachBottom(target.scrollTop);
  }, []);

  // Sync the outer ref `ref` with inner ref `elementRefs.current.list`.
  // React.useImperativeHandle(ref, () => elementRefs.current.list!, []);

  return React.useMemo(() => (
    <div
      className="list"
      style={{
        maxHeight: props.maxHeight
      }}
      ref={_ref => {
        // Sync the outer ref `ref` with inner ref `elementRefs.current.list`.
        elementRefs.current.list = _ref;
        if(typeof ref === "function") ref(_ref);
        else if(ref !== null) ref.current = _ref;
      }}
      // ref={ref => elementRefs.current.list = ref}
      onScroll={props.onReachBottom ? handleScrollOnList : undefined}
    >
      <div
        className="content"
        ref={ref => elementRefs.current.content = ref}
      >
        {
          props.data.map(props.renderItem)
        }
      </div>
    </div>
  ), [props.data]);
}) as <T>(p: ListProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }) => React.ReactElement;

export default List;