import { Injectable } from '@nestjs/common';
import { LikesInfo } from '../domain/likes-info.schema';
import { LikeStatus } from '../domain/like.entity';
import { CommentDocument } from '../../comments/domain/comment.entity';
import { PostDocument } from '../../posts/domain/post.entity';

Injectable();
export class LikeService {
  constructor() {}

  async changeLikeCount(
    currReaction: LikeStatus,
    newReaction: LikeStatus,
    entity: CommentDocument | PostDocument,
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
