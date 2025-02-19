import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';

export class UserSQLDto {
  id: number;
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  confirmationCode: string;
  confirmCodeExpiryDate: Date;
  status: number;
  deletionStatus: DeletionStatus;
}
