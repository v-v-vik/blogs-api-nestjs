import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  Body,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from '../application/users-service';
import { CreateUserModel } from '../domain/dto/user.create-dto';
import { GetUsersQueryParams } from './dto/get-users-query-params.input-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { UserViewModel } from './dto/user.view-dto';
import { UsersQueryRepository } from '../infrastructure/user.query-repository';

@Controller('users')
export class UsersController {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private usersService: UsersService,
  ) {}
  @Get(':id')
  async getById(@Param('id') id: string): Promise<UserViewModel> {
    return this.usersQueryRepository.getByIdOrNotFoundFail(id);
  }
  @Get()
  async getAll(
    @Query() query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewModel[]>> {
    return this.usersQueryRepository.getAll(query);
  }
  @Post()
  async create(@Body() body: CreateUserModel): Promise<UserViewModel> {
    const userId = await this.usersService.create(body);
    return this.usersQueryRepository.getByIdOrNotFoundFail(userId);
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return await this.usersService.delete(id);
  }
}
