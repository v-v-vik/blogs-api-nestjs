import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { BlogViewDto } from './dto/blog.view-dto';
import { GetBlogsQueryParams } from './dto/get-blogs-query-params.input-dto';
import { GetPostsQueryParams } from '../../posts/api/dto/get-posts-query-params.input-dto';
import { JwtOptionalAuthGuard } from '../../../user-accounts/guards/bearer/optional-jwt-auth.guard';
import { ExtractUserFromRequestIfExists } from '../../../user-accounts/guards/decorators/param/user-from-req-if-exists.decorator';
import { UserContextDto } from '../../../user-accounts/guards/dto/user-context.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { BlogsQueryRepository } from '../infrastructure/blog.query-repository';
import { ParamsIdValidationPipe } from '../../../../core/pipes/id-param-validation.pipe';
import { PostsQueryRepository } from '../../posts/infrastructure/post.query-repository';
import { PostSQLViewDto } from '../../posts/api/dto/post-sql.view-dto';

@SkipThrottle()
@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
    private blogsService: BlogsService,
  ) {}

  @Get()
  async findAll(
    @Query() query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    return this.blogsQueryRepository.findAll(query);
  }

  @Get(':id')
  async findById(
    @Param('id', ParamsIdValidationPipe) id: string,
  ): Promise<BlogViewDto> {
    const foundBlogId = await this.blogsService.findById(id);
    return this.blogsQueryRepository.findByIdOrNotFoundException(foundBlogId);
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
}
