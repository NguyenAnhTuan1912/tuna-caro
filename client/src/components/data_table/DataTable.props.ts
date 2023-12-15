export type DataTableProps<T> = {
  maxRows?: number,
  data: Array<T>;
  renderHeader: () => JSX.Element;
  renderRowData: (piece: T, index: number) => JSX.Element;
  getDataAsync?: () => Promise<Array<T>>;
}