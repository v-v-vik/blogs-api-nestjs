import { Injectable } from '@nestjs/common';
import { LikeStatus } from '../domain/like.entity';
import { Post } from '../../posts/domain/post.entity';
import { Comment } from '../../comments/domain/comment.entity';
import { LikesInfo } from '../dto/like.main-dto';

Injectable();
export class LikeService {
  constructor() {}

  async changeLikeCount(
    currReaction: LikeStatus,
    newReaction: LikeStatus,
    entity: Comment | Post,
    entityType: 'comment' | 'post',
  ): Promise<LikesInfo> {
    const likeInfoProperty =
      entityType === 'post' ? 'extendedLikesInfo' : 'likesInfo';
    const likeInfo = entity[likeInfoProperty];
    const { likesCount, dislikesCount } = likeInfo;
    const updatedReactionCount: LikesInfo = {
      likesCount,
      dislikesCount,
    };

    if (newReaction === LikeStatus.Like) {
      updatedReactionCount.likesCount = (likesCount || 0) + 1;
      if (currReaction === LikeStatus.Dislike) {
        updatedReactionCount.dislikesCount = (dislikesCount || 0) - 1;
      }
    } else if (newReaction === LikeStatus.Dislike) {
      updatedReactionCount.dislikesCount = (dislikesCount || 0) + 1;
      if (currReaction === LikeStatus.Like) {
        updatedReactionCount.likesCount = (likesCount || 0) - 1;
      }
    } else if (newReaction === LikeStatus.None) {
      if (currReaction === LikeStatus.Like) {
        updatedReactionCount.likesCount = (likesCount || 0) - 1;
      } else if (currReaction === LikeStatus.Dislike) {
        updatedReactionCount.dislikesCount = (dislikesCount || 0) - 1;
      }
    }
    return updatedReactionCount;
  }
}
