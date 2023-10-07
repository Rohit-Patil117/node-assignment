import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, Matches, IsNotEmpty } from 'class-validator';

@InputType()
export class RegisterUserInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message:
      'Password must contain at least eight characters, one number, one lower and uppercase letter and one special character',
  })
  password: string;

  @Field(() => String)
  @IsNotEmpty()
  address: string;
}
