import { Injectable } from '@nestjs/common';
import { BcryptService } from './bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../../notifications/email.service';
import { randomUUID } from 'node:crypto';
import {
  BadRequestDomainException,
  UnauthorizedDomainException,
} from '../../../core/exceptions/domain-exceptions';
import { UsersRepository } from '../infrastructure/user.repository';
import { AccountStatus } from '../domain/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private bcryptService: BcryptService,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) {
      throw UnauthorizedDomainException.create(
        `User ${loginOrEmail} not found`,
      );
    }
    if (user.status === AccountStatus.NotConfirmed) {
      throw UnauthorizedDomainException.create(
        `User ${user.login} is not confirmed`,
      );
    }
    const isPasswordCorrect = await this.bcryptService.checkPassword(
      password,
      user.passwordHash,
    );
    if (!isPasswordCorrect) {
      throw UnauthorizedDomainException.create('Wrong Password');
    }
    return { id: user.id.toString() };
  }

  async confirmRegistration(code: string) {
    const foundUser = await this.usersRepository.findByCode(code);
    if (!foundUser) {
      throw BadRequestDomainException.create(
        `User with ${code} not found`,
        'code',
      );
    }
    if (foundUser.status === AccountStatus.Confirmed) {
      throw BadRequestDomainException.create(
        `${code} was already applied`,
        'code',
      );
    }
    if (foundUser.confirmCodeExpiryDate <= new Date()) {
      throw BadRequestDomainException.create(`${code} has expired`, 'code');
    }
    foundUser.flagAsConfirmed();
    await this.usersRepository.save(foundUser);
  }

  async resendConfirmationEmail(email: string) {
    const foundUser = await this.usersRepository.findByLoginOrEmail(email);
    if (!foundUser) {
      //return null;
      throw BadRequestDomainException.create(
        `User with email ${email} not found`,
        'email',
      );
    }
    if (foundUser.status === AccountStatus.Confirmed) {
      throw BadRequestDomainException.create(
        `${email} was already confirmed`,
        'email',
      );
    }
    const newCode = randomUUID();
    foundUser.updateCode(newCode);
    await this.usersRepository.save(foundUser);
    this.emailService
      .sendRegistrationConfirmationEmail(
        foundUser.email,
        foundUser.confirmationCode,
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
    console.log(newCode);
    this.emailService
      .sendPasswordRecoveryEmail(email, newCode)
      .catch((error) => console.log('error when trying to send email', error));
  }

  async passwordUpdate(newPassword: string, code: string) {
    const codePayload = await this.jwtService.verify(code, {
      secret: 'password-code-secret',
    });
    if (!codePayload) {
      throw BadRequestDomainException.create(`${code} is not valid or expired`);
    }
    const foundUser = await this.usersRepository.findByLoginOrEmail(
      codePayload.email,
    );
    if (!foundUser) {
      throw BadRequestDomainException.create(
        `No user with email ${codePayload.email} found`,
      );
    }
    const newHashedPassword =
      await this.bcryptService.passwordHash(newPassword);
    foundUser.updatePassword(newHashedPassword);
    await this.usersRepository.save(foundUser);
  }
}
