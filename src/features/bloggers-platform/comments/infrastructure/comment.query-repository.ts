import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentModelType } from '../domain/comment.entity';
import { CommentViewDto } from '../api/dto/comment.view-dto';
import { GetCommentsQueryParams } from '../api/dto/get-comments-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { LikeStatus } from '../../likes/domain/like.entity';
import { FilterQuery } from 'mongoose';
import { Post } from '../../posts/domain/post.entity';
import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';

Injectable();
export class CommentQueryRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
  ) {}

  async findByIdOrNotFoundException(id: string): Promise<CommentViewDto> {
    const userReaction: LikeStatus = LikeStatus.None;
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
    let reactionsArray: any = [];
    let mappedReactions: any = [];
    if (userId) {
      const commentIds = comments.map((item) => item._id.toString());
      reactionsArray = await this.likeRepository.findByUserIdParentId(
        userId,
        commentIds,
      );
      if (reactionsArray.length > 0) {
        mappedReactions = reactionsArray.reduce((acc, curr) => {
          acc[curr.parentId] = curr.status;
          return acc;
        }, {});
      }
    }
    const mappedComments = comments.map((comment) => {
      const userReaction: LikeStatus =
        mappedReactions[comment._id.toString()] || LikeStatus.None;
      return new CommentViewDto(comment, userReaction);
    });
  }
  //TODO:finish logic
}
