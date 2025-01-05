import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateUserModel, UpdateUserModel } from './dto/user.create-dto';

export enum DeletionStatus {
  NotDeleted = 'not-deleted',
  PermanentDeleted = 'permanent-deleted',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, required: true })
  passwordHash: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String })
  createdAt: string;

  @Prop({ type: String, default: DeletionStatus.NotDeleted })
  deletionStatus: DeletionStatus;

  static createInstance(dto: CreateUserModel): UserDocument {
    const user = new this();
    user.email = dto.email;
    user.passwordHash = dto.password;
    user.login = dto.login;

    return user as UserDocument;
  }

  flagAsDeleted() {
    if (this.deletionStatus !== DeletionStatus.NotDeleted) {
      throw new Error('Entity already deleted');
    }
    this.deletionStatus = DeletionStatus.PermanentDeleted;
  }

  update(dto: UpdateUserModel) {
    this.email = dto.email;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.loadClass(User);

export type UserDocument = HydratedDocument<User>;

export type UserModelType = Model<UserDocument> & typeof User;
