import { DeletionStatus } from '../../../../../core/dto/deletion-status.enum';

export class BlogSQLDto {
  id: number;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
  deletionStatus: DeletionStatus;
}
