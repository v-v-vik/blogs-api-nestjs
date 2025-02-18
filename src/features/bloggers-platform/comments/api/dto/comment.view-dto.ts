import { LikeStatus } from '../../../likes/domain/like.entity';
import { CommentSQLDto } from '../../domain/dto/comment.sql-dto';

class LikesInfoView {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;

  constructor(comment: CommentSQLDto, userReaction: LikeStatus) {
    this.likesCount = comment.likesCount;
    this.dislikesCount = comment.dislikesCount;
    this.myStatus = userReaction;
  }
}

export class CommentViewDto {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: LikesInfoView;

  constructor(comment: CommentSQLDto, userReaction: LikeStatus) {
    this.id = comment.id.toString();
    this.content = comment.content;
    this.commentatorInfo = {
      userId: comment.userId.toString(),
      userLogin: comment.userLogin,
    };
    this.createdAt = comment.createdAt.toISOString();
    this.likesInfo = new LikesInfoView(comment, userReaction);
  }
}
