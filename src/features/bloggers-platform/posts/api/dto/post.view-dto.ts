// import { LikeStatus } from '../../../likes/domain/like.entity';
// import { PostSQLDto } from '../../domain/dto/post.sql-dto';
// import { LikeSQLDto } from '../../../likes/domain/dto/like.sql-dto';
//
// // const likeInfoMapper = (reaction: LikeDBType) => ({
// //   addedAt: reaction.createdAt,
// //   userId: reaction.authorId,
// //   login: reaction.authorLogin
// // })
//
// export class NewestLikesViewDto {
//   addedAt: string;
//   userId: string;
//   login: string;
//
//   constructor(reaction: LikeSQLDto) {
//     //mapper for array "latestLikes" to be added in the main/final mapper
//     this.addedAt = reaction.createdAt.toISOString();
//     this.userId = reaction.authorId.toString();
//     this.login = reaction.authorLogin;
//   }
// }
//
// class ExtLikesInfo {
//   likesCount: number;
//   dislikesCount: number;
//   myStatus: LikeStatus;
//   newestLikes: NewestLikesViewDto[];
//
//   constructor(
//     post: PostSQLDto,
//     userReaction: LikeStatus,
//     latestLikes: NewestLikesViewDto[],
//   ) {
//     this.likesCount = post.likesCount;
//     this.dislikesCount = post.dislikesCount;
//     this.myStatus = userReaction;
//     this.newestLikes = latestLikes;
//   }
// }
//
// export class PostViewDto {
//   id: string;
//   title: string;
//   shortDescription: string;
//   content: string;
//   blogId: string;
//   blogName: string;
//   createdAt: string;
//   extendedLikesInfo: ExtLikesInfo;
//
//   constructor(
//     post: PostSQLDto,
//     userReaction: LikeStatus,
//     latestLikes: NewestLikesViewDto[],
//   ) {
//     this.id = post.id.toString();
//     this.title = post.title;
//     this.shortDescription = post.shortDescription;
//     this.content = post.content;
//     this.blogId = post.blogId.toString();
//     this.blogName = post.blogName;
//     this.createdAt = post.createdAt.toISOString();
//     this.extendedLikesInfo = new ExtLikesInfo(post, userReaction, latestLikes);
//   }
// }
