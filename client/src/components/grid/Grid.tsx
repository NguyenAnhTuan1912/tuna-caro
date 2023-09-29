import React from 'react'

// Import types
import { GridProps, GridBehaviorFns } from './Grid.props'

// Import styles
import './Grid.styles.css';

interface GridElements {
  container: SVGSVGElement | null,
  square: SVGPatternElement | null,
  bigSquare: SVGPatternElement | null,
  squarePath: SVGPathElement | null,
  bigSquarePath: SVGPathElement | null,
  bigSquareRect: SVGRectElement | null
}

interface ZoomOptions {
  behavior: "in" | "out";
  step?: number;
}

/**
 * Use to get necessary information of grid elements
 * @param elements 
 * @returns 
 */
function getGridElementsAttr(elements: GridElements) {
  const squareSize = parseInt(elements.square!.getAttribute("width")!);
  const bigSquareSize = parseInt(elements.bigSquare!.getAttribute("width")!);

  return { squareSize, bigSquareSize }
}

/**
 * Use to get coordinate to draw a simple path.
 * @param a 
 * @returns 
 */
function getCoordinateForSimplePath(a: number) {
  return `M ${a} 0 L 0 0 0 ${a}`;
}

/**
 * Use to zoom a grid. This function only need `squareSize` because it's a root variable that can
 * change other parameters like bigSquareSize, path coordinate of square and big square.
 * @param elements 
 * @param squareSize 
 * @param s
 * @param options
 */
function zoom(elements: GridElements, squareSize: number, s: number, options?: ZoomOptions) {
  options = Object.assign({
    step: 10
  }, options);

  let newSquareSize = options.behavior === "in"
    ? squareSize + options.step!
    : squareSize - options.step!;
  let newBigSquareSize = newSquareSize * s;

  elements.square?.setAttribute("width", `${newSquareSize}`);
  elements.square?.setAttribute("height", `${newSquareSize}`);

  elements.bigSquare?.setAttribute("width", `${newBigSquareSize}`);
  elements.bigSquare?.setAttribute("height", `${newBigSquareSize}`);

  elements.squarePath?.setAttribute("d", getCoordinateForSimplePath(newSquareSize));

  elements.bigSquarePath?.setAttribute("d", getCoordinateForSimplePath(newBigSquareSize));

  elements.bigSquareRect?.setAttribute("width", `${newBigSquareSize}`);
  elements.bigSquareRect?.setAttribute("height", `${newBigSquareSize}`);
}

/**
 * This component render a infinite vector grid. Support zoom in - out.
 * @param props 
 * @returns 
 */
export default function Grid({
  width = "100%",
  height = "100vh",
  ...props
}: GridProps) {
  const elementRefs = React.useRef<GridElements>({
    container: null,
    square: null,
    bigSquare: null,
    squarePath: null,
    bigSquarePath: null,
    bigSquareRect: null
  });

  const gridData = React.useRef({
    /**
     * `t` is a variable that is used to define "How big is a square?".
     */
    t: 60,
    /**
     * `s` is a constant that is used to defined "How many squares in a big square?".
     */
    s: 5,
    maxT: 70,
    minT: 30
  });

  const behaviorFns: GridBehaviorFns = React.useMemo(() => {
    return {
      zoomIn: function() {
        const { squareSize } = getGridElementsAttr(elementRefs.current);
        if(squareSize < gridData.current.maxT) zoom(elementRefs.current, squareSize, gridData.current.s, { behavior: "in" });
      },
      zoomOut: function() {
        const { squareSize } = getGridElementsAttr(elementRefs.current);
        if(squareSize > gridData.current.minT) zoom(elementRefs.current, squareSize, gridData.current.s, { behavior: "out" });
      }
    }
  }, []);

  // TO DO: Process all the behaviour in here.
  React.useEffect(() => {
  }, []);

  const squareSize = gridData.current.t;
  const bigSquareSize = gridData.current.t * gridData.current.s;

  return (
    <>
      <svg
        ref={ref => elementRefs.current.container = ref}
        id="gridContainer"
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            ref={ref => elementRefs.current.square = ref}
            id="square" width={squareSize} height={squareSize} patternUnits="userSpaceOnUse"
          >
            <path
              ref={ref => elementRefs.current.squarePath = ref}
              d={getCoordinateForSimplePath(squareSize)} fill="none" stroke="gray" strokeWidth="0.5"
            />
          </pattern>
          <pattern
            ref={ref => elementRefs.current.bigSquare = ref}
            id="bigSquare" width={bigSquareSize} height={bigSquareSize} patternUnits="userSpaceOnUse"
          >
            <path
              ref={ref => elementRefs.current.bigSquarePath = ref}
              d={getCoordinateForSimplePath(bigSquareSize)} fill="none" stroke="gray" strokeWidth="0.5"
            />
            <rect
              ref={ref => elementRefs.current.bigSquareRect = ref}
              width={bigSquareSize} height={bigSquareSize} fill="url(#square)"
            />
          </pattern>
        </defs>
            
        <rect width="100%" height="100%" fill="url(#bigSquare)" />
      </svg>
      { props.renderItem && props.renderItem(behaviorFns) }
    </>
  )
}