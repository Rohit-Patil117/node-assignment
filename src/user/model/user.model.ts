import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { UserRoleEnum } from './user-role.enum';

@ObjectType()
@Schema({ timestamps: true })
export class User {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Types.ObjectId;

  @Field(() => String)
  @Prop()
  name: string;

  @Field(() => String)
  @Prop({ unique: true })
  email: string;

  @Field(() => String)
  @Prop()
  password: string;

  @Field(() => String)
  @Prop()
  address: string;

  @Field(() => String)
  @Prop({ type: String, enum: UserRoleEnum, default: UserRoleEnum.Rider })
  role: UserRoleEnum;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
