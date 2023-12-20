import React from 'react'
import { CustomizedModalItemProps, openTMI } from 'tunangn-react-modal';

// Import components
import Button from '../button/Button';

type PauseGameDataType = {
  canClose?: boolean;
};

export const name = "myPauseGameDialog";

export function openPauseGameDialog(data: PauseGameDataType) {
  return openTMI(name, data);
}

/**
 * Component renders a pause game dialog.
 * @param props 
 * @returns 
 */
export default function PauseGameDialog(props: CustomizedModalItemProps) {
  const data = props.item.getData<PauseGameDataType>();

  return (
    <div
      className="flex-box flex-rw ait-center"
      style={props.utils.getContainerStyle({
        backgroundColor: "transparent",
        border: "none"
      })}
    >
      <Button
        onClick={() => {
          if(!data.canClose) return;
          props.close({ isAgree: false });
        }}
      >
        <span className="material-symbols-outlined fs-xl txt-clr-background">play_arrow</span>
      </Button>
      <p className="fs-xl txt-clr-background">Tạm dừng</p>
    </div>
  )
}