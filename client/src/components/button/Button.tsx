import React from 'react';
import { Link } from 'react-router-dom';

// Import from classes
import { SFXPathsType } from 'src/classes/SoundEffects';

// Import from hooks
import { useSFX } from 'src/hooks/useSFX';

// Import from utils
import { OtherUtils } from 'src/utils/other';
import { StringUtils } from 'src/utils/string';

interface ButtonPropsType extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  to?: string;
  soundName?: SFXPathsType;
  isTransparent?: boolean;
  hasPadding?: boolean;
  extendClassName?: string;
}

/**
 * Component will render a button.
 * @returns 
 */
export default function Button({
  to,
  hasPadding = true,
  isTransparent = false,
  soundName = "buttonClickSound",
  extendClassName,
  onClick,
  ...props
}: ButtonPropsType) {
  // Concatenate the root class name with the extend class name.
  const className = OtherUtils.fromCase([
    {
      case: isTransparent,
      returnValue: "btn-transparent no-outline center-box"
    },
    {
      case: !hasPadding,
      returnValue: "btn-no-padd no-outline center-box"
    },
    {
      case: true,
      returnValue: "btn spe-outline center-box"
    }
  ]) + " " + extendClassName;

  const sfx = useSFX();

  if(to) {
    return (
      <Link
        onClick={() => sfx.play(soundName)}
        to={to}
      >
        <button
          {...props}
          className={className}
        >
          { props.children }
        </button>
      </Link>
    )
  }

  return (
    <button
      {...props}
      onClick={
        onClick
          ? function(e) {
              sfx.play(soundName);
              onClick(e);
            }
          : undefined
      }
      className={className}
    >
      { props.children }
    </button>
  )
}