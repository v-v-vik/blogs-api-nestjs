import { LikeStatus } from '../domain/like.entity';

export class ReactionDto {
  likeStatus: LikeStatus;
}

export class LikesInfo {
  likesCount: number;
  dislikesCount: number;
}
