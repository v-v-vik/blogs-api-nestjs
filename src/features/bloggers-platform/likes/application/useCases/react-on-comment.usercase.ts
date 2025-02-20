import { ReactionDto } from '../../dto/like.main-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SQLLikesRepository } from '../../infrastructure/like-sql.repository';
import { LikeService } from '../like.service';
import { LikeStatus } from '../../domain/like.entity';
import { Like, LikeEntityType } from '../../domain/like.entity';
import { ReactionDomainDto } from '../../domain/dto/like.domain-dto';
import { SQLCommentsRepository } from '../../../comments/infrastructure/comment-sql.repository';

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
    private sqlLikesRepository: SQLLikesRepository,
    private sqlCommentsRepository: SQLCommentsRepository,
    private likeService: LikeService,
  ) {}

  async execute({
    dto,
    commentId,
    userId,
  }: ReactOnCommentCommand): Promise<void> {
    const foundComment =
      await this.sqlCommentsRepository.findByIdOrNotFoundException(commentId);
    const currentStatus: LikeStatus =
      await this.sqlLikesRepository.findReactionStatusByUserIdParentId(
        userId,
        commentId,
        LikeEntityType.Comment,
      );
    if (currentStatus === dto.likeStatus) {
      return;
    }
    const updateReactionCounts = await this.likeService.changeLikeCount(
      currentStatus ?? LikeStatus.None,
      dto.likeStatus,
      foundComment,
      LikeEntityType.Comment,
    );
    foundComment.updateLikeCount(updateReactionCounts);
    await this.sqlCommentsRepository.update(foundComment);
    if (currentStatus !== null && currentStatus !== dto.likeStatus) {
      console.log('deletion block');
      const foundReaction =
        await this.sqlLikesRepository.findReactionOrNoFoundException(
          userId,
          commentId,
          LikeEntityType.Comment,
        );
      console.log('found reaction is', foundReaction);
      foundReaction.flagAsDeleted();
      await this.sqlLikesRepository.update(foundReaction);
    }
    const domainDto: ReactionDomainDto = {
      status: dto.likeStatus,
      authorId: userId,
      parentId: commentId,
    };
    const reaction = Like.createNewInstance(domainDto);
    await this.sqlLikesRepository.create(reaction, LikeEntityType.Comment);
  }
}
