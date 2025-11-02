export interface IPaginateRes<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    nextPage: boolean;
    prevPage: boolean;
  };
}
