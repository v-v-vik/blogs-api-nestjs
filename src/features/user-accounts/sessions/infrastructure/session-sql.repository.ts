import { Injectable } from '@nestjs/common';
import { Session } from '../domain/session-sql.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { RefreshTokenPayload } from '../../dto/tokens/tokens-payload.dto';

@Injectable()
export class SQLSessionsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async create(session: Session) {
    const sessionValues = [
      session.ip,
      session.title,
      session.lastActiveDate,
      session.deviceId,
      session.userId,
      session.expDate,
    ];
    const res = await this.dataSource.query(
      `INSERT INTO public."sessions"
    ("ip", "title", "lastActiveDate", "deviceId", "userId", "expDate")
    VALUES 
    ($1, $2, $3, $4, $5, $6)
    RETURNING "id"`,
      sessionValues,
    );
    return Session.createFromExistingDataInstance(res[0]).id;
  }

  async update(session: Session) {
    const values = [
      session.id,
      session.ip,
      session.title,
      session.lastActiveDate,
      session.deviceId,
      session.userId,
      session.expDate,
      session.deletionStatus,
    ];
    return await this.dataSource.query(
      `UPDATE public."sessions"
    SET "ip"=$2, "title"=$3, "lastActiveDate"=$4, "deviceId"=$5, "userId"=$6, "expDate"=$7, "deletionStatus"=$8
    WHERE "id"= $1`,
      values,
    );
  }

  async findByDeviceIdOrNotFoundException(deviceId: string) {
    const res = await this.dataSource.query(
      `SELECT *
     FROM public."sessions"
     WHERE "deviceId" = $1 AND "deletionStatus" = 'not-deleted'`,
      [deviceId],
    );
    if (res.length === 0) {
      throw NotFoundDomainException.create(
        `Session with Device Id: ${deviceId} not found.`,
      );
    }
    return Session.createFromExistingDataInstance(res[0]);
  }

  async terminateAllSessions(tokenData: RefreshTokenPayload): Promise<void> {
    const values = [tokenData.deviceId];
    return await this.dataSource.query(
      `UPDATE public."sessions"
    SET "deletionStatus"='permanent-deleted'
    WHERE "deviceId"!=$1`,
      values,
    );
  }

  async tokenListed(tokenData: RefreshTokenPayload) {
    const res = await this.dataSource.query(
      `SELECT *
     FROM public."sessions"
     WHERE "deviceId" =$2 AND "lastActiveDate"=$1 AND "userId"=$3 AND "deletionStatus" = 'not-deleted'`,
      [tokenData.iat.toString(), tokenData.deviceId, tokenData.id],
    );
    if (res.length === 0) {
      return null;
    }
    return Session.createFromExistingDataInstance(res[0]).id;
  }
}
