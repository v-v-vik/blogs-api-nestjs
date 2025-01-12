import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class UserConfirmationData {
  @Prop({ type: String, require: true })
  confirmationCode: string;

  @Prop({ type: Date, require: true })
  expirationDate: Date;

  @Prop({ type: Number, require: true })
  status: number;
}

export const UserConfirmationDataSchema =
  SchemaFactory.createForClass(UserConfirmationData);
