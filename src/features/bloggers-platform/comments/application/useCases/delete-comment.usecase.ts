import { CommentsRepository } from '../../infrastructure/comment.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenDomainException } from '../../../../../core/exceptions/domain-exceptions';

export class DeleteCommentCommand {
  constructor(
    public id: string,
    public userId: string,
  ) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(command: DeleteCommentCommand): Promise<void> {
    const foundComment =
      await this.commentsRepository.findByIdOrNotFoundException(command.id);
    if (foundComment.commentatorInfo.userId !== command.userId) {
      throw ForbiddenDomainException.create(
        'You can delete only your own comments.',
        'userId',
      );
    }
    foundComment.flagAsDeleted();
    await this.commentsRepository.save(foundComment);
  }
}
