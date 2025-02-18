import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { GetCommentsQueryParams } from '../api/dto/get-comments-query-params.input-dto';
import { LikeStatus } from '../../likes/domain/like.entity';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { CommentViewDto } from '../api/dto/comment.view-dto';
import { CommentSQLDto } from '../domain/dto/comment.sql-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';

@Injectable()
export class SQLCommentsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findByIdOrNotFoundException(id: string, userId?: string) {
    const userReaction: LikeStatus = LikeStatus.None;
    console.log('QRepo: incoming values:', id, userId);
    const res = await this.dataSource.query(
      `SELECT c.*, u."login" as "userLogin", l."status" as "userReaction"
    FROM public."comments" as c
    
    LEFT JOIN public."users" as u
        ON c."userId" = u."id"
    
    LEFT JOIN public."likes" as l
    ON c."id" = l."parentId" AND (l."authorId" = $2 OR $2 IS NULL)
    AND l."deletionStatus" = 'not-deleted'

    WHERE c."id"=$1 AND c."deletionStatus"='not-deleted'`,
      [id, userId || null],
    );
    console.log('res', res);
    if (res.length === 0) {
      throw NotFoundDomainException.create('Comment not found.');
    }
    return new CommentViewDto(
      res[0],
      userId
        ? res[0].userReaction !== null
          ? res[0].userReaction
          : userReaction
        : userReaction,
    );
  }

  async findByPostId(
    id: string,
    query: GetCommentsQueryParams,
    userId?: string,
  ) {
    console.log('QRepo Comm: incoming values:', id, query);
    const sortDirection = query.sortDirection.toUpperCase();
    const userReaction: LikeStatus = LikeStatus.None;
    const searchResult = await this.dataSource.query(
      `SELECT c.*, u."login" as "userLogin", l."status" as "userReaction"
    FROM public."comments" as c
    
    LEFT JOIN public."users" as u
        ON c."userId" = u."id"
    
    LEFT JOIN public."likes" as l
    ON c."id" = l."parentId" AND (l."authorId" = $2 OR $2 IS NULL)
    AND l."deletionStatus"='not-deleted'

    WHERE c."postId"=$1 AND c."deletionStatus"='not-deleted' 
    
    ORDER BY "${query.sortBy}" ${sortDirection}
    LIMIT ${query.pageSize} OFFSET ${query.calculateSkip()}`,
      [id, userId || null],
    );
    console.log('QRepo Comm: search res:', searchResult);
    const items = searchResult.map(
      (comment: CommentSQLDto) =>
        new CommentViewDto(
          comment,
          userId
            ? comment.userReaction !== null
              ? comment.userReaction
              : userReaction
            : userReaction,
        ),
    );
    const totalCount = await this.dataSource.query(
      `SELECT COUNT(*)
       FROM public."comments"
       WHERE "deletionStatus" = 'not-deleted' AND "postId"= $1`,
      [id],
    );
    return PaginatedViewDto.mapToView({
      items,
      totalCount: Number(totalCount[0].count),
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
