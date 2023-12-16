type RenderItemFn<T> = (item: T, index: number) => JSX.Element;
type ExtractKeyFn<T> = (item: T, index: number) => string;

export type ListChildElementRefsType = {
  list: HTMLDivElement | null;
  content: HTMLDivElement | null;
};

export type ListInternalDataType = {
  listHeight: number;
  contentHeight: number;
};

export type ListProps<T> = {
  data: Array<T>;
  renderItem: RenderItemFn<T>;
  extractKey: ExtractKeyFn<T>;
  onReachBottom?: () => void;
};

export type LazyListProps<T> = {
  numberOfItems: number;
  getListDataAsync: (skip: number) => Promise<Array<T>>;
  renderItem: RenderItemFn<T>;
  extractKey: ExtractKeyFn<T>;
};