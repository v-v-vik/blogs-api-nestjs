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
import { PostsService } from '../application/posts.service';
import { GetPostsQueryParams } from './dto/get-posts-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { PostViewDto } from './dto/post.view-dto';
import { PostsQueryRepository } from '../infrastructure/post.query-repository';
import { CreatePostInputDto, UpdatePostInputDto } from './dto/post.input-dto';
import { ObjectIdValidationPipe } from '../../../../core/pipes/objectId-validation-pipe';

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
  async findById(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<PostViewDto> {
    return this.postsQueryRepository.findByIdOrNotFoundException(id);
  }

  // @Get(':id/comments')
  // async findCommentsById(
  //   @Param('id') id: string,
  //   @Query() query: GetCommentsQueryParams,
  // ): Promise<PaginatedViewDto<CommentViewDto[]>> {}

  @Post()
  async create(@Body() body: CreatePostInputDto): Promise<PostViewDto> {
    const postId = await this.postsService.create(body);
    return this.postsQueryRepository.findByIdOrNotFoundException(postId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() body: UpdatePostInputDto,
  ): Promise<void> {
    return this.postsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ObjectIdValidationPipe) id: string): Promise<void> {
    return this.postsService.delete(id);
  }
}
