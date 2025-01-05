import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModelType } from '../domain/blog.entity';
import { DeletionStatus } from '../../../user-accounts/domain/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}

  async findById(id: string): Promise<BlogDocument | null> {
    return this.BlogModel.findOne({
      _id: id,
      deletionStatus: DeletionStatus.NotDeleted,
    });
  }

  async save(blog: BlogDocument) {
    await blog.save();
  }
}
