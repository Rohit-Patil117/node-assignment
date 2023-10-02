import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}

@ObjectType()
export class AuthPayload {
  @Field()
  success: boolean;

  @Field()
  accessToken: string;
}
