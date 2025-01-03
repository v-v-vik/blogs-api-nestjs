import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersRepository } from '../infrastructure/user.repository';
import { User, UserModelType } from '../domain/user.entity';
import {
  CreateUserModel,
  UpdateUserModel,
} from '../domain/dto/user.create-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    private usersRepository: UsersRepository,
  ) {}

  async createUser(dto: CreateUserModel): Promise<string> {
    //TODO: move bcrypt to a separate class
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.UserModel.createInstance({
      email: dto.email,
      login: dto.login,
      password: passwordHash,
    });
    await this.usersRepository.save(user);
    return user._id.toString();
  }

  async updateUser(id: string, dto: UpdateUserModel): Promise<string> {
    const user = await this.usersRepository.findOneOrNotFoundFail(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.update(dto);
    await this.usersRepository.save(user);
    return user._id.toString();
  }

  async deleteUser(id: string) {
    const user = await this.usersRepository.findOneOrNotFoundFail(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.flagAsDeleted();
    await this.usersRepository.save(user);
  }
}
