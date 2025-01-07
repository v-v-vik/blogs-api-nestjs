import { Injectable } from '@nestjs/common';
import { Post, PostDocument, PostModelType } from '../domain/post.entity';
import { InjectModel } from '@nestjs/mongoose';
import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';

@Injectable()
export class PostRepository {
  constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}

  async findById(id: string): Promise<PostDocument | null> {
    return this.PostModel.findOne({
      _id: id,
      deletionStatus: DeletionStatus.NotDeleted,
    });
  }

  async save(post: PostDocument): Promise<void> {
    await post.save();
  }
}
