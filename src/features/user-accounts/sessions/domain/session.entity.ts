import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';
import { SessionDomainDto } from './dto/session.domain-dto';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'varchar',
    nullable: false,
  })
  ip: string;
  @Column({
    type: 'varchar',
    nullable: false,
  })
  title: string;
  @Column({
    type: 'varchar',
    nullable: false,
  })
  lastActiveDate: string;
  @Column({
    type: 'uuid',
    nullable: false,
  })
  deviceId: string;
  @Column({
    type: 'int',
    nullable: false,
  })
  userId: number;
  @Column({
    type: 'varchar',
    nullable: false,
  })
  expDate: string;
  @Column({
    type: 'varchar',
    nullable: false,
  })
  deletionStatus: DeletionStatus;

  static createNewInstance(dto: SessionDomainDto) {
    const session = new this();
    session.ip = dto.ip;
    session.title = dto.title;
    session.lastActiveDate = dto.lastActiveDate;
    session.deviceId = dto.deviceId;
    session.userId = Number(dto.userId);
    session.expDate = dto.expDate;
    session.deletionStatus = DeletionStatus.NotDeleted;
    return session as Session;
  }

  // static createFromExistingDataInstance(dbSession: SessionSQLDto) {
  //   const session = new this();
  //   session.id = dbSession.id.toString();
  //   session.ip = dbSession.ip;
  //   session.title = dbSession.title;
  //   session.lastActiveDate = dbSession.lastActiveDate;
  //   session.deviceId = dbSession.deviceId;
  //   session.userId = dbSession.userId;
  //   session.expDate = dbSession.expDate;
  //   session.deletionStatus = dbSession.deletionStatus;
  //   return session as Session;
  // }

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
