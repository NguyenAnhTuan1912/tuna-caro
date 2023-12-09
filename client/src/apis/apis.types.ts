export type HTTPResponse<T> = {
  isError: boolean;
  code: number;
  data: T;
}

export type RequestOptions = {
  query: Record<string, string>
};