export type MySelectOption = {
  label?: string | JSX.Element,
  value: string
}

export type MyOptionProps =
  MySelectOption
  & {
    chooseOption: (value: string) => void
  }

export type MySelectProps = {
  placeHolder?: string | JSX.Element | (() => string | JSX.Element),
  options: Array<MySelectOption>,
  defaultValue?: string,
  onChangeValue: (value: string) => void
}