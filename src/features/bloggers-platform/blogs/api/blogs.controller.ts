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
import { PostViewDto } from '../../posts/api/dto/post.view-dto';
import { PostsQueryRepository } from '../../posts/infrastructure/post.query-repository';
import { GetPostsQueryParams } from '../../posts/api/dto/get-posts-query-params.input-dto';
import { CreatePostInputDto } from '../../posts/api/dto/post.input-dto';
import { PostsService } from '../../posts/application/posts.service';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private blogsService: BlogsService,
    private postsQueryRepository: PostsQueryRepository,
    private postsService: PostsService,
  ) {}

  @Get()
  async findAll(
    @Query() query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    return this.blogsQueryRepository.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<BlogViewDto> {
    return this.blogsQueryRepository.findById(id);
  }

  @Post()
  async create(@Body() body: CreateBlogInputDto): Promise<BlogViewDto> {
    const blogId = await this.blogsService.create(body);
    return this.blogsQueryRepository.findById(blogId);
  }

  @Get(':id/posts')
  async findPostsById(
    @Param('id') id: string,
    @Query() query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    //through service ---- return this.postsQueryRepository.findAll(query, id);
  }

  @Post(':id/posts')
  async createPostById(
    @Param('id') id: string,
    @Body() body: CreatePostInputDto,
  ): Promise<PostViewDto> {
    const postId = await this.postsService.create(body, id);
    // through service --- return this.postsQueryRepository.findById(postId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Body() body: UpdateBlogInputDto, @Param('id') id: string) {
    return this.blogsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return this.blogsService.delete(id);
  }
}
