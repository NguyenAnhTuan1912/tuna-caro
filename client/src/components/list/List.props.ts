type RenderItemFn<T> = (item: T, index: number) => JSX.Element;

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
  maxHeight: string | number;
  renderItem: RenderItemFn<T>;
  onReachBottom?: (scrollTop: number) => void;
};

export type LazyListProps<T> = {
  limit: number;
  loadMoreBtnLabel: string;
  maxHeight: string | number;
  getListDataAsync: (skip: number) => Promise<Array<T>>;
  renderItem: RenderItemFn<T>;
};