import React from 'react';
import { openTMI, CustomizedModalItemProps } from 'tunangn-react-modal';

// Import from components
import LoadingIndicator from '../loading_indicator/LoadingIndicator';

// Import from layouts
import SnackBarLayout from 'src/layouts/modal_items/snackbar_layout/SnackBarLayout';
import CloseButton from 'src/layouts/modal_items/CloseButton';
import { SnackBarElementRefsType } from 'src/layouts/modal_items/snackbar_layout/SnackbarLayout.props';

type ConnectionStatusSnackBarDataType = {
  isConnected: boolean;
};

export const name = "myConnectionStatusSnackBar";

/**
 * Use this function to open a Connection Status snackbar.
 * @param data 
 * @returns 
 */
export function openConnectionStatusSnackBar(data: ConnectionStatusSnackBarDataType) {
  return openTMI(name, data);
}

/**
 * Component renders a snackbar for notify the connection status.
 * @param props 
 * @returns 
 */
export default function ConnectionStatusSnackBar(props: CustomizedModalItemProps) {
  const data = props.item.getData<ConnectionStatusSnackBarDataType>();

  const [isConnected, setIsConnected] = React.useState(data.isConnected);
  const elementRefs = React.useRef<SnackBarElementRefsType>({
    container: null
  });
  const duration = 3000;
  let headerClassName = "csnackbar-header cscsnackbar-header flex-box ait-center jc-center"
  headerClassName += isConnected ? " connected" : " disconnected"

  // Listen to `online` event in `window` one times.
  React.useEffect(() => {
    const handleOnlineOnWindow  = function() {
      setIsConnected(true);

      // Close snackbar after `duration` second.
      setTimeout(() => {
        props.close({ isAgree: true });
      }, duration);
    };

    // Add listener
    window.addEventListener("online", handleOnlineOnWindow);

    return function() {
      // Add remove listener
      window.removeEventListener("online", handleOnlineOnWindow);
    }
  }, []);

  return (
    <SnackBarLayout
      ref={ref => elementRefs.current.container = ref}
      className="csnackbar"
      snackBarProps={props}
      header={(
        <div className={headerClassName}>
          {
            isConnected
              ? <span className="material-symbols-outlined fs-0 txt-clr-background">done</span>
              : <span className="material-symbols-outlined fs-0 txt-clr-background">close</span>
          }
          
        </div>
      )}
      body={(
        <div className="csnackbar-body flex-box ait-center px-1">
          {
            isConnected
              ? <p>Đã kết nối lại</p>
              : (
                <LoadingIndicator
                  isTextPlaceBeforeIndicator
                  text="Mất kết nối! Đang kết nối lại..."
                />
              )
          }
        </div>
      )}
    />
  )
}
