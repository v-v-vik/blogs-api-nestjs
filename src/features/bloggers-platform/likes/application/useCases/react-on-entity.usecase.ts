import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ReactionDto } from '../../dto/like.main-dto';
import { LikesRepository } from '../../infrastructure/like.repository';
import { Like, LikeModelType, LikeStatus } from '../../domain/like.entity';
import { CommentsRepository } from '../../../comments/infrastructure/comment.repository';
import { PostsRepository } from '../../../posts/infrastructure/post.repository';
import { LikeService } from '../like.service';
import { UsersRepository } from '../../../../user-accounts/infrastructure/user.repository';
import { InjectModel } from '@nestjs/mongoose';
import { PostDocument } from '../../../posts/domain/post.entity';
import { CommentDocument } from '../../../comments/domain/comment.entity';
import { EntityRepository } from '../../../../../core/interfaces/repository.interface';

export class ReactOnEntityCommand {
  constructor(
    public dto: ReactionDto,
    public entityId: string,
    public userId: string,
    public entityType: 'post' | 'comment',
  ) {}
}

@CommandHandler(ReactOnEntityCommand)
export class ReactOnEntityUseCase
  implements ICommandHandler<ReactOnEntityCommand>
{
  constructor(
    @InjectModel(Like.name) private LikeModel: LikeModelType,
    private likesRepository: LikesRepository,
    private commentsRepository: CommentsRepository,
    private postsRepository: PostsRepository,
    private likeService: LikeService,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: ReactOnEntityCommand): Promise<void> {
    const repository =
      command.entityType === 'post'
        ? (this.postsRepository as EntityRepository<
            PostDocument | CommentDocument
          >)
        : (this.commentsRepository as EntityRepository<
            PostDocument | CommentDocument
          >);
    const foundEntity: PostDocument | CommentDocument =
      await repository.findByIdOrNotFoundException(command.entityId);
    const currentStatus =
      await this.likesRepository.findReactionStatusByUserIdParentId(
        command.userId,
        command.entityId,
      );
    if (currentStatus === command.dto.likeStatus) {
      return;
    }
    const updateReactionCounts = await this.likeService.changeLikeCount(
      currentStatus ?? LikeStatus.None,
      command.dto.likeStatus,
      foundEntity,
      command.entityType,
    );
    foundEntity.updateLikeCount(updateReactionCounts);
    //await foundEntity.save();
    await repository.save(foundEntity);
    if (currentStatus !== null && currentStatus !== command.dto.likeStatus) {
      const foundReaction =
        await this.likesRepository.findReactionOrNoFoundException(
          command.userId,
          command.entityId,
        );
      foundReaction.flagAsDeleted();
      await this.likesRepository.save(foundReaction);
    }
    const userLogin = await this.usersRepository.getLoginByUserId(
      command.userId,
    );
    const domainDto = {
      status: command.dto.likeStatus,
      authorId: command.userId,
      authorLogin: userLogin,
      parentId: command.entityId,
    };
    const reaction = this.LikeModel.createInstance(domainDto);
    await this.likesRepository.save(reaction);
  }
}
