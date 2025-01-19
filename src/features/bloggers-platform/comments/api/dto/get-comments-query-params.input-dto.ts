import {
  BaseSortablePaginationParams,
  SortDirection,
} from '../../../../../core/dto/base.query-params.input-dto';
import { IsEnum } from 'class-validator';

export enum CommentsSortBy {
  CreatedAt = 'createdAt',
  Content = 'content',
  MostLiked = 'likesInfo.likesCount',
  LeastLiked = 'likesInfo.dislikesCount',
}

export class GetCommentsQueryParams extends BaseSortablePaginationParams<CommentsSortBy> {
  @IsEnum(CommentsSortBy)
  sortBy: CommentsSortBy = CommentsSortBy.CreatedAt;
  sortDirection: SortDirection = SortDirection.Desc;
}
