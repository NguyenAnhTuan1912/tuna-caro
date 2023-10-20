import React from 'react';

// Import from layouts
import CloseButton from '../CloseButton';

// Import types
import { DialogLayoutProps } from './DialogLayout.props';

/**
 * A layout for dialog, use for customized dialog.
 */
const DialogLayout = React.forwardRef<HTMLDivElement, DialogLayoutProps>(function(props, ref) {
  return (
    <div
      ref={ref}
      style={props.style}
      className={props.className ? props.className : "my-dialog"}
    >
      <div className="flex-box ait-center jc-space-between">
        {props.title}
        <CloseButton
          icon='close'
          isAgree={false}
          close={props.close}
        />
      </div>
      {props.children}
    </div>
  )
});

export default DialogLayout; 