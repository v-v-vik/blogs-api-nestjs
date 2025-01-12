import {
  BaseSortablePaginationParams,
  SortDirection,
} from '../../../../../core/dto/base.query-params.input-dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum BlogsSortBy {
  CreatedAt = 'createdAt',
  Name = 'name',
}

export class GetBlogsQueryParams extends BaseSortablePaginationParams<BlogsSortBy> {
  @IsEnum(BlogsSortBy)
  sortBy: BlogsSortBy = BlogsSortBy.CreatedAt;
  @IsString()
  @IsOptional()
  searchNameTerm: string | null = null;
  sortDirection: SortDirection = SortDirection.Desc;
}
