import { ReactionDto } from '../../dto/like.main-dto';
import { Like, LikeEntityType } from '../../domain/like.entity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SQLLikesRepository } from '../../infrastructure/like-sql.repository';
import { PostsRepository } from '../../../posts/infrastructure/post.repository';
import { LikeService } from '../like.service';
import { LikeStatus } from '../../domain/like.entity';
import { ReactionDomainDto } from '../../domain/dto/like.domain-dto';

export class ReactOnPostCommand {
  constructor(
    public dto: ReactionDto,
    public postId: string,
    public userId: string,
  ) {}
}

@CommandHandler(ReactOnPostCommand)
export class ReactOnPostUseCase implements ICommandHandler<ReactOnPostCommand> {
  constructor(
    private sqlLikesRepository: SQLLikesRepository,
    private postsRepository: PostsRepository,
    private likeService: LikeService,
  ) {}

  async execute({ dto, postId, userId }: ReactOnPostCommand): Promise<void> {
    const foundPost =
      await this.postsRepository.findByIdOrNotFoundException(postId);
    const currentStatus: LikeStatus =
      await this.sqlLikesRepository.findReactionStatusByUserIdParentId(
        userId,
        postId,
        LikeEntityType.Post,
      );
    if (currentStatus === dto.likeStatus) {
      return;
    }
    const updateReactionCounts = await this.likeService.changeLikeCount(
      currentStatus ?? LikeStatus.None,
      dto.likeStatus,
      foundPost,
      LikeEntityType.Post,
    );
    foundPost.updateLikeCount(updateReactionCounts);
    await this.postsRepository.save(foundPost);
    if (currentStatus !== null && currentStatus !== dto.likeStatus) {
      const foundReaction =
        await this.sqlLikesRepository.findReactionOrNoFoundException(
          userId,
          postId,
          LikeEntityType.Post,
        );
      foundReaction.flagAsDeleted();
      await this.sqlLikesRepository.update(foundReaction);
    }
    const domainDto: ReactionDomainDto = {
      status: dto.likeStatus,
      authorId: userId,
      parentId: postId,
    };
    const reaction = Like.createNewInstance(domainDto);
    await this.sqlLikesRepository.create(reaction, LikeEntityType.Post);
  }
}
