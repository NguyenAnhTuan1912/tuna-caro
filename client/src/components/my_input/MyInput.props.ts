export interface MyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: JSX.Element | (() => JSX.Element | string) | string,
  labelClassName?: string
  replaceLabelClassName?: string,
  replaceClassName?: string,
  error?: {
    condition: (val: any) => boolean,
    message: string
  }
}