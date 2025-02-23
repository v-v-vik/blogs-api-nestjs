import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentLike, LikeEntityType, PostLike } from '../domain/like.entity';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';

@Injectable()
export class LikesRepository {
  constructor(
    @InjectRepository(PostLike) private postLikesRepo: Repository<PostLike>,
    @InjectRepository(CommentLike)
    private commentLikesRepo: Repository<CommentLike>,
  ) {}

  async saveCommentLike(like: CommentLike) {
    const res = await this.commentLikesRepo.save(like);
    return res.id.toString();
  }

  async savePostLike(like: PostLike) {
    const res = await this.postLikesRepo.save(like);
    return res.id.toString();
  }

  async findReactionOrNoFoundException(
    userId: string,
    parentId: string,
    entityType: LikeEntityType,
  ) {
    const repository =
      entityType === LikeEntityType.Post
        ? this.postLikesRepo
        : this.commentLikesRepo;

    const res = await repository.findOne({
      where: {
        parentId: Number(parentId),
        authorId: Number(userId),
        deletionStatus: DeletionStatus.NotDeleted,
      },
    });
    if (!res) {
      throw NotFoundDomainException.create('Reaction not found.');
    }
    return res;
  }

  async findReactionStatusByUserIdParentId(
    userId: string,
    parentId: string,
    entityType: LikeEntityType,
  ) {
    const repository =
      entityType === LikeEntityType.Post
        ? this.postLikesRepo
        : this.commentLikesRepo;
    const res = await repository.findOne({
      where: {
        parentId: Number(parentId),
        authorId: Number(userId),
        deletionStatus: DeletionStatus.NotDeleted,
      },
    });
    if (!res) {
      return null;
    }
    return res.status;

    //used by react-on-entity.usecase
  }

  // async findAllByUserIdParentId() {}
  // async findLatestLikes() {}
  // async findAllLikeReactionsByParentId() {}
}
