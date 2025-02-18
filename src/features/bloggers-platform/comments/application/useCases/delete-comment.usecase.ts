import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenDomainException } from '../../../../../core/exceptions/domain-exceptions';
import { SQLCommentsRepository } from '../../infrastructure/comment-sql.repository';

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
  constructor(private sqlCommentsRepository: SQLCommentsRepository) {}

  async execute(command: DeleteCommentCommand): Promise<void> {
    const foundComment =
      await this.sqlCommentsRepository.findByIdOrNotFoundException(command.id);
    if (foundComment.userId !== command.userId) {
      throw ForbiddenDomainException.create(
        'You can delete only your own comments.',
        'userId',
      );
    }
    foundComment.flagAsDeleted();
    await this.sqlCommentsRepository.update(foundComment);
  }
}
