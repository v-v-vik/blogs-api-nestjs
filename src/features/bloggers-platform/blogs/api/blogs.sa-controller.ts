import { SkipThrottle } from '@nestjs/throttler';
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
import { BlogsQueryRepository } from '../infrastructure/blog.query-repository';
import { PostsQueryRepository } from '../../posts/infrastructure/post.query-repository';
import { BlogsService } from '../application/blogs.service';
import { PostsService } from '../../posts/application/posts.service';
import { BasicAuthGuard } from '../../../user-accounts/guards/basic/basic-auth.guard';
import { GetBlogsQueryParams } from './dto/get-blogs-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { BlogViewDto } from './dto/blog.view-dto';
import { ParamsIdValidationPipe } from '../../../../core/pipes/id-param-validation.pipe';
import { CreateBlogInputDto, UpdateBlogInputDto } from './dto/blog.input-dto';
import { JwtOptionalAuthGuard } from '../../../user-accounts/guards/bearer/optional-jwt-auth.guard';
import { GetPostsQueryParams } from '../../posts/api/dto/get-posts-query-params.input-dto';
import { ExtractUserFromRequestIfExists } from '../../../user-accounts/guards/decorators/param/user-from-req-if-exists.decorator';
import { UserContextDto } from '../../../user-accounts/guards/dto/user-context.dto';
import {
  CreatePostInputViaBlogDto,
  UpdatePostInputViaBlogDto,
} from './dto/post-via-blog.input-dto';
import { CreatePostDto, UpdatePostDto } from '../../posts/dto/post.main-dto';
import { PostSQLViewDto } from '../../posts/api/dto/post-sql.view-dto';

@SkipThrottle()
@UseGuards(BasicAuthGuard)
@Controller('sa/blogs')
export class SuperAdminBlogsController {
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

  @Post()
  async create(@Body() body: CreateBlogInputDto): Promise<BlogViewDto> {
    const blogId = await this.blogsService.create(body);
    return this.blogsQueryRepository.findByIdOrNotFoundException(blogId);
  }

  @Get(':id/posts')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtOptionalAuthGuard)
  async findPostsById(
    @Param('id', ParamsIdValidationPipe) id: string,
    @Query() query: GetPostsQueryParams,
    @ExtractUserFromRequestIfExists() user: UserContextDto,
  ): Promise<PaginatedViewDto<PostSQLViewDto[]>> {
    const foundBlogId = await this.blogsService.findById(id);
    return this.postsQueryRepository.findAll(query, foundBlogId, user?.id);
  }

  @Post(':id/posts')
  async createPostById(
    @Param('id', ParamsIdValidationPipe) id: string,
    @Body() body: CreatePostInputViaBlogDto,
  ): Promise<PostSQLViewDto> {
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
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Body() body: UpdateBlogInputDto,
    @Param('id', ParamsIdValidationPipe) id: string,
  ) {
    return this.blogsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParamsIdValidationPipe) id: string) {
    return this.blogsService.delete(id);
  }

  @Put(':id/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePostByBlogId(
    @Param('id', ParamsIdValidationPipe) id: string,
    @Param('postId', ParamsIdValidationPipe) postId: string,
    @Body() dto: UpdatePostInputViaBlogDto,
  ) {
    const mainDto: UpdatePostDto = {
      ...dto,
      blogId: id,
    };
    return this.postsService.update(postId, mainDto);
  }

  @Delete(':id/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePostByBlogId(
    @Param('id', ParamsIdValidationPipe) id: string,
    @Param('postId', ParamsIdValidationPipe) postId: string,
  ) {
    await this.blogsService.findById(id);
    return await this.postsService.delete(postId);
  }
}
