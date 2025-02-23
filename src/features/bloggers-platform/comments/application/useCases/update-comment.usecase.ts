import { UpdateCommentInputDto } from '../../api/dto/comment.input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenDomainException } from '../../../../../core/exceptions/domain-exceptions';
import { CommentsRepository } from '../../infrastructure/comment.repository';

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
  constructor(private sqlCommentsRepository: CommentsRepository) {}

  async execute(command: UpdateCommentCommand): Promise<void> {
    const foundComment =
      await this.sqlCommentsRepository.findByIdOrNotFoundException(command.id);
    if (foundComment.userId !== +command.userId) {
      throw ForbiddenDomainException.create(
        'You can edit only your own comments.',
        'userId',
      );
    }
    foundComment.update(command.dto);
    await this.sqlCommentsRepository.save(foundComment);
  }
}
