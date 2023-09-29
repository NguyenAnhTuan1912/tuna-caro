export interface DataTableProps<T> {
  maxRows?: number,
  data: Array<T>;
  renderHeader: () => JSX.Element
  renderRowData: (piece: T, index: number) => JSX.Element
}