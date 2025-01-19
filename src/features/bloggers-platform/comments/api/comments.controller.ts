import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ObjectIdValidationPipe } from '../../../../core/pipes/objectId-validation-pipe';
import { CommentViewDto } from './dto/comment.view-dto';
import { CommentQueryRepository } from '../infrastructure/comment.query-repository';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateBlogInputDto } from '../../blogs/api/dto/blog.input-dto';
import { JwtAuthGuard } from '../../../user-accounts/guards/bearer/jwt-auth.guard';
import { ReactionInputDto } from '../../likes/api/dto/like.input-dto';
import { ExtractUserFromRequest } from '../../../user-accounts/guards/decorators/param/user-from-req.decorator';
import { UserContextDto } from '../../../user-accounts/guards/dto/user-context.dto';
import { ExtractUserFromRequestIfExists } from '../../../user-accounts/guards/decorators/param/user-from-req-if-exists.decorator';

@Controller('comments')
export class CommentsController {
  constructor(
    private commentQueryRepository: CommentQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param('id', ObjectIdValidationPipe) id: string,
    @ExtractUserFromRequestIfExists() user: UserContextDto,
    //decorator to extract userId // optional jwt
  ): Promise<CommentViewDto> {
    return this.commentQueryRepository.findByIdOrNotFoundException(
      id,
      user?.id,
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() dto: UpdateBlogInputDto,
  ): Promise<void> {
    return this.commandBus.execute(new UpdateCommentCommand(id, dto));
  }

  @Put(':id/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async addReaction(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() dto: ReactionInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    return this.commandBus.execute(new ReactOnEntity(dto, id, user.id));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.commandBus.execute(new DeleteComment(id));
  }
}
