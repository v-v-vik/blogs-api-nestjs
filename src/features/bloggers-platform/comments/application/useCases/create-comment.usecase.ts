import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommentDto } from '../../dto/comment.main-dto';
import { UsersRepository } from '../../../../user-accounts/infrastructure/user.repository';
import { InjectModel } from '@nestjs/mongoose';
import { CommentModelType, Comment } from '../../domain/comment.entity';
import { CommentsRepository } from '../../infrastructure/comment.repository';

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
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
    private usersRepository: UsersRepository,
    private commentsRepository: CommentsRepository,
  ) {}

  async execute(command: CreateCommentCommand): Promise<string> {
    console.log('in commandbus', command.dto);
    const userLogin = await this.usersRepository.getLoginByUserId(
      command.userId,
    );
    const domainDto = {
      content: command.dto.content,
      userId: command.userId,
      userLogin: userLogin,
      createdAt: new Date().toISOString(),
      postId: command.id,
    };
    const newComment = this.CommentModel.createInstance(domainDto);
    await this.commentsRepository.save(newComment);
    return newComment._id.toString();
  }
}
