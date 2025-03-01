import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';
import { ReactionDomainDto } from './dto/like.domain-dto';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../user-accounts/domain/user.entity';
import { Post } from '../../posts/domain/post.entity';
import { Comment } from '../../comments/domain/comment.entity';

export enum LikeEntityType {
  Post = 'post',
  Comment = 'comment',
}

export enum LikeStatus {
  Like = 'Like',
  Dislike = 'Dislike',
  None = 'None',
}

abstract class Like {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
  })
  createdAt: Date;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  status: LikeStatus;

  @ManyToOne(() => User)
  author: User;

  @Column({
    type: 'int',
    nullable: false,
  })
  authorId: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  deletionStatus: DeletionStatus;

  flagAsDeleted() {
    if (this.deletionStatus !== DeletionStatus.NotDeleted) {
      throw NotFoundDomainException.create('Entity already deleted');
    }
    this.deletionStatus = DeletionStatus.PermanentDeleted;
  }
}

@Entity('commentLikes')
export class CommentLike extends Like {
  @ManyToOne(() => Comment, (comment) => comment.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentId' })
  comment: Comment;

  @Column({
    type: 'int',
    nullable: false,
  })
  parentId: number;

  static createNewInstance(dto: ReactionDomainDto) {
    const reaction = new this();
    reaction.status = dto.status;
    reaction.authorId = Number(dto.authorId);
    reaction.parentId = Number(dto.parentId);
    reaction.createdAt = new Date();
    reaction.deletionStatus = DeletionStatus.NotDeleted;

    return reaction as CommentLike;
  }
}

@Entity('postLikes')
export class PostLike extends Like {
  @ManyToOne(() => Post, (post) => post.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentId' })
  post: Post;

  @Column({
    type: 'int',
    nullable: false,
  })
  parentId: number;

  static createNewInstance(dto: ReactionDomainDto) {
    const reaction = new this();
    reaction.status = dto.status;
    reaction.authorId = Number(dto.authorId);
    reaction.parentId = Number(dto.parentId);
    reaction.createdAt = new Date();
    reaction.deletionStatus = DeletionStatus.NotDeleted;

    return reaction as PostLike;
  }
}

//
// @Entity('likes')
// export class Like {
//   @PrimaryGeneratedColumn()
//   id: string;
//
//   @Column({
//     type: 'timestamp with time zone',
//     nullable: false,
//   })
//   createdAt: Date;
//
//   @Column({
//     type: 'varchar',
//     nullable: false,
//   })
//   status: LikeStatus;
//
//   @ManyToOne(() => User)
//   author: User;
//
//   @Column({
//     type: 'int',
//     nullable: false,
//   })
//   authorId: number;
//
//   @ManyToOne(() => Post, (post) => post.likes, { onDelete: 'CASCADE' })
//   @JoinColumn({ name: 'parentId' })
//   post: Post;
//
//   @Column({
//     type: 'int',
//     nullable: false,
//   })
//   parentId: number;
//
//   @Column({
//     type: 'varchar',
//     nullable: false,
//   })
//   parentType: LikeEntityType;
//
//   @Column({
//     type: 'varchar',
//     nullable: false,
//   })
//   deletionStatus: DeletionStatus;
//
//   static createNewInstance(dto: ReactionDomainDto) {
//     const reaction = new this();
//     reaction.status = dto.status;
//     reaction.authorId = Number(dto.authorId);
//     reaction.parentId = Number(dto.parentId);
//
//     return reaction as Like;
//   }
//
//   static createFromExistingDataInstance(dbLike: LikeSQLDto) {
//     const reaction = new this();
//     reaction.id = dbLike.id.toString();
//     reaction.createdAt = dbLike.createdAt;
//     reaction.status = dbLike.status;
//     reaction.authorId = dbLike.authorId;
//     reaction.parentId = dbLike.parentId;
//     reaction.deletionStatus = dbLike.deletionStatus;
//
//     return reaction as Like;
//   }
//
//   flagAsDeleted() {
//     if (this.deletionStatus !== DeletionStatus.NotDeleted) {
//       throw NotFoundDomainException.create('Entity already deleted');
//     }
//     this.deletionStatus = DeletionStatus.PermanentDeleted;
//   }
// }
