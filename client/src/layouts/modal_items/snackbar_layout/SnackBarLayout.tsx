import React from 'react';

// Import types
import { SnackBarLayoutProps, SnackBarElementRefsType } from './SnackbarLayout.props';

const defaultStyle = {
  boxShadow: "none",
  backgroundColor: "var(--clr-background)",
  border: "2px solid var(--clr-outline)",
  borderRadius: 0,
  marginTop: "1rem",
  marginRight: "1rem"
};

/**
 * A layout for snackbar.
 */
const SnackBarLayout = React.forwardRef<HTMLDivElement, SnackBarLayoutProps>((props, ref) => {
  let innerRef = React.useRef<SnackBarElementRefsType>({
    container: null
  });

  // Setup useEffect to handle some tasks.
  React.useEffect(() => {

    // For old device.
    if(!innerRef.current.container?.animate) return;

    // Run animation.
    props.snackBarProps.utils.runAnimation!(innerRef.current.container);
  }, []);

  return (
    <div
    ref={_ref => {
      // Sync the outer ref `ref` with inner ref `elementRefs.current.list`.
      innerRef.current.container = _ref;
      if(typeof ref === "function") ref(_ref);
      else if(ref !== null) ref.current = _ref;
    }}
      className={props.className ? props.className : "my-snackbar"}
      style={props.snackBarProps.utils.getContainerStyle(props.style ? props.style : defaultStyle)}
    >
      {
        typeof props.header === "function" ? props.header() : props.header
      }
      {
        typeof props.body === "function" ? props.body() : props.body
      }
      {
        typeof props.footer === "function" ? props.footer() : props.footer
      }
    </div>
  );
});

export default SnackBarLayout;