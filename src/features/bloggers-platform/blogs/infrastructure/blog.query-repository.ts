import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModelType } from '../domain/blog.entity';
import { BlogViewDto } from '../api/dto/blog.view-dto';
import { GetBlogsQueryParams } from '../api/dto/get-blogs-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { FilterQuery } from 'mongoose';
import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}

  async findByIdOrNotFoundException(id: string): Promise<BlogViewDto> {
    console.log(id);
    const blog = await this.BlogModel.findOne({
      _id: id,
      deletionStatus: DeletionStatus.NotDeleted,
    }).exec();
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return new BlogViewDto(blog);
  }

  async findAll(
    query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    const filter: FilterQuery<Blog> = {
      deletionStatus: DeletionStatus.NotDeleted,
    };

    if (query.searchNameTerm) {
      filter.name = { $regex: query.searchNameTerm, $options: 'i' };
    }

    const blogs = await this.BlogModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);
    const totalCount = await this.BlogModel.countDocuments(filter);
    const items = blogs.map((blog: BlogDocument) => new BlogViewDto(blog));
    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
