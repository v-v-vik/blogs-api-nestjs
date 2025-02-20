import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommentDto } from '../../dto/comment.main-dto';
import { SQLCommentsRepository } from '../../infrastructure/comment-sql.repository';
import { Comment } from '../../domain/comment.entity';
import { CreateCommentDomainDto } from '../../domain/dto/comment.domain-dto';

export class CreateCommentCommand {
  constructor(
    public id: string,
    public dto: CreateCommentDto,
    public userId: string,
  ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(private sqlCommentsRepository: SQLCommentsRepository) {}

  async execute(command: CreateCommentCommand): Promise<string> {
    const domainDto: CreateCommentDomainDto = {
      ...command.dto,
      postId: command.id,
      userId: command.userId,
    };
    const newComment = Comment.createNewInstance(domainDto);
    return await this.sqlCommentsRepository.create(newComment);
  }
}
