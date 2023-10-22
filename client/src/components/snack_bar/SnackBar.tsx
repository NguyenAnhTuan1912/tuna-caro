import React from 'react';
import { CustomizedModalItemProps, openTMI } from 'tunangn-react-modal';

// Import from layouts
import CloseButton, { CloseButtonPropsType } from 'src/layouts/modal_items/CloseButton';

// Import styles
import './SnackBar.styles.css';

const name = "mySnackBar";

interface SnackBarElementsType {
  container: HTMLDivElement | null;
}

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
export function openNotificatedSnackBar(message: string) {
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
  const elementRefs = React.useRef<SnackBarElementsType>({
    container: null
  });

  // Setup useEffect to handle some tasks.
  React.useEffect(() => {

    // For old device.
    if(!elementRefs.current.container?.animate) return;

    // Run animation.
    props.utils.runAnimation!(elementRefs.current.container);
  }, []);

  return (
    <div
      ref={ref => elementRefs.current.container = ref}
      className="csnackbar p-1"
      style={props.utils.getContainerStyle({
        boxShadow: "none",
        backgroundColor: "var(--clr-background)",
        border: "2px solid var(--clr-outline)",
        borderRadius: 0,
        marginTop: "1rem",
        marginRight: "1rem"
      })}
    >
      <div className="csnackbar-body flex-box ait-center px-1">
        {
          typeof data.body === "function"
            ? data.body()
            : data.body
        }
      </div>

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
    </div>
  )
}