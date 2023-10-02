import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/user/model/user.model';
import { RideStatusEnum } from './ride-status.enum';

@ObjectType()
@Schema({ timestamps: true })
export class Ride {
  @Field(() => String)
  @Prop()
  pickupLocation: string;

  @Field(() => String)
  @Prop()
  droppingLocation: string;

  @Field(() => User)
  @Prop({ type: Types.ObjectId, ref: 'User' })
  rider: Types.ObjectId;

  @Field(() => User)
  @Prop({ type: Types.ObjectId, ref: 'User' })
  driver: Types.ObjectId;

  @Field(() => String)
  @Prop({ type: String, enum: RideStatusEnum, default: RideStatusEnum.Pending })
  status: RideStatusEnum;
}

export type RideDocument = Ride & Document;

export const RideSchema = SchemaFactory.createForClass(Ride);
