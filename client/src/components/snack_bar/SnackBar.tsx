import React from 'react';
import { CustomizedModalItemProps, openTMI } from 'tunangn-react-modal';

// Import from layouts
import SnackBarLayout from 'src/layouts/modal_items/snackbar_layout/SnackBarLayout';
import CloseButton, { CloseButtonPropsType } from 'src/layouts/modal_items/CloseButton';
import { SnackBarElementRefsType } from 'src/layouts/modal_items/snackbar_layout/SnackbarLayout.props';

// Import styles
import './SnackBar.styles.css';

export const name = "mySnackBar";

type ElementDataBodyType = (() => JSX.Element | string) | JSX.Element | string;

type SnackBarDataType = {
  closeButtons: Array<CloseButtonPropsType>;
  body: ElementDataBodyType;
  title: ElementDataBodyType;
  notification?: {
    type: "success" | "info" | "error" | "warning"
  }
}

/*
  Snackbar has multiples type:
  - Notification: use to announce to player know something.
  - Ask: use to ask player something. And player can agree or disagree.
*/
export const NotifiableSnackBars = {
  /**
   * Use this function to open a notifiable snackbar to nofify a success message.
   * @param message 
   * @returns 
   */
  success: function(message: ElementDataBodyType) {
    return openTMI(name, {
      title: <span className="material-symbols-outlined">done</span>,
      body: message,
      notification: { type: "success" },
      closeButtons: [
        {
          icon: "close",
          isAgree: false
        }
      ]
    } as SnackBarDataType);
  },

  /**
   * Use this function to open a notifiable snackbar to nofify a informative message.
   * @param message 
   * @returns 
   */
  info: function(message: ElementDataBodyType) {
    return openTMI(name, {
      title: <span className="material-symbols-outlined">help</span>,
      body: message,
      notification: { type: "info" },
      closeButtons: [
        {
          icon: "close",
          isAgree: false
        }
      ]
    } as SnackBarDataType);
  },

  /**
   * Use this function to open a notifiable snackbar to nofify a error message.
   * @param message 
   * @returns 
   */
  error: function(message: ElementDataBodyType) {
    return openTMI(name, {
      title: <span className="material-symbols-outlined">error</span>,
      body: message,
      notification: { type: "error" },
      closeButtons: [
        {
          icon: "close",
          isAgree: false
        }
      ]
    } as SnackBarDataType);
  },

  /**
   * Use this function to open a notifiable snackbar to nofify a warning message.
   * @param message 
   * @returns 
   */
  warning: function(message: ElementDataBodyType) {
    return openTMI(name, {
      title: <span className="material-symbols-outlined">warning</span>,
      body: message,
      notification: { type: "warning" },
      closeButtons: [
        {
          icon: "close",
          isAgree: false
        }
      ]
    } as SnackBarDataType);
  }
};

/**
 * This component is customized from `tunangn-react-modal` snackbar. Use to show
 * notification, message.
 * @param props 
 * @returns 
 */
export default function SnackBar(props: CustomizedModalItemProps) {
  const data = props.item.getData<SnackBarDataType>();
  const elementRefs = React.useRef<SnackBarElementRefsType>({
    container: null
  });

  let titleContainerClassName = "csnackbar-header flex-box ait-center jc-center p-1";
  titleContainerClassName += data.notification ? " " + data.notification.type : "";

  console.log("Title Container ClassName: ", titleContainerClassName);

  return (
    <SnackBarLayout
      ref={ref => elementRefs.current.container = ref}
      className="csnackbar"
      snackBarProps={props}
      header={(
        <div className={titleContainerClassName}>
          {
            typeof data.title === "function"
              ? data.title()
              : data.title
          }
        </div>
      )}
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
        <div className="csnackbar-footer flex-box flex-rw ait-center p-1">
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