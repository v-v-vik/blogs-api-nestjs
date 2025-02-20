import { LikeStatus } from '../../../likes/domain/like.entity';

// export class PostSQLDto {
//   id: number;
//   title: string;
//   shortDescription: string;
//   content: string;
//   blogId: number;
//   blogName: string;
//   createdAt: Date;
//   likesCount: number;
//   dislikesCount: number;
//   userReaction: LikeStatus;
//   deletionStatus: string;
//   likeDate1: Date;
//   likeDate2: Date;
//   likeDate3: Date;
//   likeUserId1: number;
//   likeUserId2: number;
//   likeUserId3: number;
//   likeUserLogin1: string;
//   likeUserLogin2: string;
//   likeUserLogin3: string;
// }

export class PostSQLDto {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  blogId: number;
  blog: {
    name: string;
  };
  createdAt: Date;
  likesCount: number;
  dislikesCount: number;
  userReaction: LikeStatus;
  deletionStatus: string;
}
