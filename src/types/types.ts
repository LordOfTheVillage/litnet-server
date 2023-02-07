export interface PaginationQueryParams {
  limit?: number;
  offset?: number;
}

export interface BookQueryParams extends PaginationQueryParams {
  sort?: string;
  order?: string;
}

export interface GenreQueryParams extends BookQueryParams {
  genre?: string;
}
