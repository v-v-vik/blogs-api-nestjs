import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';
import { ReactionDomainDto } from './dto/like.domain-dto';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../user-accounts/domain/user.entity';
import { LikeSQLDto } from './dto/like.sql-dto';
import { Post } from '../../posts/domain/post.entity';

export enum LikeEntityType {
  Post = 'post',
  Comment = 'comment',
}

export enum LikeStatus {
  Like = 'Like',
  Dislike = 'Dislike',
  None = 'None',
}

@Entity('likes')
export class Like {
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
  authorId: string;

  @ManyToOne(() => Post, (post) => post.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentId' })
  post: Post;

  @Column({
    type: 'int',
    nullable: false,
  })
  parentId: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  parentType: LikeEntityType;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  deletionStatus: DeletionStatus;

  static createNewInstance(dto: ReactionDomainDto) {
    const reaction = new this();
    reaction.status = dto.status;
    reaction.authorId = dto.authorId;
    reaction.parentId = dto.parentId;

    return reaction as Like;
  }

  static createFromExistingDataInstance(dbLike: LikeSQLDto) {
    const reaction = new this();
    reaction.id = dbLike.id.toString();
    reaction.createdAt = dbLike.createdAt;
    reaction.status = dbLike.status;
    reaction.authorId = dbLike.authorId.toString();
    reaction.parentId = dbLike.parentId.toString();
    reaction.deletionStatus = dbLike.deletionStatus;

    return reaction as Like;
  }

  flagAsDeleted() {
    if (this.deletionStatus !== DeletionStatus.NotDeleted) {
      throw NotFoundDomainException.create('Entity already deleted');
    }
    this.deletionStatus = DeletionStatus.PermanentDeleted;
  }
}
