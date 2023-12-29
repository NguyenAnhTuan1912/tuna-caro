// Import layouts
import DialogLayout from "../modal_items/dialog_layout/DialogLayout";

// Import hooks
import { useLangState } from "src/hooks/useLang";

// Import components
import MyInput from "src/components/my_input/MyInput";
import Button from "src/components/button/Button";

// Import types
import { GameDialogLayoutProps } from "src/types/dialog.types";

/**
 * A layout of GameDialog.
 * @param props 
 * @returns 
 */
export default function GameDialogLayout(props: GameDialogLayoutProps) {
  const { langTextJSON } = useLangState();

  const { data, modalItemProps } = props;
  const content = typeof data.content === "function"
    ? data.content()
    : data.content;

  const handleSubmitOnForm = function(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let target = e.target as HTMLFormElement;
    let result: { [key: string]: any } = {};

    for(let key in data.inputs) {
      result[data.inputs[key as any].name] = (target[data.inputs[key as any].name] as HTMLInputElement).value;
    }

    modalItemProps.close({
      isAgree: true,
      data: result
    });
  };

  return (
    <DialogLayout
      title={
        typeof data.title === "function"
          ? data.title()
          : data.title
      }
      close={modalItemProps.close}
      className="p-1"
      style={modalItemProps.utils.getContainerStyle({
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
              <p>{langTextJSON.global.noteLabel}:</p>
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