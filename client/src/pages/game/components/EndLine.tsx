// Import classes
import { Game, Coordinate } from 'src/classes/Game';

interface EndLineProps {
  from: Coordinate;
  to: Coordinate;
}

/**
 * Component is used to render the end line of game when game has winner.
 * Receive 2 coordinates, `from` and `to`, to draw.
 * @param props 
 * @returns 
 */
export default function EndLine(props: EndLineProps) {
  let firstPoint = `${props.from.x * Game.t},${props.from.y * Game.t}`;
  let secondPoint = `${props.to.x * Game.t},${props.to.y * Game.t}`;

  return (
    <path className="end-line mark" d={`M ${firstPoint} L ${secondPoint}`} fill="none" strokeWidth="2" />
  )
}