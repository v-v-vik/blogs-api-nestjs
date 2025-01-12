import {
  BaseSortablePaginationParams,
  SortDirection,
} from '../../../../core/dto/base.query-params.input-dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum UsersSortBy {
  CreatedAt = 'createdAt',
  Login = 'login',
  Email = 'email',
}

export class GetUsersQueryParams extends BaseSortablePaginationParams<UsersSortBy> {
  @IsEnum(UsersSortBy)
  sortBy: UsersSortBy = UsersSortBy.CreatedAt;
  @IsString()
  @IsOptional()
  searchLoginTerm: string | null = null;
  @IsString()
  @IsOptional()
  searchEmailTerm: string | null = null;
  sortDirection: SortDirection = SortDirection.Desc;
}
