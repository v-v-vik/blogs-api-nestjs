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
import { CommentViewDto } from './dto/comment.view-dto';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../../user-accounts/guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from '../../../user-accounts/guards/decorators/param/user-from-req.decorator';
import { UserContextDto } from '../../../user-accounts/guards/dto/user-context.dto';
import { ExtractUserFromRequestIfExists } from '../../../user-accounts/guards/decorators/param/user-from-req-if-exists.decorator';
import { UpdateCommentCommand } from '../application/useCases/update-comment.usecase';
import { UpdateCommentInputDto } from './dto/comment.input-dto';
import { DeleteCommentCommand } from '../application/useCases/delete-comment.usecase';
import { JwtOptionalAuthGuard } from '../../../user-accounts/guards/bearer/optional-jwt-auth.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { SQLCommentsQueryRepository } from '../infrastructure/comment-sql.query-repository';
import { ParamsIdValidationPipe } from '../../../../core/pipes/id-param-validation.pipe';
import { ReactionInputDto } from '../../likes/api/dto/like.input-dto';
import { ReactOnCommentCommand } from '../../likes/application/useCases/react-on-comment.usercase';

@SkipThrottle()
@Controller('comments')
export class CommentsController {
  constructor(
    private sqlCommentsQueryRepository: SQLCommentsQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtOptionalAuthGuard)
  async findById(
    @Param('id', ParamsIdValidationPipe) id: string,
    @ExtractUserFromRequestIfExists() user: UserContextDto,
  ): Promise<CommentViewDto> {
    return this.sqlCommentsQueryRepository.findByIdOrNotFoundException(
      id,
      user?.id,
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParamsIdValidationPipe) id: string,
    @Body() dto: UpdateCommentInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<void> {
    return this.commandBus.execute(new UpdateCommentCommand(id, dto, user.id));
  }

  @Put(':id/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async addReaction(
    @Param('id', ParamsIdValidationPipe) id: string,
    @Body() dto: ReactionInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    return this.commandBus.execute(new ReactOnCommentCommand(dto, id, user.id));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('id', ParamsIdValidationPipe) id: string,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    return this.commandBus.execute(new DeleteCommentCommand(id, user.id));
  }
}
