import { DeletionStatus, User, UserModelType } from '../domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { UserViewModel } from '../api/dto/user.view-dto';
import { NotFoundException } from '@nestjs/common';

export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
  ) {}

  async getByIdOrNotFoundFail(id: string): Promise<UserViewModel> {
    const user = await this.UserModel.findOne({
      _id: id,
      deletionStatus: DeletionStatus.NotDeleted,
    }).exec();
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return new UserViewModel(user);
  }
  //TODO add pagination & filter
  async getAll(): Promise<UserViewModel[]> {
    // const res = await this.UserModel.find({}).exec();
    // const allUsers = [];
    // res.map((user) => allUsers.push(new UserViewModel(user)));
    // return allUsers;
  }
}
