import React from 'react'

// Import classes
import { Game } from 'src/classes/Game';

// Import utils
import { NumberUtils } from 'src/utils/number';

// Import types
import { GridProps, GridBehaviorFns } from './Grid.props'

// Import styles
import './Grid.styles.css';

interface GridElementsType {
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
function getGridElementsAttr(elements: GridElementsType) {
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
function zoom(elements: GridElementsType, squareSize: number, s: number, options?: ZoomOptions) {
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
 * Use to scale a `element` with initial `value` and a `limit` function. If this element can scale, then return
 * new scaleValue, if not, return old value.
 * @param element 
 * @param value 
 * @param limit 
 * @returns 
 */
function scale<T extends HTMLElement>(element: T, value: number, limit: (value: number) => boolean, scaleValue: number) {
  scaleValue = scaleValue ? scaleValue : getScaleValue(element);
  if(limit(scaleValue)) {
    scaleValue = NumberUtils.roundTo(scaleValue + value);
    element.style.setProperty("transform", `scale(${scaleValue})`);
    return scaleValue;
  }
  return scaleValue;
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
 * Use to scroll to 
 * @param wrapper 
 * @param insideBox 
 * @param scaleValue 
 */
function scrollToCenter(wrapper: HTMLElement, insideBox: HTMLElement, scaleValue: number = 1) {
  let wrapperHeight = wrapper.offsetHeight;
  let wrapperWidth = wrapper.offsetWidth;
  let h = insideBox.offsetHeight;
  let w = insideBox.offsetWidth;
  let t = (h * scaleValue - wrapperHeight) / 2;
  let l = (w * scaleValue - wrapperWidth) / 2;

  wrapper.scrollTo({ top: t, left: l });
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
  const elementRefs = React.useRef<GridElementsType>({
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
    t: Game.t,
    /**
     * `s` is a constant that is used to defined "How many squares in a big square?".
     */
    s: 5,
    maxT: 70,
    minT: 30,
    /**
     * Max scalable value of GridWrapper
     */
    maxSVOGridWrapper: 2,
    /**
     * Min scalable value of GridWrapper
     */
    minSVOGridWrapper: 1,
    /**
     * Center X of Scrollable
     */
    centerXOfScrollable: 0,
    /**
     * Center Y of Scrollable
     */
    centerYOfScrollable: 0,
    isMouseDown: false,
    isSpaceDown: false,
    /**
     * Original scroll height of grid
     */
    originalScrollHGrid: 0,
    /**
     * Original scroll width of grid
     */
    originalScrollWGrid: 0,
    /**
     * Current scale value of Grid Wrapper.
     */
    currentScaleValue: 1,
    /**
     * Height of header
     */
    headerHeight: 0
  });

  /**
   * This object contains some behavior functions like `zoomIn`, `zoomOut`.
   */
  const behaviorFns: GridBehaviorFns = React.useMemo(() => {
    return {
      zoomIn: function() {
        gridData.current.currentScaleValue = scale(
          elementRefs.current.gridWrapper!,
          0.1,
          (val) => val < gridData.current.maxSVOGridWrapper,
          gridData.current.currentScaleValue
        );
        scrollToCenter(elementRefs.current.gridBase!, elementRefs.current.gridWrapper!, gridData.current.currentScaleValue);
      },
      zoomOut: function() {
        gridData.current.currentScaleValue = scale(
          elementRefs.current.gridWrapper!,
          -(0.1),
          (val) => val > gridData.current.minSVOGridWrapper,
          gridData.current.currentScaleValue
        );
        scrollToCenter(elementRefs.current.gridBase!, elementRefs.current.gridWrapper!, gridData.current.currentScaleValue);
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
          let clientX = e.clientX;
          let clientY = e.clientY;
          let dx = centerXOfGrid - clientX;
          let dy = centerYOfGrid - clientY;

          elementRefs.current.gridBase?.scroll({ top: dy, left: dx });
        }
      },

      handleKeydownOnGridBase: function(e: KeyboardEvent) {
        if(e.key === " " && e.target === document.body) {
          e.preventDefault();
          elementRefs.current.grid!.style.cursor = "grab";
          gridData.current.isSpaceDown = true;
        }
      },

      handleKeyupOnGridBase: function(e: KeyboardEvent) {
        if(e.key === " " && e.target === document.body) {
          e.preventDefault();
          elementRefs.current.grid!.style.cursor = "pointer";
          gridData.current.isSpaceDown = false;
        }
      }
    }
  }, []);

  // TO DO: Process all the behaviour in here.
  React.useEffect(() => {
    let boundingRectOfGrid = elementRefs.current.grid?.getBoundingClientRect();
    // Set some values
    if(!gridData.current.centerXOfScrollable) {
      gridData.current.centerXOfScrollable = (elementRefs.current.gridWrapper?.offsetWidth! - window.innerWidth) / 2;
    }

    if(!gridData.current.centerYOfScrollable) {
      gridData.current.centerYOfScrollable = (elementRefs.current.gridWrapper?.offsetHeight! - window.innerHeight) / 2;
    }

    if(!gridData.current.originalScrollWGrid) {
      gridData.current.originalScrollWGrid = boundingRectOfGrid?.width!;
    }

    if(!gridData.current.originalScrollHGrid) {
      gridData.current.originalScrollHGrid = boundingRectOfGrid?.height!;
    }

    if(!gridData.current.headerHeight) {
      gridData.current.headerHeight = document.getElementById("app-header")?.offsetHeight!;
    }

    scrollToCenter(elementRefs.current.gridBase!, elementRefs.current.gridWrapper!);

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
          id="grid"
          width={width}
          height={height}
          xmlns="http://www.w3.org/2000/svg"
          onClick={(e) => {
            if(gridData.current.isSpaceDown) return;
            // let headerHeight = document.getElementById("app-header")?.offsetHeight!;
            let clientX = e.clientX;
            let clientY = e.clientY;
            let scrolledX = elementRefs.current.gridBase?.scrollLeft;
            let scrolledY = elementRefs.current.gridBase?.scrollTop;
            let coorX = NumberUtils.roundTo((clientX + scrolledX!) / gridData.current.currentScaleValue);
            let coorY = NumberUtils.roundTo((clientY + scrolledY!) / gridData.current.currentScaleValue);
            let unitCoorX = Math.floor(coorX / gridData.current.t);
            let unitCoorY = Math.floor(coorY / gridData.current.t);

            props.emitCoordinate(unitCoorX, unitCoorY, gridData.current.t);
          }}
        >
          {/* Static element */}
          <defs>
            <pattern
              ref={ref => elementRefs.current.square = ref}
              id="square" width={squareSize} height={squareSize} patternUnits="userSpaceOnUse"
            >
              <path
                ref={ref => elementRefs.current.squarePath = ref}
                d={getCoordinateForSimplePath(squareSize)} fill="none" strokeWidth="0.5"
              />
            </pattern>
            <pattern
              ref={ref => elementRefs.current.bigSquare = ref}
              id="bigSquare" width={bigSquareSize} height={bigSquareSize} patternUnits="userSpaceOnUse"
            >
              <path
                ref={ref => elementRefs.current.bigSquarePath = ref}
                d={getCoordinateForSimplePath(bigSquareSize)} fill="none" strokeWidth="0.5"
              />
              <rect
                ref={ref => elementRefs.current.bigSquareRect = ref}
                width={bigSquareSize} height={bigSquareSize} fill="url(#square)"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bigSquare)" />
          {/* X and O will go here */}
          { props.renderSVGElements && props.renderSVGElements() }
        </svg>
      </div>
      { props.renderItem && props.renderItem(behaviorFns) }
    </div>
  )
}