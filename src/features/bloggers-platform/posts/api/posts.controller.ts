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
import { PostsService } from '../application/posts.service';
import { GetPostsQueryParams } from './dto/get-posts-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { PostViewDto } from './dto/post.view-dto';
import { PostsQueryRepository } from '../infrastructure/post.query-repository';
import { CreatePostInputDto, UpdatePostInputDto } from './dto/post.input-dto';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  async findAll(
    @Query() query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    return this.postsQueryRepository.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<PostViewDto> {
    const post = await this.postsQueryRepository.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  // @Get(':id/comments')
  // async findCommentsById(
  //   @Param('id') id: string,
  //   @Query() query: GetCommentsQueryParams,
  // ): Promise<PaginatedViewDto<CommentViewDto[]>> {}

  @Post()
  async create(@Body() body: CreatePostInputDto): Promise<PostViewDto> {
    const postId = await this.postsService.create(body);
    const post = await this.postsQueryRepository.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id') id: string,
    @Body() body: UpdatePostInputDto,
  ): Promise<void> {
    return this.postsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.postsService.delete(id);
  }
}
