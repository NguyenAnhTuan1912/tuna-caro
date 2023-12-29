import React from 'react'

// Import utils
import { OtherUtils } from 'src/utils/other';

// Import types
import { MySelectProps, MyOptionProps } from './MySelect.props'

// Import styles
import './MySelect.styles.css';

function MyOptions(props: MyOptionProps) {
  return React.useMemo(() => {
    return (
      <div
        onClick={() => props.chooseOption(props.value)}
        className="p-1 btn-transparent"
        data-value={props.value}
      >
        {
          OtherUtils.fromCase([
            {
              case: !props.label,
              returnValue: <span>{props.label as string}</span>
            },
            {
              case: typeof props.label === "string",
              returnValue: <span>{props.label as string}</span>
            },
            {
              case: React.isValidElement(props.label),
              returnValue: props.label
            }
          ])
        }
      </div>
    )
  }, [props.label, props.value]);
}

/**
 * This component render a select with multiple choices. A alternative solution for `<select>`.
 * @param props 
 * @returns 
 */
export default function MySelect(props: MySelectProps) {
  const [selectState, setSelectState] = React.useState({
    isExpand: false,
    option: props.options.find(option => option.value === props.defaultValue),
    placeHolder: props.placeHolder
  });
  const storedData = React.useRef({
    prevOptions: selectState.option
  });

  const changeableStoredData = React.useMemo(() => {
    return {
      placeHolder: OtherUtils.fromCase([
        {
          case: Boolean(selectState.option),
          returnValue: () => <strong>{selectState.option!.label}</strong>
        },
        {
          case: !selectState.placeHolder,
          returnValue: <strong>Select option.</strong>
        },
        {
          case: typeof selectState.placeHolder === "string",
          returnValue: <strong>{selectState.placeHolder as string}</strong>
        },
        {
          case: React.isValidElement(selectState.placeHolder),
          returnValue: selectState.placeHolder
        }
      ]),
      options: (
        <div className="options-container outline">
          {
            props.options.map(option => (
              <MyOptions
                key={option.value}
                {...option}
                chooseOption={() => {
                  setSelectState(prevState => ({ ...prevState, option }));
                }}
              />
            ))
          }
        </div>
      )
    }
  }, [selectState.placeHolder, selectState.option]);

  React.useEffect(() => {
    if(storedData.current.prevOptions !== selectState.option) {
      if(selectState.option &&  props.onChangeValue) props.onChangeValue(selectState.option?.value);
      storedData.current.prevOptions = selectState.option;
    }
  }, [selectState.isExpand, selectState.option]);

  return (
    <div
      onClick={() => { setSelectState(prevState => ({ ...prevState, isExpand: !prevState.isExpand })) }}
      className="select-container outline btn-transparent p-1"
    >
      <div className="select-placeholder">
        {changeableStoredData.placeHolder}
      </div>
      <span className="material-symbols-outlined ms-1">
        {selectState.isExpand ? "expand_less" : "expand_more"}
      </span>
      {selectState.isExpand && changeableStoredData.options}
    </div>
  )
}