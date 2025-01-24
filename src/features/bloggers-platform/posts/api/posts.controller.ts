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
import { PostsService } from '../application/posts.service';
import { GetPostsQueryParams } from './dto/get-posts-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { PostViewDto } from './dto/post.view-dto';
import { PostsQueryRepository } from '../infrastructure/post.query-repository';
import { CreatePostInputDto, UpdatePostInputDto } from './dto/post.input-dto';
import { ObjectIdValidationPipe } from '../../../../core/pipes/objectId-validation-pipe';
import { PostsRepository } from '../infrastructure/post.repository';
import { JwtAuthGuard } from '../../../user-accounts/guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from '../../../user-accounts/guards/decorators/param/user-from-req.decorator';
import { CreateCommentInputDto } from '../../comments/api/dto/comment.input-dto';
import { UserContextDto } from '../../../user-accounts/guards/dto/user-context.dto';
import { CreateCommentCommand } from '../../comments/application/useCases/create-comment.usecase';
import { CommandBus } from '@nestjs/cqrs';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments-query.repository';
import { CommentViewDto } from '../../comments/api/dto/comment.view-dto';
import { GetCommentsQueryParams } from '../../comments/api/dto/get-comments-query-params.input-dto';
import { ExtractUserFromRequestIfExists } from '../../../user-accounts/guards/decorators/param/user-from-req-if-exists.decorator';
import { ReactionInputDto } from '../../likes/api/dto/like.input-dto';
import { ReactOnEntityCommand } from '../../likes/application/useCases/react-on-entity.usecase';
import { BasicAuthGuard } from '../../../user-accounts/guards/basic/basic-auth.guard';
import { JwtOptionalAuthGuard } from '../../../user-accounts/guards/bearer/optional-jwt-auth.guard';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
    private postsRepository: PostsRepository,
    private commandBus: CommandBus,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtOptionalAuthGuard)
  async findAll(
    @Query() query: GetPostsQueryParams,
    @ExtractUserFromRequestIfExists() user: UserContextDto,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    return this.postsQueryRepository.findAll(query, undefined, user?.id);
  }

  @Get(':id')
  @UseGuards(JwtOptionalAuthGuard)
  async findById(
    @Param('id', ObjectIdValidationPipe) id: string,
    @ExtractUserFromRequestIfExists() user: UserContextDto,
  ): Promise<PostViewDto> {
    return this.postsQueryRepository.findByIdOrNotFoundException(id, user?.id);
  }

  @Get(':id/comments')
  @UseGuards(JwtOptionalAuthGuard)
  async findCommentsById(
    @Param('id') id: string,
    @Query() query: GetCommentsQueryParams,
    @ExtractUserFromRequestIfExists() user: UserContextDto,
  ): Promise<PaginatedViewDto<CommentViewDto[]>> {
    const foundPost =
      await this.postsRepository.findByIdOrNotFoundException(id);
    return this.commentsQueryRepository.findByPostId(
      foundPost._id.toString(),
      query,
      user?.id,
    );
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  async create(@Body() dto: CreatePostInputDto): Promise<PostViewDto> {
    const postId = await this.postsService.create(dto);
    return this.postsQueryRepository.findByIdOrNotFoundException(postId);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() dto: CreateCommentInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<CommentViewDto> {
    const foundPost =
      await this.postsRepository.findByIdOrNotFoundException(id);
    const commentId = await this.commandBus.execute(
      new CreateCommentCommand(foundPost._id.toString(), dto, user.id),
    );
    return this.commentsQueryRepository.findByIdOrNotFoundException(commentId);
  }

  @Put(':id/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async addReaction(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() dto: ReactionInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    const foundPost =
      await this.postsRepository.findByIdOrNotFoundException(id);
    return this.commandBus.execute(
      new ReactOnEntityCommand(dto, foundPost._id.toString(), user.id, 'post'),
    );
  }

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() body: UpdatePostInputDto,
  ): Promise<void> {
    return this.postsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ObjectIdValidationPipe) id: string): Promise<void> {
    return this.postsService.delete(id);
  }
}
