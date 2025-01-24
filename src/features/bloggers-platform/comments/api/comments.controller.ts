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
import { CommentsQueryRepository } from '../infrastructure/comments-query.repository';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../../user-accounts/guards/bearer/jwt-auth.guard';
import { ReactionInputDto } from '../../likes/api/dto/like.input-dto';
import { ExtractUserFromRequest } from '../../../user-accounts/guards/decorators/param/user-from-req.decorator';
import { UserContextDto } from '../../../user-accounts/guards/dto/user-context.dto';
import { ExtractUserFromRequestIfExists } from '../../../user-accounts/guards/decorators/param/user-from-req-if-exists.decorator';
import { UpdateCommentCommand } from '../application/useCases/update-comment.usecase';
import { UpdateCommentInputDto } from './dto/comment.input-dto';
import { DeleteCommentCommand } from '../application/useCases/delete-comment.usecase';
import { ReactOnEntityCommand } from '../../likes/application/useCases/react-on-entity.usecase';
import { JwtOptionalAuthGuard } from '../../../user-accounts/guards/bearer/optional-jwt-auth.guard';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('comments')
export class CommentsController {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtOptionalAuthGuard)
  async findById(
    @Param('id', ObjectIdValidationPipe) id: string,
    @ExtractUserFromRequestIfExists() user: UserContextDto,
  ): Promise<CommentViewDto> {
    return this.commentsQueryRepository.findByIdOrNotFoundException(
      id,
      user?.id,
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() dto: UpdateCommentInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<void> {
    return this.commandBus.execute(new UpdateCommentCommand(id, dto, user.id));
  }

  @Put(':id/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async addReaction(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() dto: ReactionInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    return this.commandBus.execute(
      new ReactOnEntityCommand(dto, id, user.id, 'comment'),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('id', ObjectIdValidationPipe) id: string,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    return this.commandBus.execute(new DeleteCommentCommand(id, user.id));
  }
}
