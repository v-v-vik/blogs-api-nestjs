import { UpdateCommentInputDto } from '../../api/dto/comment.input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comment.repository';
import { ForbiddenDomainException } from '../../../../../core/exceptions/domain-exceptions';

export class UpdateCommentCommand {
  constructor(
    public id: string,
    public dto: UpdateCommentInputDto,
    public userId: string,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(command: UpdateCommentCommand): Promise<void> {
    const foundComment =
      await this.commentsRepository.findByIdOrNotFoundException(command.id);
    if (foundComment.commentatorInfo.userId !== command.userId) {
      throw ForbiddenDomainException.create(
        'You can edit only your own comments.',
        'userId',
      );
    }
    foundComment.update(command.dto);
    await this.commentsRepository.save(foundComment);
  }
}
