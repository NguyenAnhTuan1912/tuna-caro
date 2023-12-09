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
  hasBorder?: boolean;
  extendClassName?: string;
}

/**
 * Component will render a button.
 * @returns 
 */
export default function Button({
  to,
  hasPadding = true,
  hasBorder = true,
  isTransparent = false,
  soundName = "buttonClickSound",
  extendClassName,
  onClick,
  ...props
}: ButtonPropsType) {
  // Concatenate the root class name with the extend class name.
  let className = "center-box";

  // Border
  if(hasBorder) className += " spe-outline";
  else className += " no-outline";

  // Transparent
  if(isTransparent) className += " btn-transparent";

  // Padding
  if(!hasPadding) className += " btn-no-padd";
  else className += " btn";
  

  // Extend class name
  if(extendClassName) className += " " + extendClassName;

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