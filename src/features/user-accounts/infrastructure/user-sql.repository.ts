import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { User } from '../domain/user-sql.entity';
import { NotFoundDomainException } from '../../../core/exceptions/domain-exceptions';

@Injectable()
export class SQLUsersRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async create(user: User) {
    const userValues = [
      user.login,
      user.email,
      user.passwordHash,
      user.confirmationCode,
      user.confirmCodeExpiryDate,
      user.status,
    ];
    const res = await this.dataSource.query(
      `INSERT INTO public."users"
    ("login", "email", "passwordHash", "confirmationCode", "confirmCodeExpiryDate", "status")
    VALUES 
    ($1, $2, $3, $4, $5, $6)
    RETURNING "id"`,
      userValues,
    );
    return res[0].id;
  }

  async delete(userId: string) {
    const res = await this.dataSource.query(
      `DELETE FROM public.users      
     WHERE id = $1 AND "deletionStatus" = 'not-deleted'`,
      [Number(userId)],
    );
    if (res.length === 0) {
      throw NotFoundDomainException.create('User not found.');
    }
    return !!res.rowCount;
  }

  async findByIdOrNotFoundException(userId: string) {
    const res = await this.dataSource.query(
      `SELECT *
     FROM public."users"
     WHERE "id" = $1 AND "deletionStatus" = 'not-deleted'`,
      [Number(userId)],
    );
    if (res.length === 0) {
      throw NotFoundDomainException.create('User not found.');
    }
    return User.createFromExistingDataInstance(res[0]);
  }

  async findLoginByUserId(userId: string) {
    const res = await this.dataSource.query(
      `SELECT *
     FROM public."users"
     WHERE "id" = $1 AND "deletionStatus" = 'not-deleted'`,
      [userId],
    );
    if (res.length === 0) {
      throw NotFoundDomainException.create('User not found.');
    }
    return User.createFromExistingDataInstance(res[0]).login;
  }

  async findByLoginOrEmail(loginOrEmail: string) {
    const res = await this.dataSource.query(
      `SELECT *
     FROM public."users"
     WHERE ("login" = $1 OR "email" = $1) 
     AND "deletionStatus" = 'not-deleted'`,
      [loginOrEmail],
    );
    if (res.length === 0) {
      return null;
    }
    return User.createFromExistingDataInstance(res[0]);
  }

  async findByCode(code: string): Promise<User | null> {
    const res = await this.dataSource.query(
      `SELECT *
     FROM public."users"
     WHERE "confirmationCode" = $1 AND "deletionStatus" = 'not-deleted'`,
      [code],
    );
    if (res.length === 0) {
      return null;
    }
    return User.createFromExistingDataInstance(res[0]);
  }

  async update(user: User) {
    const values = [
      user.id,
      user.login,
      user.email,
      user.passwordHash,
      user.confirmationCode,
      user.confirmCodeExpiryDate,
      user.status,
      user.deletionStatus,
    ];
    return await this.dataSource.query(
      `UPDATE public."users"
    SET "login"=$2, "email"=$3, "passwordHash"=$4, "confirmationCode"=$5, "confirmCodeExpiryDate"=$6, "status"=$7, "deletionStatus"=$8
    WHERE "id"= $1`,
      values,
    );
  }

  async findByLoginAndEmail(login: string, email: string) {
    const res = await this.dataSource.query(
      `SELECT *
     FROM public."users"
     WHERE ("login" = $1 OR "email" = $2) 
     AND "deletionStatus" = 'not-deleted'`,
      [login, email],
    );
    if (res.length === 0) {
      return null;
    }
    return User.createFromExistingDataInstance(res[0]);
  }
}
