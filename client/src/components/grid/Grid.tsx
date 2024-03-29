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

/**
 * Use to get coordinate to draw a simple path.
 * @param a 
 * @returns 
 */
function getCoordinateForSimplePath(a: number) {
  return `M ${a} 0 L 0 0 0 ${a}`;
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
    headerHeight: 0,
    /**
     * The `x` value in coordinate of cursor on Grid.
     */
    rootX: 0,
    /**
     * The `y` value in coordinate of cursor on Grid.
     */
    rootY: 0
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
      /**
       * This function will process the `mouse down` event. When the LMB is down, operate something.
       * @param e 
       */
      handleMouseDownOnGridBase: function() {
        gridData.current.isMouseDown = true;
      },

      /**
       * This function will process the `mouse up` event. When the LMB is up, operate something.
       * @param e 
       */
      handleMouseUpOnGridBase: function() {
        // Set the root X and Y to 0 respectively when LMB is up.
        gridData.current.rootX = 0;
        gridData.current.rootY = 0;
        gridData.current.isMouseDown = false;
      },

      /**
       * This function will process the `drag action` of user when they hold `space + LMB` and move the mouse.
       * The core idea is change the scroll value of container that has `overflow attribute` and contains grid.
       * @param e 
       */
      handleMouseMoveOnGridBase: function(e: MouseEvent) {
        if(gridData.current.isMouseDown && gridData.current.isSpaceDown) {
          if(gridData.current.rootX === 0)
            gridData.current.rootX = e.clientX + elementRefs.current.gridBase?.scrollLeft!;
          if(gridData.current.rootY === 0)
            gridData.current.rootY = e.clientY + elementRefs.current.gridBase?.scrollTop!;

          let clientX = e.clientX;
          let clientY = e.clientY;

          let dx = gridData.current.rootX - clientX;
          let dy = gridData.current.rootY - clientY;

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
            let gridBaseBCRect = elementRefs.current.gridBase?.getBoundingClientRect()!;
            let clientX = e.clientX;
            let clientY = e.clientY;
            let scrolledX = elementRefs.current.gridBase?.scrollLeft;
            let scrolledY = elementRefs.current.gridBase?.scrollTop;
            let coorX = NumberUtils.roundTo((clientX + scrolledX! - gridBaseBCRect.x) / gridData.current.currentScaleValue);
            let coorY = NumberUtils.roundTo((clientY + scrolledY! - gridBaseBCRect.y) / gridData.current.currentScaleValue);
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