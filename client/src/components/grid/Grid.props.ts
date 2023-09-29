export interface GridBehaviorFns {
  zoomIn: () => void;
  zoomOut: () => void;
}

export interface GridProps {
  width?: string | number,
  height?: string | number,
  renderItem?: (beh: GridBehaviorFns) => JSX.Element;
}