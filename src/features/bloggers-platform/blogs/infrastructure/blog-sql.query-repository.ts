import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BlogViewDto } from '../api/dto/blog.view-dto';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { GetBlogsQueryParams } from '../api/dto/get-blogs-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { BlogSQLDto } from '../domain/dto/blog.sql-dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SQLBlogsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findByIdOrNotFoundException(id: string): Promise<BlogViewDto> {
    const res = await this.dataSource.query(
      `SELECT *
     FROM public."blogs"
     WHERE "id" = $1 AND "deletionStatus" = 'not-deleted'`,
      [Number(id)],
    );
    if (!res.length) {
      throw NotFoundDomainException.create('Blog not found.');
    }
    return new BlogViewDto(res[0]);
  }

  async findAll(
    query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    const sortDirection = query.sortDirection.toUpperCase();
    const searchName = query.searchNameTerm
      ? `%${query.searchNameTerm}%`
      : '%%';
    const searchResult = await this.dataSource.query(
      `
      SELECT *
        FROM public."blogs"
        WHERE "name" ILIKE $1 AND "deletionStatus" = 'not-deleted'
        ORDER BY "${query.sortBy}" ${sortDirection}
        LIMIT ${query.pageSize} OFFSET ${query.calculateSkip()}`,
      [searchName],
    );
    const items = searchResult.map((blog: BlogSQLDto) => new BlogViewDto(blog));
    const totalCount = await this.dataSource.query(
      `SELECT COUNT(*)
       FROM public."blogs"
       WHERE "name" ILIKE $1 AND "deletionStatus" = 'not-deleted'`,
      [searchName],
    );
    return PaginatedViewDto.mapToView({
      items,
      totalCount: Number(totalCount[0].count),
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
