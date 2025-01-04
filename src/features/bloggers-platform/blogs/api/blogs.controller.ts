import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { BlogViewModel, CreateBlogModel } from '../domain/dto/blog.models';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private blogsService: BlogsService,
  ) {}

  @Get()
  async findAll(
    @Query() query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewModel[]>> {
    return this.blogsQueryRepository.findAll(query);
  }

  @Get('id')
  async findById(@Param('id') id: string): Promise<BlogViewModel> {
    return this.blogsQueryRepository.getByIdOrNotFoundFail(id);
  }

  @Post()
  async create(@Body() body: CreateBlogModel): Promise<BlogViewModel> {
    const blogId = await this.blogsService.create(body);
    return this.blogsQueryRepository.getByIdOrNotFoundFail(blogId);
  }
}
