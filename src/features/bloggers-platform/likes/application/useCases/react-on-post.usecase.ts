import { ReactionDto } from '../../dto/like.main-dto';
import { LikeEntityType, LikeStatus, PostLike } from '../../domain/like.entity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikesRepository } from '../../infrastructure/like.repository';
import { PostsRepository } from '../../../posts/infrastructure/post.repository';
import { LikeService } from '../like.service';
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
    private likesRepository: LikesRepository,
    private postsRepository: PostsRepository,
    private likeService: LikeService,
  ) {}

  async execute({ dto, postId, userId }: ReactOnPostCommand): Promise<void> {
    const foundPost =
      await this.postsRepository.findByIdOrNotFoundException(postId);
    const currentStatus =
      await this.likesRepository.findReactionStatusByUserIdParentId(
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
    );
    foundPost.updateLikeCount(updateReactionCounts);
    await this.postsRepository.save(foundPost);
    if (currentStatus !== null && currentStatus !== dto.likeStatus) {
      const foundReaction =
        await this.likesRepository.findReactionOrNoFoundException(
          userId,
          postId,
          LikeEntityType.Post,
        );
      foundReaction.flagAsDeleted();
      await this.likesRepository.savePostLike(foundReaction);
    }
    const domainDto: ReactionDomainDto = {
      status: dto.likeStatus,
      authorId: userId,
      parentId: postId,
    };
    const reaction: PostLike = PostLike.createNewInstance(domainDto);
    await this.likesRepository.savePostLike(reaction);
  }
}
