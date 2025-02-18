import { LikesInfo } from '../../likes/domain/likes-info.schema';
import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';
import {
  CreatePostDomainDto,
  UpdatePostDomainDto,
} from './dto/post.domain-dto';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { PostSQLDto } from './dto/post.sql-dto';

export class Post {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
  };
  deletionStatus: string;

  static createNewInstance(dto: CreatePostDomainDto): Post {
    const post = new this();
    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = dto.blogId;

    return post as Post;
  }

  static createFromExistingDataInstance(dbPost: PostSQLDto): Post {
    const post = new this();
    post.id = dbPost.id.toString();
    post.title = dbPost.title;
    post.shortDescription = dbPost.shortDescription;
    post.content = dbPost.content;
    post.blogId = dbPost.blogId.toString();
    post.blogName = dbPost.blogName;
    post.createdAt = dbPost.createdAt;
    post.extendedLikesInfo = {
      likesCount: dbPost.likesCount,
      dislikesCount: dbPost.dislikesCount,
    };
    post.deletionStatus = dbPost.deletionStatus;

    return post as Post;
  }

  flagAsDeleted() {
    if (this.deletionStatus !== DeletionStatus.NotDeleted) {
      throw NotFoundDomainException.create('Entity already deleted');
    }
    this.deletionStatus = DeletionStatus.PermanentDeleted;
  }

  update(dto: UpdatePostDomainDto) {
    this.title = dto.title;
    this.shortDescription = dto.shortDescription;
    this.content = dto.content;
    this.blogId = dto.blogId;
  }

  updateLikeCount(dto: LikesInfo) {
    this.extendedLikesInfo = {
      likesCount: dto.likesCount,
      dislikesCount: dto.dislikesCount,
    };
  }
}
