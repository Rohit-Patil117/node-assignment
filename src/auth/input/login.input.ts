import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class LoginInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  password: string;
}

@ObjectType()
export class AuthPayload {
  @Field()
  success: boolean;

  @Field()
  accessToken: string;
}
