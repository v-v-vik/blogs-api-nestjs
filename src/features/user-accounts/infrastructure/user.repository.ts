// import { User, UserDocument, UserModelType } from '../domain/user.entity';
// import { InjectModel } from '@nestjs/mongoose';
// import { Injectable } from '@nestjs/common';
// import { DeletionStatus } from '../../../core/dto/deletion-status.enum';
// import { NotFoundDomainException } from '../../../core/exceptions/domain-exceptions';
//
// @Injectable()
// export class UsersRepository {
//   //constructor(@InjectModel(User.name) private UserModel: UserModelType) {}
//
//   async findByIdOrNotFoundException(id: string): Promise<UserDocument> {
//     const res = await this.UserModel.findOne({
//       _id: id,
//       deletionStatus: DeletionStatus.NotDeleted,
//     });
//     if (!res) {
//       throw NotFoundDomainException.create('User not found.');
//     }
//     return res;
//   }
//
//   async save(user: UserDocument) {
//     await user.save();
//   }
//
//   async findByLoginAndEmail(
//     login: string,
//     email: string,
//   ): Promise<UserDocument | null> {
//     return this.UserModel.findOne({
//       $and: [
//         { deletionStatus: DeletionStatus.NotDeleted },
//         {
//           $or: [{ 'accountData.login': login }, { 'accountData.email': email }],
//         },
//       ],
//     });
//   }
//
//   async findByLoginOrEmail(loginOrEmail: string): Promise<UserDocument | null> {
//     return this.UserModel.findOne({
//       $and: [
//         { deletionStatus: DeletionStatus.NotDeleted },
//         {
//           $or: [
//             { 'accountData.login': loginOrEmail },
//             { 'accountData.email': loginOrEmail },
//           ],
//         },
//       ],
//     });
//   }
//
//   async findByCode(code: string): Promise<UserDocument | null> {
//     return this.UserModel.findOne({
//       'emailConfirmation.confirmationCode': code,
//       deletionStatus: DeletionStatus.NotDeleted,
//     });
//   }
//
//   async getLoginByUserId(userId: string): Promise<string> {
//     const res = await this.findByIdOrNotFoundException(userId);
//     return res.accountData.login;
//   }
// }
