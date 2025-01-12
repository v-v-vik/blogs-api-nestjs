import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersRepository } from '../infrastructure/user.repository';
import { User, UserModelType } from '../domain/user.entity';
import { CreateUserDto } from '../dto/user.main-dto';
import { BcryptService } from './bcrypt.service';
import { EmailService } from '../../notifications/email.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    private usersRepository: UsersRepository,
    private bcryptService: BcryptService,
    private emailService: EmailService,
  ) {}

  async create(dto: CreateUserDto): Promise<string> {
    const passwordHash = await this.bcryptService.passwordHash(dto.password);
    const user = this.UserModel.createInstance({
      email: dto.email,
      login: dto.login,
      passwordHash: passwordHash,
    });
    user.flagAsConfirmed();
    await this.usersRepository.save(user);
    return user._id.toString();
  }

  async delete(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.flagAsDeleted();
    await this.usersRepository.save(user);
  }

  async register(dto: CreateUserDto) {
    const { login, password, email } = dto;
    const user = await this.usersRepository.findByLoginAndEmail(login, email);
    const errors: any = [];
    if (user?.accountData.login === login) {
      errors.push({ field: 'login', message: 'Login already exists' });
    }
    if (user?.accountData.email === email) {
      errors.push({ field: 'email', message: 'Email already exists' });
    }
    if (errors.length > 0) {
      throw new BadRequestException({ errorMessages: errors });
    }
    const passwordHash = await this.bcryptService.passwordHash(password);
    const newUser = this.UserModel.createInstance({
      email: dto.email,
      login: dto.login,
      passwordHash: passwordHash,
    });
    this.emailService
      .sendRegistrationConfirmationEmail(
        newUser.accountData.email,
        newUser.emailConfirmation.confirmationCode,
      )
      .catch((error) => console.log('error when trying to send email', error));
    await this.usersRepository.save(newUser);
  }
}
