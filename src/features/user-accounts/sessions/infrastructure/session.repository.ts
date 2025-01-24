import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';
import {
  Session,
  SessionDocument,
  SessionModelType,
} from '../domain/session.entity';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { RefreshTokenPayload } from '../../dto/tokens/tokens-payload.dto';

@Injectable()
export class SessionsRepository {
  constructor(
    @InjectModel(Session.name) private SessionModel: SessionModelType,
  ) {}

  // async findByIdOrNotFoundException(id: string): Promise<SessionDocument> {
  //   const res = await this.SessionModel.findOne({
  //     _id: id,
  //     deletionStatus: DeletionStatus.NotDeleted,
  //   });
  //   if (!res) {
  //     throw NotFoundDomainException.create('Session not found.');
  //   }
  //   return res;
  // }

  async save(session: SessionDocument) {
    await session.save();
  }

  async tokenListed(
    tokenData: RefreshTokenPayload,
  ): Promise<string | undefined> {
    const res = await this.SessionModel.findOne({
      lastActiveDate: tokenData.iat.toString(),
      deviceId: tokenData.deviceId,
      userId: tokenData.id,
      deletionStatus: DeletionStatus.NotDeleted,
    });
    return res?._id.toString();
  }

  async terminateAllSessions(tokenData: RefreshTokenPayload): Promise<boolean> {
    const res = await this.SessionModel.deleteMany({
      $and: [
        { deviceId: { $ne: tokenData.deviceId } },
        { iat: { $ne: tokenData.iat } },
        { deletionStatus: DeletionStatus.NotDeleted },
      ],
    });
    return !!res;
  }

  async findByDeviceIdOrNotFoundException(
    deviceId: string,
  ): Promise<SessionDocument> {
    const res = await this.SessionModel.findOne({ deviceId });
    if (!res) {
      throw NotFoundDomainException.create(
        `Session with Device Id: ${deviceId} not found.`,
      );
    }
    return res;
  }
}
