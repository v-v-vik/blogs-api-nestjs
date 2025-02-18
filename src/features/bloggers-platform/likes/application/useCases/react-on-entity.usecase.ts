// import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
// import { ReactionDto } from '../../dto/like.main-dto';
// import { LikeService } from '../like.service';
// import { EntityRepository } from '../../../../../core/interfaces/repository.interface';
// import { SQLUsersRepository } from '../../../../user-accounts/infrastructure/user-sql.repository';
// import { SQLPostsRepository } from '../../../posts/infrastructure/post-sql.repository';
// import { Post } from '../../../posts/domain/post-sql.entity';
// import { SQLLikesRepository } from '../../infrastructure/like-sql.repository';
// import { SQLCommentsRepository } from '../../../comments/infrastructure/comment-sql.repository';
// import { LikeStatus } from '../../domain/like.entity';
// import { LikeEntityType } from '../../domain/like-sql.entity';
//
// export class ReactOnEntityCommand {
//   constructor(
//     public dto: ReactionDto,
//     public entityId: string,
//     public userId: string,
//     public entityType: LikeEntityType,
//   ) {}
// }
//
// @CommandHandler(ReactOnEntityCommand)
// export class ReactOnEntityUseCase
//   implements ICommandHandler<ReactOnEntityCommand>
// {
//   constructor(
//     private sqlLikesRepository: SQLLikesRepository,
//     private sqlCommentsRepository: SQLCommentsRepository,
//     private sqlPostsRepository: SQLPostsRepository,
//     private likeService: LikeService,
//     private sqlUsersRepository: SQLUsersRepository,
//   ) {}
//
//   async execute(command: ReactOnEntityCommand): Promise<void> {
//     const repository =
//       command.entityType === 'post'
//         ? (this.sqlPostsRepository as EntityRepository<Post | Comment>)
//         : (this.sqlCommentsRepository as EntityRepository<Post | Comment>);
//     const foundEntity = (await repository.findByIdOrNotFoundException(
//       command.entityId,
//     )) as Post | Comment;
//     const currentStatus =
//       await this.sqlLikesRepository.findReactionStatusByUserIdParentId(
//         command.userId,
//         command.entityId,
//         command.entityType,
//       );
//     if (currentStatus === command.dto.likeStatus) {
//       return;
//     }
//     const updateReactionCounts = await this.likeService.changeLikeCount(
//       currentStatus ?? LikeStatus.None,
//       command.dto.likeStatus,
//       foundEntity,
//       command.entityType,
//     );
//     foundEntity.updateLikeCount(updateReactionCounts);
//     //await foundEntity.save();
//     await repository.save(foundEntity);
//     if (currentStatus !== null && currentStatus !== command.dto.likeStatus) {
//       const foundReaction =
//         await this.likesRepository.findReactionOrNoFoundException(
//           command.userId,
//           command.entityId,
//         );
//       foundReaction.flagAsDeleted();
//       await this.likesRepository.save(foundReaction);
//     }
//     const userLogin = await this.sqlUsersRepository.findLoginByUserId(
//       command.userId,
//     );
//     const domainDto = {
//       status: command.dto.likeStatus,
//       authorId: command.userId,
//       authorLogin: userLogin,
//       parentId: command.entityId,
//     };
//     const reaction = this.LikeModel.createInstance(domainDto);
//     await this.likesRepository.save(reaction);
//   }
// }
