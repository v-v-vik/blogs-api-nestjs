import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { NotFoundDomainException } from '../../../core/exceptions/domain-exceptions';
import { InfoUserViewDto } from '../api/dto/auth/user-info.view-dto';
import { UserViewDto } from '../api/dto/user.view-dto';
import { GetUsersQueryParams } from '../api/dto/get-users-query-params.input-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { UserSQLDto } from '../domain/dto/user.sql-dto';

@Injectable()
export class SQLUsersQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async aboutMeInfo(userId: string) {
    const res = await this.dataSource.query(
      `SELECT *
     FROM public."users"
     WHERE "id" = $1 AND "deletionStatus" = 'not-deleted'`,
      [Number(userId)],
    );
    if (res.length === 0) {
      return null;
    }
    return new InfoUserViewDto(res[0]);
  }

  async findByIdOrNotFoundFail(userId: string) {
    const res = await this.dataSource.query(
      `SELECT *
     FROM public."users"
     WHERE "id" = $1 AND "deletionStatus" = 'not-deleted'`,
      [Number(userId)],
    );
    if (!res.length) {
      throw NotFoundDomainException.create('User not found.');
    }
    return new UserViewDto(res[0]);
  }

  async findAll(
    query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto>> {
    const sortDirection = query.sortDirection.toUpperCase();
    const searchEmail = query.searchEmailTerm
      ? `%${query.searchEmailTerm}%`
      : '%%';
    const searchLogin = query.searchLoginTerm
      ? `%${query.searchLoginTerm}%`
      : '%%';
    const searchResult = await this.dataSource.query(
      `
      SELECT *
        FROM public.users
        WHERE ("email" ILIKE $1 OR "login" ILIKE $2) AND "deletionStatus" = 'not-deleted'
        ORDER BY "${query.sortBy}" ${sortDirection}
        LIMIT ${query.pageSize} OFFSET ${query.calculateSkip()}`,
      [searchEmail, searchLogin],
    );
    console.log(searchResult);
    const items = searchResult.map((user: UserSQLDto) => new UserViewDto(user));
    const totalCount = await this.dataSource.query(
      `SELECT COUNT(*)
       FROM public."users"
       WHERE ("email" ILIKE $1 OR "login" ILIKE $2) AND "deletionStatus" = 'not-deleted'`,
      [searchEmail, searchLogin],
    );
    return PaginatedViewDto.mapToView({
      items,
      totalCount: Number(totalCount[0].count),
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
