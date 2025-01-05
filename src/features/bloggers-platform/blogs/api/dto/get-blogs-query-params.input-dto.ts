import {
  BaseSortablePaginationParams,
  SortDirection,
} from '../../../../../core/dto/base.query-params.input-dto';

export enum BlogsSortBy {
  CreatedAt = 'createdAt',
  Name = 'name',
}

export class GetBlogsQueryParams extends BaseSortablePaginationParams<BlogsSortBy> {
  sortBy: BlogsSortBy = BlogsSortBy.CreatedAt;
  searchNameTerm: string | null = null;
  sortDirection: SortDirection = SortDirection.Desc;
}
