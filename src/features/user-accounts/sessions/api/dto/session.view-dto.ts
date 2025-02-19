import { Session } from '../../domain/session.entity';

export class SessionViewDto {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;

  constructor(session: Session) {
    const dateCreated = new Date(
      Number(session.lastActiveDate) * 1000,
    ).toISOString();
    this.ip = session.ip.toString();
    this.title = session.title;
    this.lastActiveDate = dateCreated;
    this.deviceId = session.deviceId;
  }
}
