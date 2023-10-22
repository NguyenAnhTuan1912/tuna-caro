import React from 'react'
import { CustomizedModalItemProps, openTMI } from 'tunangn-react-modal';

// Import components
import MyInput from '../my_input/MyInput';
import Button from '../button/Button';

// Import layout
import DialogLayout from 'src/layouts/modal_items/dialog_layout/DialogLayout'

const name = "myGameDialog";

interface GameDialogInputPropsType {
  name: string;
  placeholder: string;
  type: string;
  replaceClassName: string;
}

interface GameDialogTransferedDataType {
  title: () => JSX.Element | JSX.Element | string;
  notes: Array<string>;
  buttonLabel: string;
  inputs: Array<GameDialogInputPropsType>;
  content?: () => JSX.Element | JSX.Element | string;
}

/**
 * Use this function to open a dialog when you want to get data for game finding.
 */
export function openGameFindingDialog() {
  return openTMI(
    name,
    {
      title: <h3>Tìm game</h3>,
      notes: ["Mật khẩu là không bắt buộc, nhưng nếu có thì phải thêm."],
      buttonLabel: "Tìm",
      inputs: [
        { name: "game_id", placeholder: "ID của game...", replaceClassName: "spe-outline w-100 p-1 mb-1", type: "text" },
        { name: "password", placeholder: "Mật khẩu (nếu có)...", replaceClassName: "spe-outline w-100 p-1", type: "password" }
      ]
    }
  );
}

/**
 * Use this function to open a dialog when you want to get data for game creating.
 */
export function openGameCreatingDialog() {
  return openTMI(
    name,
    {
      title: <h3>Tạo phòng chơi</h3>,
      notes: ["Mật khẩu là không bắt buộc, nhưng nếu có thì phải thêm."],
      buttonLabel: "Tạo phòng",
      inputs: [
        { name: "game_name", placeholder: "Tên phòng...", replaceClassName: "spe-outline w-100 p-1 mb-1", type: "text" },
        { name: "password", placeholder: "Mật khẩu (nếu có)...", replaceClassName: "spe-outline w-100 p-1", type: "password" }
      ]
    }
  );
}

/**
 * Use this function to open a dialog when you want to get data for game joining.
 * @param gameName 
 * @param host 
 * @param hasPassword 
 * @returns 
 */
export function openGameJoiningDialog(gameName: string, host: string, hasPassword: boolean) {
  return openTMI(
    name,
    {
      title: <h3>Phòng chơi</h3>,
      notes: ["Phòng này có mật khẩu, vui lòng thêm mật khẩu!"],
      buttonLabel: "Vào phòng",
      inputs: hasPassword ? [
        { name: "password", placeholder: "Mật khẩu...", replaceClassName: "spe-outline w-100 p-1", type: "password" }
      ] : undefined,
      content: (
        <div className="mb-1">
          Bạn đang muốn vào
          <h3>Phòng {gameName}</h3>
          <p>Chủ phòng: {host}</p>
          <p>Mật khẩu: {hasPassword ? "Có" : "Không"}</p>
        </div>
      )
    }
  );
}

/**
 * A component will pop a dialog up. There are a form has ID and Password (optional).
 * Users use this to find a quick game.
 * @param props 
 * @returns 
 */
export default function GameDialog(props: CustomizedModalItemProps) {
  const data = props.item.getData<GameDialogTransferedDataType>();
  const content = data.content
    ? typeof data.content === "function"
      ? data.content()
      : data.content
    : null;

  const handleSubmitOnForm = function(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let target = e.target as HTMLFormElement;
    let result: { [key: string]: any } = {};

    for(let key in data.inputs) {
      result[data.inputs[key].name] = (target[data.inputs[key].name] as HTMLInputElement).value;
    }

    props.close({
      isAgree: true,
      data: result
    });
  }

  return (
    <DialogLayout
      title={
        typeof data.title === "function"
          ? data.title()
          : data.title
      }
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
        { content }
        <form className="flex-box flex-col w-100" onSubmit={handleSubmitOnForm}>
          {
            data.inputs && data.inputs.map(input => (
              <MyInput
                key={input.name}
                name={input.name}
                placeholder={input.placeholder}
                type={input.type}
                replaceClassName={input.replaceClassName}
              />
            ))
          }

          <div className="flex-box jc-space-between mt-2">
            <div>
              <p>Lưu ý:</p>
              {
                data.notes.map(data => (
                  <p key={data}>{data}</p>
                ))
              }
            </div>
            <Button type="submit" extendClassName="ms-1">
              {data.buttonLabel}
            </Button>
          </div>
        </form>
      </div>
    </DialogLayout>
  )
}