export interface MySelectOption {
  label?: string | JSX.Element,
  value: string
}

export interface MyOptionProps extends MySelectOption {
  chooseOption: (value: string) => void
}

export interface MySelectProps {
  placeHolder?: string | JSX.Element | (() => string | JSX.Element),
  options: Array<MySelectOption>,
  defaultValue?: string,
  onChangeValue: (value: string) => void
}