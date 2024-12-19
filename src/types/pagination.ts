export type Paginated<T> = {
  page: number;
  size: number;
  total: number;
  data: T[];
};
