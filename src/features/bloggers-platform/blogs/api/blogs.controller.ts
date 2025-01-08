import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
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
import { GetPostsQueryParams } from '../../posts/api/dto/get-posts-query-params.input-dto';
import { PostsService } from '../../posts/application/posts.service';
import { PostsQueryRepository } from '../../posts/infrastructure/post.query-repository';
import { CreatePostDto } from '../../posts/dto/post.main-dto';
import { CreatePostInputViaBlogDto } from './dto/post-via-blog.input-dto';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
    private blogsService: BlogsService,
    private postsService: PostsService,
  ) {}

  @Get()
  async findAll(
    @Query() query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    return this.blogsQueryRepository.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<BlogViewDto | null> {
    const blog = await this.blogsQueryRepository.findById(id);
    if (!blog) {
      throw new NotFoundException('Blog not found.');
    }
    return blog;
  }

  @Post()
  async create(@Body() body: CreateBlogInputDto): Promise<BlogViewDto> {
    const blogId = await this.blogsService.create(body);
    const blog = await this.blogsQueryRepository.findById(blogId);
    if (!blog) {
      throw new NotFoundException('Blog not found.');
    }
    return blog;
  }

  @Get(':id/posts')
  async findPostsById(
    @Param('id') id: string,
    @Query() query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    return this.postsService.findAllByBlogId(query, id);
  }

  @Post(':id/posts')
  async createPostById(
    @Param('id') id: string,
    @Body() body: CreatePostInputViaBlogDto,
  ): Promise<PostViewDto> {
    const mainDto: CreatePostDto = {
      title: body.title,
      shortDescription: body.shortDescription,
      content: body.content,
      blogId: id,
    };
    const postId = await this.postsService.create(mainDto);
    const post = await this.postsQueryRepository.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    return post;
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
