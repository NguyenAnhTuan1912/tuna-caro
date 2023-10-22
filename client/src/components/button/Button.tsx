import React from 'react';
import { Link } from 'react-router-dom';

// Import from classes
import { sfx, SFXPathsType } from 'src/classes/SoundEffects';

// Import from utils
import { StringUtils } from 'src/utils/string';

interface ButtonPropsType extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  to?: string;
  soundName?: SFXPathsType;
  isTransparent?: boolean;
  extendClassName?: string;
}

/**
 * Component will render a button.
 * @returns 
 */
export default function Button({
  to,
  isTransparent = false,
  soundName = "buttonClickSound",
  extendClassName,
  onClick,
  ...props
}: ButtonPropsType) {
  // Concatenate the root class name with the extend class name.
  const className = StringUtils.concate(
    isTransparent ? "btn-transparent no-outline center-box p-1" : "btn spe-outline center-box", extendClassName
  );

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