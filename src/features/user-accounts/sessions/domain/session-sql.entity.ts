import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';
import { SessionDomainDto } from './dto/session.domain-dto';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { SessionSQLDto } from './dto/session.sql-dto';

export class Session {
  id: string;
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
  userId: string;
  expDate: string;
  deletionStatus: string;

  static createNewInstance(dto: SessionDomainDto) {
    const session = new this();
    session.ip = dto.ip;
    session.title = dto.title;
    session.lastActiveDate = dto.lastActiveDate;
    session.deviceId = dto.deviceId;
    session.userId = dto.userId;
    session.expDate = dto.expDate;
    return session as Session;
  }

  static createFromExistingDataInstance(dbSession: SessionSQLDto) {
    const session = new this();
    session.id = dbSession.id.toString();
    session.ip = dbSession.ip;
    session.title = dbSession.title;
    session.lastActiveDate = dbSession.lastActiveDate;
    session.deviceId = dbSession.deviceId;
    session.userId = dbSession.userId;
    session.expDate = dbSession.expDate;
    session.deletionStatus = dbSession.deletionStatus;
    return session as Session;
  }

  flagAsDeleted() {
    if (this.deletionStatus !== DeletionStatus.NotDeleted) {
      throw NotFoundDomainException.create('Entity already deleted');
    }
    this.deletionStatus = DeletionStatus.PermanentDeleted;
  }

  update(iat: string) {
    this.lastActiveDate = iat;
  }
}
