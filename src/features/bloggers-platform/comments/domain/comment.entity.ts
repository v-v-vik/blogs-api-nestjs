import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';
import {
  CreateCommentDomainDto,
  UpdateCommentDomainDto,
} from './dto/comment.domain-dto';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LikesInfo } from '../../likes/dto/like.main-dto';
import { User } from '../../../user-accounts/domain/user.entity';
import { Post } from '../../posts/domain/post.entity';
import { CommentLike } from '../../likes/domain/like.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'varchar',
    nullable: false,
  })
  content: string;
  @ManyToOne(() => User)
  user: User;
  @Column({
    type: 'int',
    nullable: false,
  })
  userId: number;
  @Column({
    type: 'timestamp with time zone',
    nullable: false,
  })
  createdAt: Date;
  @ManyToOne(() => Post)
  post: Post;
  @Column({
    type: 'int',
    nullable: false,
  })
  postId: number;
  @Column({ type: 'int', default: 0 })
  likesCount: number;
  @Column({ type: 'int', default: 0 })
  dislikesCount: number;
  @Column({
    type: 'varchar',
    nullable: false,
  })
  deletionStatus: DeletionStatus;

  @OneToMany(() => CommentLike, (l) => l.comment)
  likes: CommentLike[];

  static createNewInstance(dto: CreateCommentDomainDto): Comment {
    const comment = new this();
    comment.content = dto.content;
    comment.userId = Number(dto.userId);
    comment.postId = Number(dto.postId);

    return comment as Comment;
  }

  flagAsDeleted() {
    if (this.deletionStatus !== DeletionStatus.NotDeleted) {
      throw NotFoundDomainException.create('Entity already deleted');
    }
    this.deletionStatus = DeletionStatus.PermanentDeleted;
  }

  update(dto: UpdateCommentDomainDto) {
    this.content = dto.content;
  }

  updateLikeCount(dto: LikesInfo) {
    this.likesCount = dto.likesCount;
    this.dislikesCount = dto.dislikesCount;
  }
}
