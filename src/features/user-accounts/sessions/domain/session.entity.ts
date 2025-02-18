// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';
// import { HydratedDocument, Model } from 'mongoose';
// import { SessionDomainDto } from './dto/session.domain-dto';
// import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
//
// @Schema({ timestamps: true })
// export class Session {
//   @Prop({ type: String, require: true })
//   ip: string;
//
//   @Prop({ type: String, require: true })
//   title: string;
//
//   @Prop({ type: String, require: true })
//   lastActiveDate: string;
//
//   @Prop({ type: String, require: true })
//   deviceId: string;
//
//   @Prop({ type: String, require: true })
//   userId: string;
//
//   @Prop({ type: String, require: true })
//   expDate: string;
//
//   @Prop({ type: String, default: DeletionStatus.NotDeleted })
//   deletionStatus: DeletionStatus;
//
//   static createInstance(dto: SessionDomainDto) {
//     const session = new this();
//     session.ip = dto.ip;
//     session.title = dto.title;
//     session.lastActiveDate = dto.lastActiveDate;
//     session.deviceId = dto.deviceId;
//     session.userId = dto.userId;
//     session.expDate = dto.expDate;
//
//     return session as SessionDocument;
//   }
//
//   flagAsDeleted() {
//     if (this.deletionStatus !== DeletionStatus.NotDeleted) {
//       throw NotFoundDomainException.create('Entity already deleted');
//     }
//     this.deletionStatus = DeletionStatus.PermanentDeleted;
//   }
//
//   update(iat: string) {
//     this.lastActiveDate = iat;
//   }
// }
//
// export const sessionSchema = SchemaFactory.createForClass(Session);
//
// sessionSchema.loadClass(Session);
//
// export type SessionDocument = HydratedDocument<Session>;
//
// export type SessionModelType = Model<SessionDocument> & typeof Session;
