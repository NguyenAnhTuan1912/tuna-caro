import React from 'react';
import { openTMI, CustomizedModalItemProps } from 'tunangn-react-modal';

// Import from components
import LoadingIndicator from '../loading_indicator/LoadingIndicator';

// Import from layouts
import SnackBarLayout from 'src/layouts/modal_items/snackbar_layout/SnackBarLayout';
import { SnackBarElementRefsType } from 'src/layouts/modal_items/snackbar_layout/SnackbarLayout.props';

type ConnectionStatusSnackBarDataType = {
  isConnected: boolean;
  timeoutFunc?: number;
  disconnectedLabel?: string;
  connectedLabel?: string;
};

export const name = "myConnectionStatusSnackBar";

/**
 * Use this function to open a Connection Status snackbar.
 * @param data 
 * @returns 
 */
export function openConnectionStatusSnackBar(data: ConnectionStatusSnackBarDataType) {
  data.connectedLabel = data.connectedLabel ? data.connectedLabel : "Kết nối lại thành công!";
  data.disconnectedLabel = data.disconnectedLabel ? data.disconnectedLabel : "Mất kết nối! Đang kết nối lại...";

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

      // Remove timeout function from `offline` event.
      if(data.timeoutFunc) clearTimeout(data.timeoutFunc);

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
              ? <p>{data.connectedLabel}</p>
              : (
                <LoadingIndicator
                  isTextPlaceBeforeIndicator
                  text={data.disconnectedLabel}
                />
              )
          }
        </div>
      )}
    />
  )
}
