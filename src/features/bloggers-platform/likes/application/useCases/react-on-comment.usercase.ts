import { ReactionDto } from '../../dto/like.main-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikesRepository } from '../../infrastructure/like.repository';
import { LikeService } from '../like.service';
import { LikeStatus } from '../../domain/like.entity';
import { CommentLike } from '../../domain/like.entity';
import { ReactionDomainDto } from '../../domain/dto/like.domain-dto';
import { CommentsRepository } from '../../../comments/infrastructure/comment.repository';

export class ReactOnCommentCommand {
  constructor(
    public dto: ReactionDto,
    public commentId: string,
    public userId: string,
  ) {}
}

@CommandHandler(ReactOnCommentCommand)
export class ReactOnCommentUseCase
  implements ICommandHandler<ReactOnCommentCommand>
{
  constructor(
    private likesRepository: LikesRepository,
    private commentsRepository: CommentsRepository,
    private likeService: LikeService,
  ) {}

  async execute({
    dto,
    commentId,
    userId,
  }: ReactOnCommentCommand): Promise<void> {
    const foundComment =
      await this.commentsRepository.findByIdOrNotFoundException(commentId);
    const currentStatus =
      await this.likesRepository.findCommentReactionStatusByUserIdParentId(
        userId,
        commentId,
      );
    if (currentStatus === dto.likeStatus) {
      return;
    }
    const updateReactionCounts = await this.likeService.changeLikeCount(
      currentStatus ?? LikeStatus.None,
      dto.likeStatus,
      foundComment,
    );
    foundComment.updateLikeCount(updateReactionCounts);
    await this.commentsRepository.save(foundComment);
    if (currentStatus !== null && currentStatus !== dto.likeStatus) {
      const foundReaction =
        await this.likesRepository.findCommentReactionOrNoFoundException(
          userId,
          commentId,
        );
      foundReaction.flagAsDeleted();
      await this.likesRepository.saveCommentLike(foundReaction);
    }
    const domainDto: ReactionDomainDto = {
      status: dto.likeStatus,
      authorId: userId,
      parentId: commentId,
    };
    const reaction: CommentLike = CommentLike.createNewInstance(domainDto);
    await this.likesRepository.saveCommentLike(reaction);
  }
}
