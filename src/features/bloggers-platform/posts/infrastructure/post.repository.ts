import { Injectable } from '@nestjs/common';
import { Post, PostDocument, PostModelType } from '../domain/post.entity';
import { InjectModel } from '@nestjs/mongoose';
import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { EntityRepository } from '../../../../core/interfaces/repository.interface';

@Injectable()
export class PostsRepository implements EntityRepository<PostDocument> {
  constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}

  async findByIdOrNotFoundException(id: string): Promise<PostDocument> {
    const res = await this.PostModel.findOne({
      _id: id,
      deletionStatus: DeletionStatus.NotDeleted,
    });
    if (!res) {
      throw NotFoundDomainException.create('Post not found.');
    }
    return res;
  }

  async save(post: PostDocument): Promise<void> {
    await post.save();
  }
}
