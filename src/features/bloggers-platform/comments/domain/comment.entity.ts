// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import {
//   LikesInfo,
//   LikesInfoSchema,
// } from '../../likes/domain/likes-info.schema';
// import {
//   CommentatorInfo,
//   CommentatorInfoSchema,
// } from './commentator-info.schema';
// import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';
// import { HydratedDocument, Model } from 'mongoose';
// import {
//   CreateCommentDomainDto,
//   UpdateCommentDomainDto,
// } from './dto/comment.domain-dto';
// import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
//
// @Schema({ timestamps: true })
// export class Comment {
//   @Prop({ type: String, require: true })
//   content: string;
//
//   @Prop({ type: CommentatorInfoSchema, require: true })
//   commentatorInfo: CommentatorInfo;
//
//   @Prop({ type: String, require: true })
//   createdAt: string;
//
//   @Prop({ type: String, require: true })
//   postId: string;
//
//   @Prop({ type: LikesInfoSchema, require: true })
//   likesInfo: LikesInfo;
//
//   @Prop({ type: String, default: DeletionStatus.NotDeleted })
//   deletionStatus: DeletionStatus;
//
//   static createInstance(dto: CreateCommentDomainDto): CommentDocument {
//     const comment = new this();
//     comment.content = dto.content;
//     comment.commentatorInfo = {
//       userId: dto.userId,
//       userLogin: dto.userLogin,
//     };
//     comment.createdAt = new Date().toISOString();
//     comment.postId = dto.postId;
//     comment.likesInfo = {
//       likesCount: 0,
//       dislikesCount: 0,
//     };
//
//     return comment as CommentDocument;
//   }
//
//   flagAsDeleted() {
//     if (this.deletionStatus !== DeletionStatus.NotDeleted) {
//       throw NotFoundDomainException.create('Entity already deleted');
//     }
//     this.deletionStatus = DeletionStatus.PermanentDeleted;
//   }
//
//   update(dto: UpdateCommentDomainDto) {
//     this.content = dto.content;
//   }
//
//   updateLikeCount(dto: LikesInfo) {
//     this.likesInfo = {
//       likesCount: dto.likesCount,
//       dislikesCount: dto.dislikesCount,
//     };
//   }
// }
//
// export const CommentSchema = SchemaFactory.createForClass(Comment);
//
// CommentSchema.loadClass(Comment);
//
// export type CommentDocument = HydratedDocument<Comment>;
//
// export type CommentModelType = Model<Comment> & typeof Comment;
