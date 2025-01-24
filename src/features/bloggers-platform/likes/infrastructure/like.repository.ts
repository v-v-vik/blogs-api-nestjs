import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Like,
  LikeDocument,
  LikeModelType,
  LikeStatus,
} from '../domain/like.entity';
import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class LikesRepository {
  constructor(@InjectModel(Like.name) private LikeModel: LikeModelType) {}

  async findAllByUserIdParentId(userId: string, parentId: string | string[]) {
    const res = await this.LikeModel.find({
      parentId: { $in: parentId },
      authorId: userId,
      deletionStatus: DeletionStatus.NotDeleted,
    });
    if (!res) {
      return null;
    }
    return res;
  }

  async findReactionStatusByUserIdParentId(userId: string, parentId: string) {
    const res = await this.LikeModel.findOne({
      parentId,
      authorId: userId,
      deletionStatus: DeletionStatus.NotDeleted,
    });
    if (!res) {
      return null;
    }
    return res.status;
  }

  async findReactionOrNoFoundException(userId: string, parentId: string) {
    const res = await this.LikeModel.findOne({
      parentId,
      authorId: userId,
      deletionStatus: DeletionStatus.NotDeleted,
    });
    if (!res) {
      throw NotFoundDomainException.create('Reaction not found.');
    }
    return res;
  }

  async findLatestLikes(parentId: string) {
    const res = await this.LikeModel.find({
      parentId,
      status: LikeStatus.Like,
      deletionStatus: DeletionStatus.NotDeleted,
    })
      .sort({ createdAt: -1 })
      .limit(3);
    if (!res) {
      return null;
    }
    return res;
  }

  async findAllLikeReactionsByParentId(postIds: string[]) {
    const res = await this.LikeModel.find({
      parentId: { $in: postIds },
      deletionStatus: DeletionStatus.NotDeleted,
      status: LikeStatus.Like,
    }).sort({ createdAt: -1 });
    if (!res) {
      return null;
    }
    return res;
  }

  async save(like: LikeDocument) {
    return await like.save();
  }
}
