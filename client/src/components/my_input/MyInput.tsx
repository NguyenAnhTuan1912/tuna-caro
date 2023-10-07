import React from 'react'

import { StringUtils } from 'src/utils/string';

import { MyInputProps } from './MyInput.props'

/**
 * This Component use to render HTML Input Element.
 * @param props 
 * @returns 
 */
export default function MyInput({
  label,
  error,
  replaceClassName,
  ...props
}: MyInputProps) {
  const [ inputState, setInputState ] = React.useState({
    isError: Boolean(error)
  });

  let labelClassName = StringUtils.concate(props.replaceLabelClassName ?? "label-input", [ props.labelClassName ]);
  let inputClassName = StringUtils.concate(replaceClassName ?? "my-input", [ props.className ]);

  if(error) {
    props.onChange = (e) => {
      setInputState(prevState => {
        return {...prevState, isError: error.condition(e.target.value)}
      });
    }
  }

  return (
    <label className={labelClassName}>
      {
        (typeof label === "string")
          ? <span>{label}</span>
          : (typeof label === "function")
            ? label()
            : label
      }
      <input {...props} className={inputClassName} />
      { inputState.isError && <p className="txt-clr-error">{error!.message}</p> }
    </label>
  )
}
