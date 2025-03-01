import { Injectable } from '@nestjs/common';
import { Session } from '../domain/session.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository, UpdateResult } from 'typeorm';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { RefreshTokenPayload } from '../../dto/tokens/tokens-payload.dto';
import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';

@Injectable()
export class SessionsRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Session) private sessionsRepo: Repository<Session>,
  ) {}

  async findByDeviceIdOrNotFoundException(deviceId: string): Promise<Session> {
    const res = await this.sessionsRepo.findOne({
      where: {
        deviceId,
        deletionStatus: DeletionStatus.NotDeleted,
      },
    });
    if (!res) {
      throw NotFoundDomainException.create('Session not found.');
    }
    return res;
  }

  async terminateAllSessions(
    deviceId: string,
    userId: string,
  ): Promise<UpdateResult> {
    return await this.sessionsRepo.update(
      { deviceId: Not(deviceId), userId: Number(userId) },
      { deletionStatus: DeletionStatus.PermanentDeleted },
    );
  }

  async tokenListed(tokenData: RefreshTokenPayload) {
    const res = await this.sessionsRepo.findOne({
      where: {
        deviceId: tokenData.deviceId,
        userId: Number(tokenData.id),
        lastActiveDate: tokenData.iat.toString(),
        deletionStatus: DeletionStatus.NotDeleted,
      },
    });
    if (!res) {
      return null;
    }
    return res.id;
  }

  async save(session: Session) {
    const res = await this.sessionsRepo.save(session);
    return res.id.toString();
  }
}
