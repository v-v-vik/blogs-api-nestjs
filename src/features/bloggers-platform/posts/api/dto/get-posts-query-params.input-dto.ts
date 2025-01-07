import {
  BaseSortablePaginationParams,
  SortDirection,
} from '../../../../../core/dto/base.query-params.input-dto';

export enum PostsSortBy {
  CreatedAt = 'createdAt',
  Title = 'title',
}

export class GetPostsQueryParams extends BaseSortablePaginationParams<PostsSortBy> {
  sortBy: PostsSortBy = PostsSortBy.CreatedAt;
  sortDirection: SortDirection = SortDirection.Desc;
}
