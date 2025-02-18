import { DeletionStatus } from '../../../../../core/dto/deletion-status.enum';
import { LikeStatus } from '../../../likes/domain/like.entity';

export class CommentSQLDto {
  id: number;
  content: string;
  userId: number;
  userLogin: string;
  createdAt: Date;
  postId: number;
  likesCount: number;
  dislikesCount: number;
  userReaction: LikeStatus;
  deletionStatus: DeletionStatus;
}
