import { SessionDocument } from '../../domain/session.entity';

export class SessionViewDto {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;

  constructor(session: SessionDocument) {
    const dateCreated = new Date(
      Number(session.lastActiveDate) * 1000,
    ).toISOString();
    this.ip = session.ip;
    this.title = session.title;
    this.lastActiveDate = dateCreated;
    this.deviceId = session.deviceId;
  }
}
