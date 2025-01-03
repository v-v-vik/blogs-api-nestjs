import {
  DeletionStatus,
  User,
  UserDocument,
  UserModelType,
} from '../domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { UserViewModel } from '../api/dto/user.view-dto';
import { NotFoundException } from '@nestjs/common';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { FilterQuery } from 'mongoose';
import { GetUsersQueryParams } from '../api/dto/get-users-query-params.input-dto';

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
  async getAll(
    query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewModel[]>> {
    const filter: FilterQuery<User> = {};
    if (query.searchLoginTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        login: { $regex: query.searchLoginTerm, $options: 'i' },
      });
    }
    if (query.searchEmailTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        login: { $regex: query.searchEmailTerm, $options: 'i' },
      });
    }
    const users = await this.UserModel.find({
      ...filter,
      deletionStatus: DeletionStatus.NotDeleted,
    })
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);
    const totalCount = await this.UserModel.countDocuments(filter);
    const items = users.map((user: UserDocument) => new UserViewModel(user));
    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
