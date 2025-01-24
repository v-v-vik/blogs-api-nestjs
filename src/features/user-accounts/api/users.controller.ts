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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { GetUsersQueryParams } from './dto/get-users-query-params.input-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { UsersQueryRepository } from '../infrastructure/user.query-repository';
import { UserViewDto } from './dto/user.view-dto';
import { ObjectIdValidationPipe } from '../../../core/pipes/objectId-validation-pipe';
import { BasicAuthGuard } from '../guards/basic/basic-auth.guard';
import { CreateUserInputDto } from './dto/user.input-dto';
import { SkipThrottle } from '@nestjs/throttler';

@UseGuards(BasicAuthGuard)
@SkipThrottle()
@Controller('users')
export class UsersController {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private usersService: UsersService,
  ) {}
  @Get(':id')
  async getById(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<UserViewDto> {
    return this.usersQueryRepository.getByIdOrNotFoundFail(id);
  }
  @Get()
  async getAll(
    @Query() query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    return this.usersQueryRepository.getAll(query);
  }
  @Post()
  async create(@Body() body: CreateUserInputDto): Promise<UserViewDto> {
    const userId = await this.usersService.create(body);
    return this.usersQueryRepository.getByIdOrNotFoundFail(userId);
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ObjectIdValidationPipe) id: string): Promise<void> {
    return await this.usersService.delete(id);
  }
}
