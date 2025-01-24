import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
  CommentModelType,
} from '../domain/comment.entity';
import { Injectable } from '@nestjs/common';
import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { EntityRepository } from '../../../../core/interfaces/repository.interface';

Injectable();
export class CommentsRepository implements EntityRepository<CommentDocument> {
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
  ) {}
  async findByIdOrNotFoundException(id: string): Promise<CommentDocument> {
    const res = await this.CommentModel.findOne({
      _id: id,
      deletionStatus: DeletionStatus.NotDeleted,
    });
    if (!res) {
      throw NotFoundDomainException.create('Comment not found');
    }
    return res;
  }

  async save(comment: CommentDocument) {
    await comment.save();
  }
}
