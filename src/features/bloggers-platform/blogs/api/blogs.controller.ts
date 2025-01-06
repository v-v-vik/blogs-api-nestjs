import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { BlogsQueryRepository } from '../infrastructure/blog.query-repository';
import { BlogViewDto } from './dto/blog.view-dto';
import { GetBlogsQueryParams } from './dto/get-blogs-query-params.input-dto';
import { CreateBlogInputDto, UpdateBlogInputDto } from './dto/blog.input-dto';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private blogsService: BlogsService,
  ) {}

  @Get()
  async findAll(
    @Query() query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    return this.blogsQueryRepository.findAll(query);
  }

  @Get('id')
  async findById(@Param('id') id: string): Promise<BlogViewDto> {
    return this.blogsQueryRepository.findById(id);
  }

  @Post()
  async create(@Body() body: CreateBlogInputDto): Promise<BlogViewDto> {
    const blogId = await this.blogsService.create(body);
    return this.blogsQueryRepository.findById(blogId);
  }

  //@Get returns all posts with blogId

  //@Post creates new post for blogId

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Body() body: UpdateBlogInputDto, @Param('id') id: string) {
    console.log(body, id);
    return this.blogsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return this.blogsService.delete(id);
  }
}
