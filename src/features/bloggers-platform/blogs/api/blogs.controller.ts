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
  UseGuards,
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
import { ObjectIdValidationPipe } from '../../../../core/pipes/objectId-validation-pipe';
import { BasicAuthGuard } from '../../../user-accounts/guards/basic/basic-auth.guard';
import { JwtOptionalAuthGuard } from '../../../user-accounts/guards/bearer/optional-jwt-auth.guard';
import { ExtractUserFromRequestIfExists } from '../../../user-accounts/guards/decorators/param/user-from-req-if-exists.decorator';
import { UserContextDto } from '../../../user-accounts/guards/dto/user-context.dto';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
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
  async findById(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<BlogViewDto> {
    const foundBlogId = await this.blogsService.findById(id);
    return this.blogsQueryRepository.findByIdOrNotFoundException(foundBlogId);
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  async create(@Body() body: CreateBlogInputDto): Promise<BlogViewDto> {
    const blogId = await this.blogsService.create(body);
    return this.blogsQueryRepository.findByIdOrNotFoundException(blogId);
  }

  @Get(':id/posts')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtOptionalAuthGuard)
  async findPostsById(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Query() query: GetPostsQueryParams,
    @ExtractUserFromRequestIfExists() user: UserContextDto,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    const foundBlogId = await this.blogsService.findById(id);
    return this.postsQueryRepository.findAll(query, foundBlogId, user?.id);
  }

  @Post(':id/posts')
  @UseGuards(BasicAuthGuard)
  async createPostById(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() body: CreatePostInputViaBlogDto,
  ): Promise<PostViewDto> {
    const mainDto: CreatePostDto = {
      title: body.title,
      shortDescription: body.shortDescription,
      content: body.content,
      blogId: id,
    };
    const postId = await this.postsService.create(mainDto);
    return this.postsQueryRepository.findByIdOrNotFoundException(postId);
  }

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Body() body: UpdateBlogInputDto,
    @Param('id', ObjectIdValidationPipe) id: string,
  ) {
    return this.blogsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.blogsService.delete(id);
  }
}
