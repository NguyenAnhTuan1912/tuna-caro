import React, { FormEvent } from 'react'
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
  const handleSubmitOnForm = function(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let target = e.target as HTMLFormElement;
    let name = (target["game_name"] as HTMLInputElement).value;
    let password = (target["password"] as HTMLInputElement).value;

    props.close({
      isAgree: true,
      data: {
        name,
        password
      }
    });
  }

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
        backgroundColor: "var(--clr-background)",
        border: "2px solid var(--clr-onBackground)"
      })}
    >
      <div className="px-4 mt-4">
        <form className="flex-box flex-col w-100 px-4" onSubmit={handleSubmitOnForm}>
          <MyInput
            name="game_name"
            placeholder="Tên phòng..."
            replaceClassName="spe-outline w-100 p-1 mb-1"
          />
          <MyInput
            name="password"
            placeholder="Mật khẩu (nếu có)..."
            type="password"
            replaceClassName="spe-outline w-100 p-1"
          />

          <div className="flex-box jc-space-between mt-2">
            <div>
              <p>Lưu ý:</p>
              <p>Mật khẩu không bắt buộc.</p>
            </div> 
            <button
              type="submit"
              className="btn spe-outline"
            >Tạo</button>
          </div>
        </form>
      </div>
    </DialogLayout>
  )
}