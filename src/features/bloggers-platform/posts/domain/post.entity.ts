import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikesInfo, LikesInfoSchema } from './likes-info.schema';
import { DeletionStatus } from '../../../user-accounts/domain/user.entity';
import { UpdateBlogDomainDto } from '../../blogs/domain/dto/blog.domain-dto';
import { HydratedDocument, Model } from 'mongoose';
import { Blog } from '../../blogs/domain/blog.entity';

@Schema({ timestamps: true })
export class Post {
  //   export type PostDBType = {
  //   _id: ObjectId,
  //   title: string,
  //   shortDescription: string,
  //   content: string,
  //   blogId: string,
  //   blogName: string,
  //   createdAt: string,
  //   extendedLikesInfo: PostLikesInfo
  // }
  //
  //   export type PostInputModel = {
  //   title: string,
  //   shortDescription: string,
  //   content: string,
  //   blogId: string
  // }

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

  static createInstance(dto: CreatePostDomainDto) {
    const post = new this();
    post.title = dto.title;
    post.shortDescription = dto.description;
    post.content = dto.content;
    post.blogId = dto.blogId;
    post.blogName = dto.blogName;

    return post as PostDocument;
  }

  flagAsDeleted() {
    if (this.deletionStatus !== DeletionStatus.NotDeleted) {
      throw new Error('Entity already deleted');
    }
    this.deletionStatus = DeletionStatus.PermanentDeleted;
  }

  update(dto: UpdatePostDomainDto) {
    this.title = dto.title;
    this.shortDescription = dto.shortDescription;
    this.content = dto.content;
    this.blogId = dto.blogId;
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.loadClass(Post);

export type PostDocument = HydratedDocument<Post>;

export type PostModelType = Model<PostDocument> & typeof Post;
