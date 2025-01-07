import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';
import { HydratedDocument, Model } from 'mongoose';

export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

@Schema()
export class Like {
  @Prop({ type: String, require: true })
  createdAt: string;

  @Prop({ type: String, require: true })
  status: LikeStatus;

  @Prop({ type: String, require: true })
  authorId: string;

  @Prop({ type: String, require: true })
  authorLogin: string;

  @Prop({ type: String, require: true })
  parentId: string;

  @Prop({ type: String, require: true })
  deletionStatus: DeletionStatus;

  static createInstance() {}

  flagAsDeleted() {}
}

export const LikeSchema = SchemaFactory.createForClass(Like);

LikeSchema.loadClass(Like);

export type LikeDocument = HydratedDocument<Like>;

export type LikeModelType = Model<LikeDocument> & typeof Like;
