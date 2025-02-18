import { LikeStatus } from '../../../likes/domain/like.entity';
import { PostSQLDto } from '../../domain/dto/post.sql-dto';

export class NewestLikesViewDto {
  addedAt: string;
  userId: string;
  login: string;

  constructor(postLikes: {
    createdAt: Date;
    userId: number;
    userLogin: string;
  }) {
    this.addedAt = postLikes.createdAt.toISOString();
    this.userId = postLikes.userId.toString();
    this.login = postLikes.userLogin;
  }
}

class ExtLikesInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: NewestLikesViewDto[];

  constructor(post: PostSQLDto, userReaction: LikeStatus) {
    this.likesCount = post.likesCount;
    this.dislikesCount = post.dislikesCount;
    this.myStatus = userReaction;
    this.newestLikes = [];

    if (post.likeDate1) {
      this.newestLikes.push(
        new NewestLikesViewDto({
          createdAt: post.likeDate1,
          userId: post.likeUserId1,
          userLogin: post.likeUserLogin1,
        }),
      );
    }
    if (post.likeDate2) {
      this.newestLikes.push(
        new NewestLikesViewDto({
          createdAt: post.likeDate2,
          userId: post.likeUserId2,
          userLogin: post.likeUserLogin2,
        }),
      );
    }
    if (post.likeDate3) {
      this.newestLikes.push(
        new NewestLikesViewDto({
          createdAt: post.likeDate3,
          userId: post.likeUserId3,
          userLogin: post.likeUserLogin3,
        }),
      );
    }
  }
}

export class PostSQLViewDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtLikesInfo;

  constructor(post: PostSQLDto, userReaction: LikeStatus) {
    this.id = post.id.toString();
    this.title = post.title;
    this.shortDescription = post.shortDescription;
    this.content = post.content;
    this.blogId = post.blogId.toString();
    this.blogName = post.blogName;
    this.createdAt = post.createdAt.toISOString();
    this.extendedLikesInfo = new ExtLikesInfo(post, userReaction);
  }
}
