import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Brackets, DataSource } from 'typeorm';
import { NotFoundDomainException } from '../../../core/exceptions/domain-exceptions';
import { InfoUserViewDto } from '../api/dto/auth/user-info.view-dto';
import { UserViewDto } from '../api/dto/user.view-dto';
import { GetUsersQueryParams } from '../api/dto/get-users-query-params.input-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { User } from '../domain/user.entity';
import { DeletionStatus } from '../../../core/dto/deletion-status.enum';
import { SortDirection } from '../../../core/dto/base.query-params.input-dto';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    //@InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async #findOne(userId: string): Promise<User | null> {
    return await this.dataSource
      .getRepository(User)
      .createQueryBuilder('users')
      .where('users.id = :userId', { userId })
      .andWhere('users.deletionStatus = :status', {
        status: DeletionStatus.NotDeleted,
      })
      .getOne();
  }

  async aboutMeInfo(userId: string) {
    const res = await this.#findOne(userId);
    if (!res) {
      return null;
    }
    return new InfoUserViewDto(res);
  }

  async findByIdOrNotFoundFail(userId: string) {
    const res = await this.#findOne(userId);
    if (!res) {
      throw NotFoundDomainException.create('User not found.');
    }
    return new UserViewDto(res);
  }

  async findAll(
    query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    const sortDirection: 'ASC' | 'DESC' =
      query.sortDirection === SortDirection.Asc ? 'ASC' : 'DESC';
    const searchEmail = query.searchEmailTerm
      ? `%${query.searchEmailTerm}%`
      : '%%';
    const searchLogin = query.searchLoginTerm
      ? `%${query.searchLoginTerm}%`
      : '%%';

    const searchResult = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('users')
      .where(
        new Brackets((qb) => {
          qb.where('users.email ILIKE :email', { email: searchEmail }).orWhere(
            'users.login ILIKE :login',
            { login: searchLogin },
          );
        }),
      )
      .andWhere('users.deletionStatus = :status', {
        status: DeletionStatus.NotDeleted,
      })
      .orderBy(`users.${query.sortBy}`, sortDirection)
      .limit(query.pageSize)
      .offset(query.calculateSkip())
      .getMany();

    const items = searchResult.map((user: User) => new UserViewDto(user));
    const totalCount = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('users')
      .where('users.email ILIKE :email', { email: searchEmail })
      .orWhere('users.login ILIKE :login', { login: searchLogin })
      .andWhere('users.deletionStatus = :status', {
        status: DeletionStatus.NotDeleted,
      })
      .getCount();
    return PaginatedViewDto.mapToView({
      items,
      totalCount: totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
