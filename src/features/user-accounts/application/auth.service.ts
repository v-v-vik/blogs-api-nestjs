import { InjectModel } from '@nestjs/mongoose';
import { AccountStatus, User, UserModelType } from '../domain/user.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '../infrastructure/user.repository';
import { BcryptService } from './bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../../notifications/email.service';
import { randomUUID } from 'node:crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    private usersRepository: UsersRepository,
    private bcryptService: BcryptService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async loginUser(userId: string): Promise<{ accessToken: string }> {
    //ip, usersAgent ) {
    //deviceId creation logic
    //RT creation
    //adding session to DB
    const token = this.jwtService.sign(
      {
        id: userId,
      },
      {
        secret: 'access-token-secret',
        expiresIn: '5m',
      },
    );
    return { accessToken: token };
  }

  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) {
      throw new UnauthorizedException(`User ${loginOrEmail} not found`);
    }
    if (user.emailConfirmation.status === AccountStatus.NotConfirmed) {
      throw new UnauthorizedException(
        `User ${user.accountData.login} is not confirmed`,
      );
    }
    const isPasswordCorrect = await this.bcryptService.checkPassword(
      password,
      user.accountData.passwordHash,
    );
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Wrong Password');
    }
    return user;
  }

  async confirmRegistration(code: string) {
    const foundUser = await this.usersRepository.findByCode(code);
    if (!foundUser) {
      throw new BadRequestException(`User with ${code} not found`);
    }
    if (foundUser.emailConfirmation.status === AccountStatus.Confirmed) {
      throw new BadRequestException(`${code} was already applied`);
    }
    if (foundUser.emailConfirmation.expirationDate <= new Date()) {
      throw new BadRequestException(`${code} has expired`);
    }
    foundUser.flagAsConfirmed();
    await this.usersRepository.save(foundUser);
  }

  async resendConfirmationEmail(email: string) {
    const foundUser = await this.usersRepository.findByLoginOrEmail(email);
    if (!foundUser) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    const newCode = randomUUID();
    foundUser.updateCode(newCode);
    await this.usersRepository.save(foundUser);
    this.emailService
      .sendRegistrationConfirmationEmail(
        foundUser.accountData.email,
        foundUser.emailConfirmation.confirmationCode,
      )
      .catch((error) => console.log('error when trying to send email', error));
  }

  async passwordRecovery(email: string) {
    const newCode = this.jwtService.sign(
      { id: email },
      {
        secret: 'password-code-secret',
        expiresIn: '5m',
      },
    );
    this.emailService
      .sendPasswordRecoveryEmail(email, newCode)
      .catch((error) => console.log('error when trying to send email', error));
  }

  async passwordUpdate(newPassword: string, code: string) {
    const codePayload = await this.jwtService.verify(code);
    if (!codePayload) {
      throw new BadRequestException(`${code} is not valid or expired`);
    }
    const foundUser = await this.usersRepository.findByLoginOrEmail(
      codePayload.email,
    );
    if (!foundUser) {
      throw new BadRequestException(
        `No user with email ${codePayload.email} found`,
      );
    }
    const newHashedPassword =
      await this.bcryptService.passwordHash(newPassword);
    foundUser.updatePassword(newHashedPassword);
    await this.usersRepository.save(foundUser);
  }
}
