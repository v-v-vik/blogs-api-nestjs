import { INestApplication } from '@nestjs/common';
import { Connection, Types } from 'mongoose';
import { randomUUID } from 'node:crypto';
import { CreateUserInputDto } from '../../../src/features/user-accounts/api/dto/user.input-dto';
import { User } from '../../../src/features/user-accounts/domain/user.entity';
import bcrypt from 'bcrypt';
import request from 'supertest';

export type UserMockModel = {
  _id: Types.ObjectId;
  accountData: {
    login: string;
    email: string;
    password: string;
    createdAt: string;
  };
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: Date;
    status: number;
  };
};

export type UserTokensMockModel = {
  accessToken: string;
  refreshToken: string;
};

export class UsersTestManager {
  constructor(
    private app: INestApplication,
    private databaseConnection: Connection,
  ) {}

  createData({
    email,
    login,
    password,
  }: {
    email?: string;
    login?: string;
    password?: string;
  }): CreateUserInputDto {
    return {
      login: login ?? 'someUser',
      email: email ?? 'abc@gmail.com',
      password: password ?? 'p1234567',
    };
  }

  async create(
    userData: CreateUserInputDto,
    count: number = 1,
  ): Promise<UserMockModel[]> {
    const users: UserMockModel[] = [];
    for (let i = 0; i < count; i++) {
      const newId = new Types.ObjectId();
      const hashedPass = await bcrypt.hash('p1234567', 10);
      users.push({
        _id: newId,
        accountData: {
          login: userData.login + i,
          email: `abc${i}@gmail.com`,
          password: hashedPass,
          createdAt: new Date().toISOString(),
        },
        emailConfirmation: {
          confirmationCode: randomUUID(),
          expirationDate: new Date(),
          status: 1,
        },
      });
    }
    await this.databaseConnection.model(User.name).insertMany(users);
    return users;
  }

  async login(
    loginOrEmail: string,
    password: string,
    deviceName?: string,
  ): Promise<UserTokensMockModel> {
    const res = await request(this.app.getHttpServer())
      .post(`auth/login`)
      .send({ loginOrEmail, password })
      .set({ 'User-Agent': deviceName ?? 'testDevice' });

    const accessToken = res.body.accessToken;
    const cookies: any = res.headers['set-cookie'];
    let refreshToken: any;
    if (cookies) {
      const refreshCookie = cookies.find((cookie: string) =>
        cookie.startsWith('refreshToken='),
      );
      if (refreshCookie) {
        refreshToken = refreshCookie.split(';')[0].split('=')[1];
      }
    }
    return { accessToken, refreshToken };
  }
}
