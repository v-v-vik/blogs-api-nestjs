import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateUserDomainDto } from './dto/user.domain-dto';
import { DeletionStatus } from '../../../core/dto/deletion-status.enum';
import {
  AccountDetailSchema,
  UserAccountDetails,
} from './account-details.schema';
import {
  UserConfirmationData,
  UserConfirmationDataSchema,
} from './confirmation-data.schema';
import add from 'date-fns/add';
import { randomUUID } from 'node:crypto';

export enum AccountStatus {
  NotConfirmed = 0,
  Confirmed = 1,
}

@Schema({ timestamps: true })
export class User {
  @Prop({ type: AccountDetailSchema, required: true })
  accountData: UserAccountDetails;

  @Prop({ type: UserConfirmationDataSchema, required: true })
  emailConfirmation: UserConfirmationData;

  @Prop({ type: String, default: DeletionStatus.NotDeleted })
  deletionStatus: DeletionStatus;

  static createInstance(dto: CreateUserDomainDto): UserDocument {
    const user = new this();
    user.accountData = {
      login: dto.login,
      email: dto.email,
      passwordHash: dto.passwordHash,
      createdAt: new Date().toISOString(),
    };
    user.emailConfirmation = {
      confirmationCode: randomUUID(),
      expirationDate: add(new Date(), {
        hours: 1,
        minutes: 2,
      }),
      status: AccountStatus.NotConfirmed,
    };
    user.deletionStatus = DeletionStatus.NotDeleted;

    return user as UserDocument;
  }

  flagAsDeleted() {
    if (this.deletionStatus !== DeletionStatus.NotDeleted) {
      throw new Error('User already deleted');
    }
    this.deletionStatus = DeletionStatus.PermanentDeleted;
  }

  flagAsConfirmed() {
    if (this.emailConfirmation.status === AccountStatus.Confirmed) {
      throw new Error('User already confirmed');
    }
    this.emailConfirmation.status = AccountStatus.Confirmed;
  }

  updateCode(code: string) {
    this.emailConfirmation.confirmationCode = code;
    this.emailConfirmation.expirationDate = add(new Date(), {
      hours: 1,
      minutes: 2,
    });
  }

  updatePassword(hashedPassword: string) {
    this.accountData.passwordHash = hashedPassword;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.loadClass(User);

export type UserDocument = HydratedDocument<User>;

export type UserModelType = Model<UserDocument> & typeof User;
