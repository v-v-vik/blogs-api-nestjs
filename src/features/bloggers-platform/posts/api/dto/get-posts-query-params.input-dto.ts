import {
  BaseSortablePaginationParams,
  SortDirection,
} from '../../../../../core/dto/base.query-params.input-dto';
import { IsEnum } from 'class-validator';

export enum PostsSortBy {
  CreatedAt = 'createdAt',
  Title = 'title',
}

export class GetPostsQueryParams extends BaseSortablePaginationParams<PostsSortBy> {
  @IsEnum(PostsSortBy)
  sortBy: PostsSortBy = PostsSortBy.CreatedAt;
  sortDirection: SortDirection = SortDirection.Desc;
}
