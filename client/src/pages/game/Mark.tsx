import React from 'react'

// Import classes
import { Game, MarkType } from 'src/classes/Game';

interface MarkProps {
  mark: MarkType;
  x: number;
  y: number;
  t: number;
}

/**
 * Component is used to render mark O or X depend on what is `mark`.
 * Receive coordinate and `t` constant.
 * @param props 
 * @returns 
 */
export default function Mark(props: MarkProps) {
  if(props.mark === "O") {
    let cx = props.x * props.t + (props.t / 2);
    let cy = props.y * props.t + (props.t / 2);
    return <circle className="o-mark mark" cx={cx} cy={cy} r={props.t / 2 - Game.less} fill="none" stroke="blue" strokeWidth="2"></circle>;
  }

  return (
    <path className="x-mark mark" d={Game.createPathDForX(props.x, props.y, props.t, Game.less)} fill="none" stroke="red" strokeWidth="2" />
  )
}
