import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentModelType } from '../domain/comment.entity';
import { CommentViewDto } from '../api/dto/comment.view-dto';
import { GetCommentsQueryParams } from '../api/dto/get-comments-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { LikeDocument, LikeStatus } from '../../likes/domain/like.entity';
import { FilterQuery } from 'mongoose';
import { Post } from '../../posts/domain/post.entity';
import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { LikesRepository } from '../../likes/infrastructure/like.repository';
import { MappedReactionsModel } from './dto/comment.query-dto';

Injectable();
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
    private likesRepository: LikesRepository,
  ) {}

  async findByIdOrNotFoundException(
    id: string,
    userId?: string,
  ): Promise<CommentViewDto> {
    const userReaction: LikeStatus = userId
      ? ((await this.likesRepository.findReactionStatusByUserIdParentId(
          userId,
          id,
        )) ?? LikeStatus.None)
      : LikeStatus.None;
    const comment = await this.CommentModel.findOne({
      _id: id,
      deletionStatus: DeletionStatus.NotDeleted,
    });
    if (!comment) {
      throw NotFoundDomainException.create('Comment not found');
    }
    return new CommentViewDto(comment, userReaction);
  }

  async findByPostId(
    id: string,
    query: GetCommentsQueryParams,
    userId: string,
  ): Promise<PaginatedViewDto<CommentViewDto[]>> {
    const filter: FilterQuery<Post> = {
      deletionStatus: DeletionStatus.NotDeleted,
      postId: id,
    };

    const comments = await this.CommentModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);
    const totalCount = await this.CommentModel.countDocuments(filter);
    let reactionsArray: LikeDocument[] | null = [];
    let mappedReactions: MappedReactionsModel = {};
    if (userId) {
      const commentIds = comments.map((item) => item._id.toString());
      reactionsArray = await this.likesRepository.findAllByUserIdParentId(
        userId,
        commentIds,
      );
      if (reactionsArray && reactionsArray.length > 0) {
        mappedReactions = reactionsArray.reduce((acc, curr) => {
          acc[curr.parentId] = curr.status;
          return acc;
        }, {});
        console.log('mappedReactions', mappedReactions);
      }
    }
    const mappedComments = comments.map((comment) => {
      const userReaction: LikeStatus =
        mappedReactions[comment._id.toString()] || LikeStatus.None;
      return new CommentViewDto(comment, userReaction);
    });

    return PaginatedViewDto.mapToView({
      items: mappedComments,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
