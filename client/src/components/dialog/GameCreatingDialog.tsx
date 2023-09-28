import React from 'react'
import { CustomizedModalItemProps } from 'tunangn-react-modal';

// Import components
import MyInput from '../my_input/MyInput';

// Import layout
import DialogLayout from 'src/layouts/dialog_layout/DialogLayout'

/**
 * A component will pop a dialog up. Users can create game here.
 * @param props 
 * @returns 
 */
export default function GameCreatingDialog(props: CustomizedModalItemProps) {
  return (
    <DialogLayout
      title={<h3>Tạo phòng chơi</h3>}
      close={props.close}
      className="p-1"
      style={props.utils.getContainerStyle({
        width: "100%",
        maxWidth: "540px",
        minHeight: "360px",
        borderRadius: "0",
        border: "2px solid var(--clr-onBackground)"
      })}
    >
      <div className="px-4 mt-4">
        <form className="flex-box flex-col w-100 px-4">
          <MyInput
            placeholder="Tên phòng..."
            replaceClassName="spe-outline w-100 p-1 mb-1"
          />
          <MyInput
            placeholder="Mật khẩu (nếu có)..."
            type="password"
            replaceClassName="spe-outline w-100 p-1"
          />
        </form>
        <div className="flex-box jc-space-between px-4 mt-2">
          <div>
            <p>Lưu ý:</p>
            <p>Mật khẩu không bắt buộc.</p>
          </div>
          <button
            type="button"
            className="btn spe-outline"
          >Tạo</button>
        </div>
      </div>
    </DialogLayout>
  )
}