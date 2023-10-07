export interface HTTPResponse<T> {
  isError: boolean;
  code: number;
  data: T;
}