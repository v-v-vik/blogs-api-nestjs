import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class LikesInfo {
  @Prop({ type: Number, require: true, default: 0 })
  likesCount: number;

  @Prop({ type: Number, require: true, default: 0 })
  dislikesCount: number;
}

export const LikesInfoSchema = SchemaFactory.createForClass(LikesInfo);
