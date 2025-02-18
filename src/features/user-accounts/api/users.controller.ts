import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { CreateUserInputDto } from './dto/user.input-dto';
import { SkipThrottle } from '@nestjs/throttler';
import { SQLUsersQueryRepository } from '../infrastructure/user-sql.query-repository';
import { BasicAuthGuard } from '../guards/basic/basic-auth.guard';
import { GetUsersQueryParams } from './dto/get-users-query-params.input-dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserAdminCommand } from '../application/useCases/admin/create-user-admin.usecase';

@UseGuards(BasicAuthGuard)
@SkipThrottle()
@Controller('sa/users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private sqlUsersQueryRepository: SQLUsersQueryRepository,
    private commandBus: CommandBus,
  ) {}
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.sqlUsersQueryRepository.findByIdOrNotFoundFail(id);
  }
  @Get()
  async getAll(@Query() query: GetUsersQueryParams) {
    return this.sqlUsersQueryRepository.findAll(query);
  }
  @Post()
  async create(@Body() body: CreateUserInputDto) {
    const userId = await this.commandBus.execute(
      new CreateUserAdminCommand(body),
    );
    return this.sqlUsersQueryRepository.findByIdOrNotFoundFail(userId);
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return await this.usersService.delete(id);
  }
}
