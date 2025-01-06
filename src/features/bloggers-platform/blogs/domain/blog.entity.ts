import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DeletionStatus } from '../../../user-accounts/domain/user.entity';
import { HydratedDocument, Model } from 'mongoose';
import {
  CreateBlogDomainDto,
  UpdateBlogDomainDto,
} from './dto/blog.domain-dto';

@Schema({ timestamps: true })
export class Blog {
  @Prop({ type: String, require: true })
  name: string;

  @Prop({ type: String, require: true })
  description: string;

  @Prop({ type: String, require: true })
  websiteUrl: string;

  @Prop({ type: String, require: true })
  createdAt: string;

  @Prop({ type: Boolean, default: false })
  isMembership: boolean;

  @Prop({ type: String, default: DeletionStatus.NotDeleted })
  deletionStatus: DeletionStatus;

  static createInstance(dto: CreateBlogDomainDto): BlogDocument {
    const blog = new this();
    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;

    return blog as BlogDocument;
  }

  flagAsDeleted() {
    if (this.deletionStatus !== DeletionStatus.NotDeleted) {
      throw new Error('Entity already deleted');
    }
    this.deletionStatus = DeletionStatus.PermanentDeleted;
  }

  update(dto: UpdateBlogDomainDto) {
    this.name = dto.name;
    this.description = dto.description;
    this.websiteUrl = dto.websiteUrl;
  }
  //changeMembershipStatus()
}
export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.loadClass(Blog);

export type BlogDocument = HydratedDocument<Blog>;

export type BlogModelType = Model<BlogDocument> & typeof Blog;
