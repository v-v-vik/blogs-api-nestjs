import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';
import {
  CreateCommentDomainDto,
  UpdateCommentDomainDto,
} from './dto/comment.domain-dto';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { CommentSQLDto } from './dto/comment.sql-dto';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { LikesInfo } from '../../likes/dto/like.main-dto';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: string;
  content: string;
  userId: string;
  createdAt: Date;
  postId: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
  };
  deletionStatus: DeletionStatus;

  static createNewInstance(dto: CreateCommentDomainDto): Comment {
    const comment = new this();
    comment.content = dto.content;
    comment.userId = dto.userId;
    comment.postId = dto.postId;

    return comment as Comment;
  }

  static createFromExistingDataInstance(dbComment: CommentSQLDto): Comment {
    const comment = new this();
    comment.id = dbComment.id.toString();
    comment.content = dbComment.content;
    comment.userId = dbComment.userId.toString();
    comment.createdAt = dbComment.createdAt;
    comment.postId = dbComment.postId.toString();
    comment.likesInfo = {
      likesCount: dbComment.likesCount,
      dislikesCount: dbComment.dislikesCount,
    };
    comment.deletionStatus = dbComment.deletionStatus;

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
    this.likesInfo = {
      likesCount: dto.likesCount,
      dislikesCount: dto.dislikesCount,
    };
  }
}
