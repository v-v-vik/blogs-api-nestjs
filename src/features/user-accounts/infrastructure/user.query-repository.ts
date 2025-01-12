import { User, UserDocument, UserModelType } from '../domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { FilterQuery } from 'mongoose';
import { GetUsersQueryParams } from '../api/dto/get-users-query-params.input-dto';
import { UserViewDto } from '../api/dto/user.view-dto';
import { DeletionStatus } from '../../../core/dto/deletion-status.enum';
import { InfoUserViewDto } from '../api/dto/auth/user-info.view-dto';

export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
  ) {}

  async aboutMeInfo(userId: string): Promise<InfoUserViewDto | null> {
    const user = await this.UserModel.findOne({
      _id: userId,
    });
    if (!user) {
      return null;
    }
    return new InfoUserViewDto(user);
  }

  async getByIdOrNotFoundFail(id: string): Promise<UserViewDto> {
    const user = await this.UserModel.findOne({
      _id: id,
      deletionStatus: DeletionStatus.NotDeleted,
    }).exec();
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return new UserViewDto(user);
  }

  async getAll(
    query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    const filter: FilterQuery<User> = {
      deletionStatus: DeletionStatus.NotDeleted,
    };
    if (query.searchLoginTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        login: { $regex: query.searchLoginTerm, $options: 'i' },
      });
    }
    if (query.searchEmailTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        email: { $regex: query.searchEmailTerm, $options: 'i' },
      });
    }
    const users = await this.UserModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);
    const totalCount = await this.UserModel.countDocuments(filter);
    const items = users.map((user: UserDocument) => new UserViewDto(user));
    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
