import React from 'react';

// Import utils
import { StringUtils } from 'src/utils/string';

// Import types
import { MyInputProps } from './MyInput.props';

// Import styles
import './MyInput.styles.css';

/**
 * This Component use to render HTML Input Element.
 * @param props 
 * @returns 
 */
const MyInput = React.forwardRef<HTMLInputElement, MyInputProps>((
  {
    label,
    error,
    replaceClassName,
    ...props
  },
  ref
) => {
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
      <input
        ref={ref}
        {...props}
        className={inputClassName}
      />
      { inputState.isError && <p className="txt-clr-error">{error!.message}</p> }
    </label>
  )
})

export default MyInput;