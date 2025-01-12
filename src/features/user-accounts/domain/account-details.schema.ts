import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class UserAccountDetails {
  @Prop({ type: String, require: true })
  login: string;

  @Prop({ type: String, require: true })
  email: string;

  @Prop({ type: String, require: true })
  passwordHash: string;

  @Prop({ type: String, require: true })
  createdAt: string;
}

export const AccountDetailSchema =
  SchemaFactory.createForClass(UserAccountDetails);
