import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SessionViewDto } from '../api/dto/session.view-dto';
import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';
import { Session } from '../domain/session.entity';

@Injectable()
export class SessionsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findAllActiveSessions(userId: string) {
    const res = await this.dataSource
      .getRepository(Session)
      .createQueryBuilder('sessions')
      .where('sessions.userId = :userId', { userId })
      .andWhere('sessions.deletionStatus = :status', {
        status: DeletionStatus.NotDeleted,
      })
      .getMany();
    console.log(res);
    return res.map((session: Session) => new SessionViewDto(session));
  }
}
