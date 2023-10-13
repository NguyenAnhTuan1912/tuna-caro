import React from 'react'
import { CustomizedModalItemProps } from 'tunangn-react-modal';

// Import components
import MyInput from '../my_input/MyInput';

// Import layout
import DialogLayout from 'src/layouts/dialog_layout/DialogLayout'

/**
 * A component will pop a dialog up. There are a form has ID and Password (optional).
 * Users use this to find a quick game.
 * @param props 
 * @returns 
 */
export default function GameFindingDialog(props: CustomizedModalItemProps) {
  const handleSubmitOnForm = function(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let target = e.target as HTMLFormElement;
    let id = (target["game_id"] as HTMLInputElement).value;
    let password = (target["password"] as HTMLInputElement).value;

    props.close({
      isAgree: true,
      data: {
        id,
        password
      }
    });
  }

  return (
    <DialogLayout
      title={<h3>Tìm phòng</h3>}
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
        <form className="flex-box flex-col w-100 px-4" onSubmit={handleSubmitOnForm}>
          <MyInput
            name="game_id"
            placeholder="Game Id..."
            replaceClassName="spe-outline w-100 p-1 mb-1"
          />
          <MyInput
            name="password"
            placeholder="Mật khẩu (nếu có)..."
            type="password"
            replaceClassName="spe-outline w-100 p-1"
          />

          <div className="flex-box jc-space-between px-4 mt-2">
            <div>
              <p>Lưu ý:</p>
              <p>Mật khẩu không bắt buộc.</p>
            </div>
            <button
              type="submit"
              className="btn spe-outline"
            >Tìm</button>
          </div>
        </form>
      </div>
    </DialogLayout>
  )
}