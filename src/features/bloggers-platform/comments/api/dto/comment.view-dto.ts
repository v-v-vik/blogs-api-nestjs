import { LikeStatus } from '../../../likes/domain/like.entity';
import { CommentDocument } from '../../domain/comment.entity';

class LikesInfoView {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;

  constructor(comment: CommentDocument, userReaction: LikeStatus) {
    this.likesCount = comment.likesInfo.likesCount;
    this.dislikesCount = comment.likesInfo.dislikesCount;
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

  constructor(comment: CommentDocument, userReaction: LikeStatus) {
    this.id = comment._id.toString();
    this.content = comment.content;
    this.commentatorInfo = {
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin,
    };
    this.createdAt = comment.createdAt;
    this.likesInfo = new LikesInfoView(comment, userReaction);
  }
}
