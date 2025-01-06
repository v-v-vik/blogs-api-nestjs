import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersRepository } from '../infrastructure/user.repository';
import { User, UserModelType } from '../domain/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dto/user.create-dto';
import { BcryptService } from '../adapters/bcrypt-service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    private usersRepository: UsersRepository,
    private bcryptService: BcryptService,
  ) {}

  async create(dto: CreateUserDto): Promise<string> {
    const passwordHash = await this.bcryptService.passwordHash(dto.password);
    const user = this.UserModel.createInstance({
      email: dto.email,
      login: dto.login,
      passwordHash: passwordHash,
    });
    await this.usersRepository.save(user);
    return user._id.toString();
  }

  async update(id: string, dto: UpdateUserDto): Promise<string> {
    const user = await this.usersRepository.findOneOrNotFoundFail(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.update(dto);
    await this.usersRepository.save(user);
    return user._id.toString();
  }

  async delete(id: string) {
    const user = await this.usersRepository.findOneOrNotFoundFail(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.flagAsDeleted();
    await this.usersRepository.save(user);
  }
}
