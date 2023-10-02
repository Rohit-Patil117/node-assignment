import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RideRequestInput {
  @Field(() => String)
  pickupLocation: string;

  @Field(() => String)
  droppingLocation: string;
}
