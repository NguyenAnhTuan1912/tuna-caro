export interface GridBehaviorFns {
  zoomIn: () => void;
  zoomOut: () => void;
}

export interface GridProps {
  /**
   * Width of grid
   */
  width?: string | number,
  /**
   * Height of grid
   */
  height?: string | number,
  /**
   * Use to render item inside grid.
   * @param beh 
   * @returns 
   */
  renderItem?: (beh: GridBehaviorFns) => JSX.Element;
  /**
   * Use to render element inside SVG element.
   * @returns 
   */
  renderSVGElements?: () => Array<JSX.Element>;
  /**
   * Get coordinate (x, y) from grid when click and size of square.
   * @param x 
   * @param y 
   * @param t 
   * @returns 
   */
  emitCoordinate: (x: number, y: number, t: number) => void;
}