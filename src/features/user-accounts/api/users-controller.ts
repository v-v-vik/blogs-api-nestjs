import { Controller, Get, Post, Query, Param, Body, Delete, HttpStatus, HttpCode } from "@nestjs/common";
import { UsersService } from '../application/users-service';

@Controller('users')
export class UsersController {
  constructor(
    private UsersQueryRepository,
    private usersService: UsersService,
  ) {}
  @Get(':id')
  async getById(@Param('id') id: string): Promise<UserViewModel> {
    return this.usersQueryRepository.getByIdOrNotFoundFail(id);
  }
  @Get()
  async getAll(@Query() query: any): Promise<UserViewModel[]> {
    return this.UsersQueryRepository.getAll(query);
  }
  @Post()
  async create(@Body() body: InputUserModel): Promise<UserViewModel> {
    const userId = await this.usersService.create(body);
    return this.UsersQueryRepository.getByIdOrNotFoundFail(userId);
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return await this.userService.delete(id);
  }
}
