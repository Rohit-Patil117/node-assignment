import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class RideRequestInput {
  @Field(() => String)
  @IsNotEmpty()
  pickupLocation: string;

  @Field(() => String)
  @IsNotEmpty()
  droppingLocation: string;
}
