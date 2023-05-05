export interface PaginationQueryParams {
  limit?: number;
  offset?: number;
}

export interface SearchQueryParams extends PaginationQueryParams {
  search?: string;
}

export interface BookQueryParams extends SearchQueryParams {
  sort?: string;
  order?: string;
  disabled?: boolean;
}

export interface GenreQueryParams extends BookQueryParams {
  genre?: string;
  disabled?: boolean;
}

export interface VerifiedParams extends PaginationQueryParams {
  disabled?: boolean;
  search?: string;
  role?: string;
}
