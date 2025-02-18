import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SessionSQLDto } from '../domain/dto/session.sql-dto';
import { SessionViewDto } from '../api/dto/session.view-dto';

@Injectable()
export class SQLSessionsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findAllActiveSessions(userId: string) {
    const res = await this.dataSource.query(
      `SELECT *
     FROM public."sessions"
     WHERE "userId" = $1 AND "deletionStatus" = 'not-deleted'`,
      [userId],
    );
    return res.map((session: SessionSQLDto) => new SessionViewDto(session));
  }
}
