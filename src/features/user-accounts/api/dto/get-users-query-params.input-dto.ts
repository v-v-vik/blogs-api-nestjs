import {
  BaseSortablePaginationParams,
  SortDirection,
} from '../../../../core/dto/base.query-params.input-dto';

export enum UsersSortBy {
  CreatedAt = 'createdAt',
  Login = 'login',
  Email = 'email',
}

export class GetUsersQueryParams extends BaseSortablePaginationParams<UsersSortBy> {
  sortBy: UsersSortBy = UsersSortBy.CreatedAt;
  searchLoginTerm: string | null = null;
  searchEmailTerm: string | null = null;
  sortDirection: SortDirection = SortDirection.Desc;
}
