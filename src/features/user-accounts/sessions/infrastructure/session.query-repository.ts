import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';
import { Session, SessionModelType } from '../domain/session.entity';
import { SessionViewDto } from '../api/dto/session.view-dto';

@Injectable()
export class SessionsQueryRepository {
  constructor(
    @InjectModel(Session.name) private SessionModel: SessionModelType,
  ) {}

  async findAllActiveSessions(userId: string): Promise<SessionViewDto[]> {
    const sessions = await this.SessionModel.find({
      userId,
      deletionStatus: DeletionStatus.NotDeleted,
    }).exec();
    return sessions.map((session) => new SessionViewDto(session));
  }
}
