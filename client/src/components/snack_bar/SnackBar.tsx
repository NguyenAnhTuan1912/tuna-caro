import React from 'react';
import { CustomizedModalItemProps, openTMI } from 'tunangn-react-modal';

// Import from layouts
import SnackBarLayout from 'src/layouts/modal_items/snackbar_layout/SnackBarLayout';
import CloseButton, { CloseButtonPropsType } from 'src/layouts/modal_items/CloseButton';
import { SnackBarElementRefsType } from 'src/layouts/modal_items/snackbar_layout/SnackbarLayout.props';

// Import styles
import './SnackBar.styles.css';

export const name = "mySnackBar";

interface SnackBarTransferedDataType {
  closeButtons: Array<CloseButtonPropsType>;
  body: () => JSX.Element | JSX.Element | string;
}

/*
  Snackbar has multiples type:
  - Notification: use to announce to player know something.
  - Ask: use to ask player something. And player can agree or disagree.
*/

/**
 * Use this function to open customized snackbar.
 * @param data 
 * @returns 
 */
export function openNotifiableSnackBar(message: string) {
  return openTMI(name, {
    body: message,
    closeButtons: [
      {
        icon: "close",
        isAgree: false
      }
    ]
  });
}

/**
 * This component is customized from `tunangn-react-modal` snackbar. Use to show
 * notification, message.
 * @param props 
 * @returns 
 */
export default function SnackBar(props: CustomizedModalItemProps) {
  const data = props.item.getData() as SnackBarTransferedDataType;
  const elementRefs = React.useRef<SnackBarElementRefsType>({
    container: null
  });

  return (
    <SnackBarLayout
      ref={ref => elementRefs.current.container = ref}
      className="csnackbar p-1"
      snackBarProps={props}
      body={(
        <div className="csnackbar-body flex-box ait-center px-1">
          {
            typeof data.body === "function"
              ? data.body()
              : data.body
          }
        </div>
      )}
      footer={(
        <div className="csnackbar-footer flex-box flex-rw ait-center">
          {
            data.closeButtons.map(closeBtn => (
              <CloseButton
                key={closeBtn.icon}
                icon={closeBtn.icon}
                isAgree={closeBtn.isAgree}
                close={props.close}
              />
            ))
          }
        </div>
      )}
    />
  )
}