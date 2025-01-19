import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  LikesInfo,
  LikesInfoSchema,
} from '../../likes/domain/likes-info.schema';
import { HydratedDocument, Model } from 'mongoose';
import {
  CreatePostDomainDto,
  UpdatePostDomainDto,
} from './dto/post.domain-dto';
import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: String, require: true })
  title: string;

  @Prop({ type: String, require: true })
  shortDescription: string;

  @Prop({ type: String, require: true })
  content: string;

  @Prop({ type: String, require: true })
  blogId: string;

  @Prop({ type: String, require: true })
  blogName: string;

  @Prop({ type: String, require: true })
  createdAt: string;

  @Prop({ type: LikesInfoSchema, require: true })
  extendedLikesInfo: LikesInfo;

  @Prop({ type: String, default: DeletionStatus.NotDeleted })
  deletionStatus: DeletionStatus;

  static createInstance(dto: CreatePostDomainDto): PostDocument {
    const post = new this();
    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = dto.blogId;
    post.blogName = dto.blogName;
    post.createdAt = new Date().toISOString();
    post.extendedLikesInfo = {
      likesCount: 0,
      dislikesCount: 0,
    };

    return post as PostDocument;
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
    this.blogName = dto.blogName;
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.loadClass(Post);

export type PostDocument = HydratedDocument<Post>;

export type PostModelType = Model<PostDocument> & typeof Post;
