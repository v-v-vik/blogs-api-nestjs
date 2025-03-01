import { LikeStatus } from '../../../likes/domain/like.entity';
import { Comment } from '../../domain/comment.entity';

class LikesInfoView {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;

  constructor(comment: Comment, userReaction: LikeStatus) {
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

  constructor(comment: Comment, userReaction: LikeStatus) {
    this.id = comment.id.toString();
    this.content = comment.content;
    this.commentatorInfo = {
      userId: comment.userId.toString(),
      userLogin: comment.user.login,
    };
    this.createdAt = comment.createdAt.toISOString();
    this.likesInfo = new LikesInfoView(comment, userReaction);
  }
}
