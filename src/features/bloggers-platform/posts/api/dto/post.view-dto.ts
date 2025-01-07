import { PostDocument } from '../../domain/post.entity';
import { LikeDocument, LikeStatus } from '../../../likes/domain/like.entity';

// const likeInfoMapper = (reaction: LikeDBType) => ({
//   addedAt: reaction.createdAt,
//   userId: reaction.authorId,
//   login: reaction.authorLogin
// })

export class NewestLikesViewDto {
  addedAt: string;
  userId: string;
  login: string;

  constructor(reaction: LikeDocument) {
    //mapper for array "latestLikes" to be added in the main/final mapper
    this.addedAt = reaction.createdAt;
    this.userId = reaction.authorId;
    this.login = reaction.authorLogin;
  }
}

class ExtLikesInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: NewestLikesViewDto[];

  constructor(
    post: PostDocument,
    userReaction: LikeStatus,
    latestLikes: NewestLikesViewDto[],
  ) {
    this.likesCount = post.extendedLikesInfo.likesCount;
    this.dislikesCount = post.extendedLikesInfo.dislikesCount;
    this.myStatus = userReaction;
    this.newestLikes = latestLikes;
  }
}

export class PostViewDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtLikesInfo;

  constructor(
    post: PostDocument,
    userReaction: LikeStatus,
    latestLikes: NewestLikesViewDto[],
  ) {
    this.id = post._id.toString();
    this.title = post.title;
    this.shortDescription = post.shortDescription;
    this.content = post.content;
    this.blogId = post.blogId;
    this.blogName = post.blogName;
    this.createdAt = post.createdAt;
    this.extendedLikesInfo = new ExtLikesInfo(post, userReaction, latestLikes);
  }
}
