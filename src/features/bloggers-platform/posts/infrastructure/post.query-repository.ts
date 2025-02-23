import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetPostsQueryParams } from '../api/dto/get-posts-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { LikeStatus, PostLike } from '../../likes/domain/like.entity';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import {
  NewestLikesViewDto,
  PostSQLViewDto,
} from '../api/dto/post-sql.view-dto';
import { Post } from '../domain/post.entity';
import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';
import { SortDirection } from '../../../../core/dto/base.query-params.input-dto';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectRepository(Post) private postsRepo: Repository<Post>) {}

  async findByIdOrNotFoundException(
    id: string,
    userId?: string,
  ): Promise<PostSQLViewDto> {
    let userReaction: LikeStatus = LikeStatus.None;
    const post = await this.postsRepo.findOne({
      relations: {
        blog: true,
        likes: {
          author: true,
        },
      },
      where: {
        id: Number(id),
        deletionStatus: DeletionStatus.NotDeleted,
      },
      order: {
        likes: {
          createdAt: 'DESC',
        },
      },
    });

    console.log(post);

    if (!post) {
      throw NotFoundDomainException.create('Post not found.');
    }

    const formattedLikes = {
      ...post,
      likes: post.likes
        .filter(
          (like) =>
            like.deletionStatus === DeletionStatus.NotDeleted &&
            like.status === LikeStatus.Like,
        )
        .slice(0, 3),
    };

    const newestLikes = formattedLikes.likes.map(
      (like: PostLike) => new NewestLikesViewDto(like),
    );

    if (userId) {
      const userReactionQB = await this.postsRepo
        .createQueryBuilder('post')
        .leftJoin(
          'post.likes',
          'userLike',
          'userLike.deletionStatus = :notDeleted AND userLike.authorId = :userId',
          {
            userId: Number(userId),
            notDeleted: DeletionStatus.NotDeleted,
          },
        )
        .addSelect('userLike.status')
        .where('post.id = :id', { id })
        .andWhere('post.deletionStatus = :status', {
          status: DeletionStatus.NotDeleted,
        })
        .getOne();

      if (userReactionQB?.likes[0].status)
        userReaction = userReactionQB?.likes[0].status;
    }

    return new PostSQLViewDto(post, userReaction, newestLikes);
  }

  async findAll(
    query: GetPostsQueryParams,
    blogId?: string,
    userId?: string,
  ): Promise<PaginatedViewDto<PostSQLViewDto[]>> {
    const sortDirection: 'ASC' | 'DESC' =
      query.sortDirection === SortDirection.Asc ? 'ASC' : 'DESC';
    let userReactionsMap: Map<number, LikeStatus> = new Map();

    const [searchResult, totalCount] = await this.postsRepo.findAndCount({
      relations: {
        blog: true,
        likes: {
          author: true,
        },
      },
      where: {
        ...(blogId ? { blogId: Number(blogId) } : {}),
        deletionStatus: DeletionStatus.NotDeleted,
      },
      order: {
        [query.sortBy]: sortDirection,
        likes: {
          createdAt: 'DESC',
        },
      },
      skip: query.calculateSkip(),
      take: query.pageSize,
    });

    console.log(searchResult);

    const postsFormattedLikes = searchResult.map((post) => ({
      ...post,
      likes: post.likes
        .filter(
          (like) =>
            like.deletionStatus === DeletionStatus.NotDeleted &&
            like.status === LikeStatus.Like,
        )
        .slice(0, 3),
    }));

    if (userId) {
      const userReactionsQB = await this.postsRepo.find({
        relations: {
          likes: true,
        },
        where: {
          ...(blogId ? { blogId: Number(blogId) } : {}),
          deletionStatus: DeletionStatus.NotDeleted,
          likes: {
            authorId: Number(userId),
            deletionStatus: DeletionStatus.NotDeleted,
          },
        },
      });

      userReactionsMap = new Map(
        userReactionsQB.map((post): [number, LikeStatus] => [
          post.id,
          post.likes[0].status,
        ]),
      );
    }

    const finalMap: PostSQLViewDto[] = postsFormattedLikes.map(
      (post: Post) =>
        new PostSQLViewDto(
          post,
          userId
            ? (userReactionsMap.get(Number(post.id)) ?? LikeStatus.None)
            : LikeStatus.None,
          post.likes.map((like: PostLike) => new NewestLikesViewDto(like)),
        ),
    );

    return PaginatedViewDto.mapToView({
      items: finalMap,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
