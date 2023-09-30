import React from 'react'

// Import types
import { GridProps, GridBehaviorFns } from './Grid.props'

// Import styles
import './Grid.styles.css';

interface GridElements {
  grid: SVGSVGElement | null,
  square: SVGPatternElement | null,
  bigSquare: SVGPatternElement | null,
  squarePath: SVGPathElement | null,
  bigSquarePath: SVGPathElement | null,
  bigSquareRect: SVGRectElement | null,
  gridBase: HTMLDivElement | null,
  gridWrapper: HTMLDivElement | null
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
 * __Old Solution__
 * 
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

function scale<T extends HTMLElement>(element: T, value: number, limit: (value: number) => boolean) {
  const scaleValue = getScaleValue(element);
  if(limit(scaleValue))
    element.style.setProperty("transform", `scale(${scaleValue + value})`);
}

/**
 * Use to get scale value of `element`.
 * @param element 
 */
function getScaleValue<T extends HTMLElement>(element: T) {
  const baseClientRect = element.getBoundingClientRect();
  const baseOffSetWidth = element.offsetWidth;
  const scaleValue = baseClientRect!.width / baseOffSetWidth!;

  return scaleValue;
}

/**
 * This component render a infinite vector grid. Support zoom in - out.
 * @param props 
 * @returns 
 */
export default function Grid({
  width = "100%",
  height = "100%",
  ...props
}: GridProps) {
  const elementRefs = React.useRef<GridElements>({
    grid: null,
    square: null,
    bigSquare: null,
    squarePath: null,
    bigSquarePath: null,
    bigSquareRect: null,
    gridBase: null,
    gridWrapper: null
  });

  const gridData = React.useRef({
    /**
     * `t` is a variable that is used to define "How big is a square?".
     */
    t: 30,
    /**
     * `s` is a constant that is used to defined "How many squares in a big square?".
     */
    s: 5,
    maxT: 70,
    minT: 30,
    maxSVOGridWrapper: 2,
    minSVOGridWrapper: 1,
    centerXOfScrollable: 0,
    centerYOfScrollable: 0,
    isMouseDown: false,
    isSpaceDown: false
  });

  /**
   * This object contains some behavior functions like `zoomIn`, `zoomOut`.
   */
  const behaviorFns: GridBehaviorFns = React.useMemo(() => {
    return {
      zoomIn: function() {
        scale(elementRefs.current.gridWrapper!, 0.1, (val) => val < gridData.current.maxSVOGridWrapper);
      },
      zoomOut: function() {
        scale(elementRefs.current.gridWrapper!, -(0.1), (val) => val > gridData.current.minSVOGridWrapper);
      }
    }
  }, []);

  /**
   * This object contains all event handler to perform "drag to scroll".
   */
  const eventHandlers = React.useMemo(() => {
    return {
      handleMouseDownOnGridBase: function(e: MouseEvent) {
        gridData.current.isMouseDown = true;
      },

      handleMouseUpOnGridBase: function(e: MouseEvent) {
        gridData.current.isMouseDown = false;
      },

      handleMouseMoveOnGridBase: function(e: MouseEvent) {
        if(gridData.current.isMouseDown && gridData.current.isSpaceDown) {
          let centerXOfGrid = (elementRefs.current.gridWrapper!.offsetWidth) / 2;
          let centerYOfGrid = (elementRefs.current.gridWrapper!.offsetHeight) / 2;
          let centerX = e.pageX - window.scrollX;
          let centerY = e.pageY - window.scrollY;
          let dx = centerXOfGrid - centerX;
          let dy = centerYOfGrid - centerY;
          elementRefs.current.gridBase?.scroll({ top: dy, left: dx });
        }
      },

      handleKeydownOnGridBase: function(e: KeyboardEvent) {
        if(e.key === " " && e.target === document.body) {
          e.preventDefault();
          gridData.current.isSpaceDown = true;
        }
      },

      handleKeyupOnGridBase: function(e: KeyboardEvent) {
        if(e.key === " " && e.target === document.body) {
          e.preventDefault();
          gridData.current.isSpaceDown = false;
        }
      }
    }
  }, []);

  // TO DO: Process all the behaviour in here.
  React.useEffect(() => {
    if(!gridData.current.centerXOfScrollable) {
      gridData.current.centerXOfScrollable = (elementRefs.current.gridWrapper?.offsetWidth! - window.innerWidth) / 2;
    }

    if(!gridData.current.centerYOfScrollable) {
      gridData.current.centerYOfScrollable = (elementRefs.current.gridWrapper?.offsetHeight! - window.innerHeight) / 2;
    }

    // Initially scroll to center of grid.
    elementRefs.current.gridBase?.scrollTo({
      top: gridData.current.centerYOfScrollable,
      left: gridData.current.centerXOfScrollable
    });

    // Register event handlers
    document.body.addEventListener("keydown", eventHandlers.handleKeydownOnGridBase);
    document.body.addEventListener("keyup", eventHandlers.handleKeyupOnGridBase);
    document.body.addEventListener("mousedown", eventHandlers.handleMouseDownOnGridBase);
    document.body.addEventListener("mouseup", eventHandlers.handleMouseUpOnGridBase);
    document.body.addEventListener("mousemove", eventHandlers.handleMouseMoveOnGridBase);

    return function() {
      // Unregister event handlers
      document.body.removeEventListener("keydown", eventHandlers.handleKeydownOnGridBase);
      document.body.removeEventListener("keyup", eventHandlers.handleKeyupOnGridBase);
      document.body.removeEventListener("mousedown", eventHandlers.handleMouseDownOnGridBase);
      document.body.removeEventListener("mouseup", eventHandlers.handleMouseUpOnGridBase);
      document.body.removeEventListener("mousemove", eventHandlers.handleMouseMoveOnGridBase);
    }
  }, []);

  const squareSize = gridData.current.t;
  const bigSquareSize = gridData.current.t * gridData.current.s;

  return (
    <div
      ref={ref => elementRefs.current.gridBase = ref}
      className="grid-base"
    >
      <div ref={ref => elementRefs.current.gridWrapper = ref} className="grid-wrapper">
        <svg
          ref={ref => elementRefs.current.grid = ref}
          id="gridContainer"
          width={width}
          height={height}
          xmlns="http://www.w3.org/2000/svg"
          onClick={(e) => {
          }}
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
          {/* Test */}
          <path
            d="M 1515, 1515
            m 15, 0
            a 15,15 0 1,0 -30,0
            a 15,15 0 1,0  30,0
            M 405, 405
            m 15, 0
            a 15,15 0 1,0 -30,0
            a 15,15 0 1,0  30,0
            "
            stroke="red"
            strokeWidth="2"
            fill="none"
          />
          <rect width="100%" height="100%" fill="url(#bigSquare)" />
        </svg>
      </div>
      { props.renderItem && props.renderItem(behaviorFns) }
    </div>
  )
}