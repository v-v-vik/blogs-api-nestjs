import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { GetPostsQueryParams } from '../api/dto/get-posts-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { LikeStatus } from '../../likes/domain/like.entity';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { PostSQLDto } from '../domain/dto/post.sql-dto';
import { PostSQLViewDto } from '../api/dto/post-sql.view-dto';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findByIdOrNotFoundException(
    id: string,
    userId?: string,
  ): Promise<PostSQLViewDto> {
    const userReaction: LikeStatus = LikeStatus.None;
    const res = await this.dataSource.query(
      `SELECT p.*, 
    b."name" as "blogName",
    l."status" as "userReaction",
    l1."createdAt" as "likeDate1",
    l11."authorId" as "likeUserId1",
    u1."login" as "likeUserLogin1",
    l2."createdAt" as "likeDate2",
    l21."authorId" as "likeUserId2",
    u2."login" as "likeUserLogin2",
    l3."createdAt" as "likeDate3",
    l31."authorId" as "likeUserId3",
    u3."login" as "likeUserLogin3"
    
    FROM public."posts" as p
        
    LEFT JOIN public."blogs" as b
    ON p."blogId" = b."id"
        
    LEFT JOIN public."likes" as l
    ON p."id" = l."parentId" AND (l."authorId" = $2 OR $2 IS NULL)
    AND l."deletionStatus"='not-deleted'
    
    LEFT JOIN public."likes" as l1
    ON l1."parentId" = p."id" AND l1."deletionStatus"='not-deleted' AND l1."createdAt" = (
    SELECT lsub."createdAt"
    FROM public."likes" as lsub
    WHERE lsub."parentId"=p."id" AND lsub."status"='Like'
    ORDER BY lsub."createdAt" DESC
    LIMIT 1 OFFSET 0
    )
    
    LEFT JOIN public."likes" as l2
    ON l2."parentId" = p."id" AND l2."deletionStatus"='not-deleted' AND l2."createdAt" = (
    SELECT lsub."createdAt"
    FROM public."likes" as lsub
    WHERE lsub."parentId"=p."id" AND lsub."status"='Like'
    ORDER BY lsub."createdAt" DESC
    LIMIT 1 OFFSET 1
    )
    
    LEFT JOIN public."likes" as l3
    ON l3."parentId" = p."id" AND l3."deletionStatus"='not-deleted' AND l3."createdAt" = (
    SELECT lsub."createdAt"
    FROM public."likes" as lsub
    WHERE lsub."parentId"=p."id" AND lsub."status"='Like'
    ORDER BY lsub."createdAt" DESC
    LIMIT 1 OFFSET 2
    )
    
    LEFT JOIN public."likes" as l11
    ON l11."parentId" = p."id" AND l11."deletionStatus"='not-deleted' AND l11."authorId" = (
    SELECT lsub."authorId"
    FROM public."likes" as lsub
    WHERE lsub."parentId"=p."id" AND lsub."status"='Like'
    ORDER BY lsub."createdAt" DESC
    LIMIT 1 OFFSET 0
    )
    
    LEFT JOIN public."likes" as l21
    ON l21."parentId" = p."id" AND l21."deletionStatus"='not-deleted' AND l21."authorId" = (
    SELECT lsub."authorId"
    FROM public."likes" as lsub
    WHERE lsub."parentId"=p."id" AND lsub."status"='Like'
    ORDER BY lsub."createdAt" DESC
    LIMIT 1 OFFSET 1
    )
    
    LEFT JOIN public."likes" as l31
    ON l31."parentId" = p."id" AND l31."deletionStatus"='not-deleted' AND l31."authorId" = (
    SELECT lsub."authorId"
    FROM public."likes" as lsub
    WHERE lsub."parentId"=p."id" AND lsub."status"='Like'
    ORDER BY lsub."createdAt" DESC
    LIMIT 1 OFFSET 2
    )
    
    LEFT JOIN public."users" as u1
    ON l11."authorId"=u1."id"
    
    LEFT JOIN public."users" as u2
    ON l21."authorId"=u2."id"
    
    LEFT JOIN public."users" as u3
    ON l31."authorId"=u3."id"
        
    WHERE p."id"=$1 AND p."deletionStatus"='not-deleted'`,
      [id, userId || null],
    );
    console.log('QRepo Post: result from the search', res);
    if (res.length === 0) {
      throw NotFoundDomainException.create('Post not found.');
    }
    return new PostSQLViewDto(
      res[0],
      userId
        ? res[0].userReaction !== null
          ? res[0].userReaction
          : userReaction
        : userReaction,
    );
  }

  async findAll(
    query: GetPostsQueryParams,
    blogId?: string,
    userId?: string,
  ): Promise<PaginatedViewDto<PostSQLViewDto[]>> {
    const userReaction: LikeStatus = LikeStatus.None;
    const sortDirection = query.sortDirection.toUpperCase();
    const searchResult = await this.dataSource.query(
      `SELECT p.*, 
    b."name" as "blogName",
    l."status" as "userReaction",
    l1."createdAt" as "likeDate1",
    l11."authorId" as "likeUserId1",
    u1."login" as "likeUserLogin1",
    l2."createdAt" as "likeDate2",
    l21."authorId" as "likeUserId2",
    u2."login" as "likeUserLogin2",
    l3."createdAt" as "likeDate3",
    l31."authorId" as "likeUserId3",
    u3."login" as "likeUserLogin3"
    
    FROM public."posts" as p
        
    LEFT JOIN public."blogs" as b
    ON p."blogId" = b."id"
        
    LEFT JOIN public."likes" as l
    ON p."id" = l."parentId" AND (l."authorId" = $2 OR $2 IS NULL)
    
    
    LEFT JOIN public."likes" as l1
    ON l1."parentId" = p."id" AND l1."deletionStatus"='not-deleted' AND l1."createdAt" = (
    SELECT lsub."createdAt"
    FROM public."likes" as lsub
    WHERE lsub."parentId"=p."id"  AND lsub."status"='Like'
    ORDER BY lsub."createdAt" DESC
    LIMIT 1 OFFSET 0
    )
    
    LEFT JOIN public."likes" as l2
    ON l2."parentId" = p."id" AND l2."deletionStatus"='not-deleted' AND l2."createdAt" = (
    SELECT lsub."createdAt"
    FROM public."likes" as lsub
    WHERE lsub."parentId"=p."id" AND lsub."status"='Like'
    ORDER BY lsub."createdAt" DESC
    LIMIT 1 OFFSET 1
    )
    
    LEFT JOIN public."likes" as l3
    ON l3."parentId" = p."id" AND l3."deletionStatus"='not-deleted' AND l3."createdAt" = (
    SELECT lsub."createdAt"
    FROM public."likes" as lsub
    WHERE lsub."parentId"=p."id" AND lsub."status"='Like'
    ORDER BY lsub."createdAt" DESC
    LIMIT 1 OFFSET 2
    )
    
    LEFT JOIN public."likes" as l11
    ON l11."parentId" = p."id" AND l11."deletionStatus"='not-deleted' AND l11."authorId" = (
    SELECT lsub."authorId"
    FROM public."likes" as lsub
    WHERE lsub."parentId"=p."id" AND lsub."status"='Like'
    ORDER BY lsub."createdAt" DESC
    LIMIT 1 OFFSET 0
    )
    
    LEFT JOIN public."likes" as l21
    ON l21."parentId" = p."id" AND l21."deletionStatus"='not-deleted' AND l21."authorId" = (
    SELECT lsub."authorId"
    FROM public."likes" as lsub
    WHERE lsub."parentId"=p."id" AND lsub."status"='Like'
    ORDER BY lsub."createdAt" DESC
    LIMIT 1 OFFSET 1
    )
    
    LEFT JOIN public."likes" as l31
    ON l31."parentId" = p."id" AND l31."deletionStatus"='not-deleted' AND l31."authorId" = (
    SELECT lsub."authorId"
    FROM public."likes" as lsub
    WHERE lsub."parentId"=p."id" AND lsub."status"='Like'
    ORDER BY lsub."createdAt" DESC
    LIMIT 1 OFFSET 2
    )
    
    LEFT JOIN public."users" as u1
    ON l11."authorId"=u1."id"
    
    LEFT JOIN public."users" as u2
    ON l21."authorId"=u2."id"
    
    LEFT JOIN public."users" as u3
    ON l31."authorId"=u3."id"
        
        
    WHERE p."deletionStatus" = 'not-deleted' AND (p."blogId"= $1 OR $1 IS NULL)
    ORDER BY "${query.sortBy}" ${sortDirection}
    LIMIT ${query.pageSize} OFFSET ${query.calculateSkip()}`,
      [blogId || null, userId || null],
    );

    const resultWoDuplicates = Array.from(
      new Map(searchResult.map((post) => [post.id, post])).values(),
    );

    const items = resultWoDuplicates.map(
      (post: PostSQLDto) =>
        new PostSQLViewDto(
          post,
          userId
            ? post.userReaction !== null
              ? post.userReaction
              : userReaction
            : userReaction,
        ),
    );
    const totalCount = await this.dataSource.query(
      `SELECT COUNT(*)
       FROM public."posts"
       WHERE "deletionStatus" = 'not-deleted' AND ("blogId"= $1 OR $1 IS NULL)`,
      [blogId || null],
    );
    return PaginatedViewDto.mapToView({
      items,
      totalCount: Number(totalCount[0].count),
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
