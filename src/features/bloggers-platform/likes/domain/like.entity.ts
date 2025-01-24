import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';
import { HydratedDocument, Model } from 'mongoose';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { ReactionDomainDto } from './dto/like.domain-dto';

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

  @Prop({ type: String, default: DeletionStatus.NotDeleted })
  deletionStatus: DeletionStatus;

  static createInstance(dto: ReactionDomainDto) {
    const reaction = new this();
    reaction.status = dto.status;
    reaction.authorId = dto.authorId;
    reaction.authorLogin = dto.authorLogin;
    reaction.parentId = dto.parentId;
    reaction.createdAt = new Date().toISOString();

    return reaction as LikeDocument;
  }

  flagAsDeleted() {
    if (this.deletionStatus !== DeletionStatus.NotDeleted) {
      throw NotFoundDomainException.create('Entity already deleted');
    }
    this.deletionStatus = DeletionStatus.PermanentDeleted;
  }
}

export const LikeSchema = SchemaFactory.createForClass(Like);

LikeSchema.loadClass(Like);

export type LikeDocument = HydratedDocument<Like>;

export type LikeModelType = Model<LikeDocument> & typeof Like;
