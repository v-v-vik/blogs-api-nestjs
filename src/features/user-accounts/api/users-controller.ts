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
import { CreateUserDto } from '../dto/user.create-dto';
import { GetUsersQueryParams } from './dto/get-users-query-params.input-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { UsersQueryRepository } from '../infrastructure/user.query-repository';
import { UserViewDto } from './dto/user.view-dto';

@Controller('users')
export class UsersController {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private usersService: UsersService,
  ) {}
  @Get(':id')
  async getById(@Param('id') id: string): Promise<UserViewDto> {
    return this.usersQueryRepository.getByIdOrNotFoundFail(id);
  }
  @Get()
  async getAll(
    @Query() query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    return this.usersQueryRepository.getAll(query);
  }
  @Post()
  async create(@Body() body: CreateUserDto): Promise<UserViewDto> {
    const userId = await this.usersService.create(body);
    return this.usersQueryRepository.getByIdOrNotFoundFail(userId);
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return await this.usersService.delete(id);
  }
}
