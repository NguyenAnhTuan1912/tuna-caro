import React from 'react';

// Import types
import { DialogLayoutProps } from './DialogLayout.props';

const DialogLayout = React.forwardRef<HTMLDivElement, DialogLayoutProps>(function(props, ref) {
  return (
    <div
      ref={ref}
      style={props.style}
      className={props.className ? props.className : "my-dialog"}
    >
      <div className="flex-box ait-center jc-space-between">
        {props.title}
        <span
          className="material-symbols-outlined btn-transparent p-1 rounded-4"
          onClick={() => props.close({ isAgree: false })}
        >
          close
        </span>
      </div>
      {props.children}
    </div>
  )
});

export default DialogLayout; 