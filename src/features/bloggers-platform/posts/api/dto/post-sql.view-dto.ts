import { PostLike, LikeStatus } from '../../../likes/domain/like.entity';
import { Post } from '../../domain/post.entity';

export class NewestLikesViewDto {
  addedAt: string;
  userId: string;
  login: string;

  constructor(postLike: PostLike) {
    this.addedAt = postLike.createdAt.toISOString();
    this.userId = postLike.authorId.toString();
    this.login = postLike.author.login;
  }
}

class ExtLikesInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: NewestLikesViewDto[];

  constructor(
    post: Post,
    userReaction: LikeStatus,
    newestLikes: NewestLikesViewDto[],
  ) {
    this.likesCount = post.likesCount;
    this.dislikesCount = post.dislikesCount;
    this.myStatus = userReaction;
    this.newestLikes = newestLikes;
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

  constructor(
    post: Post,
    userReaction: LikeStatus,
    newestLikes: NewestLikesViewDto[],
  ) {
    this.id = post.id.toString();
    this.title = post.title;
    this.shortDescription = post.shortDescription;
    this.content = post.content;
    this.blogId = post.blogId.toString();
    this.blogName = post.blog.name;
    this.createdAt = post.createdAt.toISOString();
    this.extendedLikesInfo = new ExtLikesInfo(post, userReaction, newestLikes);
  }
}
