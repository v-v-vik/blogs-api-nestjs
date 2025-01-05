import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModelType } from '../domain/blog.entity';
import { DeletionStatus } from '../../../user-accounts/domain/user.entity';
import { BlogViewModel } from '../api/dto/blog.view-dto';
import { GetBlogsQueryParams } from '../api/dto/get-blogs-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { FilterQuery } from 'mongoose';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}

  async findById(id: string): Promise<BlogViewModel> {
    const blog = await this.BlogModel.findOne({
      _id: id,
      deletionStatus: DeletionStatus.NotDeleted,
    }).exec();
    if (!blog) {
      throw new NotFoundException('Blog not found.');
    }
    return new BlogViewModel(blog);
  }

  async findAll(
    query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewModel[]>> {
    const filter: FilterQuery<Blog> = {};

    if (query.searchNameTerm) {
      filter.name = { $regex: query.searchNameTerm, $options: 'i' };
    }

    const blogs = await this.BlogModel.find({
      ...filter,
      deletionStatus: DeletionStatus.NotDeleted,
    })
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);
    const totalCount = await this.BlogModel.countDocuments(filter);
    const items = blogs.map((blog: BlogDocument) => new BlogViewModel(blog));
    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
