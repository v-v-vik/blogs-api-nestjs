import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../domain/comment.entity';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectRepository(Comment) private commentsRepo: Repository<Comment>,
  ) {}

  async save(comment: Comment) {
    const res = await this.commentsRepo.save(comment);
    return res.id.toString();
  }

  async findByIdOrNotFoundException(id: string) {
    const res = await this.commentsRepo.findOne({
      where: {
        id: Number(id),
        deletionStatus: DeletionStatus.NotDeleted,
      },
    });
    if (!res) {
      throw NotFoundDomainException.create('Comment not found.');
    }
    return res;
  }
}
