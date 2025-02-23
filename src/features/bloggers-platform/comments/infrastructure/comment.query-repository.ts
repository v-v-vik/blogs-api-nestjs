import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { GetCommentsQueryParams } from '../api/dto/get-comments-query-params.input-dto';
import { LikeStatus } from '../../likes/domain/like.entity';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { CommentViewDto } from '../api/dto/comment.view-dto';
import { CommentSQLDto } from '../domain/dto/comment.sql-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';
import { Comment } from '../domain/comment.entity';
import { SortDirection } from '../../../../core/dto/base.query-params.input-dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectRepository(Comment) private commentsRepo: Repository<Comment>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async findByIdOrNotFoundException(id: string, userId?: string) {
    const userReaction: LikeStatus = LikeStatus.None;
    const res = await this.commentsRepo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoin(
        'comment.likes',
        'like',
        'like.deletionStatus = :notDeleted AND like.authorId = :userId OR :userId IS NULL',
        {
          userId: userId || null,
          notDeleted: DeletionStatus.NotDeleted,
        },
      )
      .addSelect('like')
      .where('comment.id = :id', { id: Number(id) })
      .andWhere('comment.deletionStatus = :status', {
        status: DeletionStatus.NotDeleted,
      })
      .getOne();
    console.log(res);

    if (!res) {
      throw NotFoundDomainException.create('Comment not found.');
    }
    return new CommentViewDto(
      res,
      userId ? (res.likes[0].status ?? LikeStatus.None) : userReaction,
    );
  }

  async findByPostId(
    id: string,
    query: GetCommentsQueryParams,
    userId?: string,
  ) {
    const sortDirection: 'ASC' | 'DESC' =
      query.sortDirection === SortDirection.Asc ? 'ASC' : 'DESC';
    const userReaction: LikeStatus = LikeStatus.None;
    console.log(query);

    const qBuilder = this.commentsRepo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoin(
        'comment.likes',
        'like',
        'like.deletionStatus = :notDeleted AND like.authorId = :userId OR :userId IS NULL',
        {
          userId: userId || null,
          notDeleted: DeletionStatus.NotDeleted,
        },
      )
      .addSelect('like')
      .where('comment.postId = :id', { id: Number(id) })
      .andWhere('comment.deletionStatus = :status', {
        status: DeletionStatus.NotDeleted,
      })
      .orderBy(`comment.${query.sortBy}`, sortDirection)
      .offset(query.calculateSkip())
      .limit(query.pageSize);

    const [items, totalCount] = await qBuilder.getManyAndCount();

    // const searchResult = await this.dataSource.query(
    //   `SELECT c.*, u."login" as "userLogin", l."status" as "userReaction"
    // FROM public."comments" as c
    //
    // LEFT JOIN public."users" as u
    //     ON c."userId" = u."id"
    //
    // LEFT JOIN public."likes" as l
    // ON c."id" = l."parentId" AND (l."authorId" = $2 OR $2 IS NULL)
    // AND l."deletionStatus"='not-deleted'
    //
    // WHERE c."postId"=$1 AND c."deletionStatus"='not-deleted'
    //
    // ORDER BY "${query.sortBy}" ${sortDirection}
    // LIMIT ${query.pageSize} OFFSET ${query.calculateSkip()}`,
    //   [id, userId || null],
    // );
    // console.log('QRepo Comm: search res:', searchResult);

    const mappedItems = items.map(
      (comment: Comment) =>
        new CommentViewDto(
          comment,
          userId ? (comment.likes[0].status ?? LikeStatus.None) : userReaction,
        ),
    );
    // const totalCount = await this.dataSource.query(
    //   `SELECT COUNT(*)
    //    FROM public."comments"
    //    WHERE "deletionStatus" = 'not-deleted' AND "postId"= $1`,
    //   [id],
    // );
    return PaginatedViewDto.mapToView({
      items: mappedItems,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
