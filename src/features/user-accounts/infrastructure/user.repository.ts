import {
  DeletionStatus,
  User,
  UserDocument,
  UserModelType,
} from '../domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  async findById(id: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      _id: id,
      deletionStatus: DeletionStatus.NotDeleted,
    });
  }

  async save(user: UserDocument) {
    await user.save();
  }

  async findOneOrNotFoundFail(id: string): Promise<UserDocument | null> {
    return this.findById(id);
  }
}
