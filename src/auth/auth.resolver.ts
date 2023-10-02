import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthPayload, LoginInput } from './input/login.input';
import { UserRoleEnum } from 'src/user/model/user-role.enum';

@Resolver(() => AuthPayload)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async riderLogin(@Args('input') input: LoginInput): Promise<AuthPayload> {
    return await this.authService.validateUser(input, UserRoleEnum.Rider);
  }

  @Mutation(() => AuthPayload)
  async driverLogin(@Args('input') input: LoginInput): Promise<AuthPayload> {
    return await this.authService.validateUser(input, UserRoleEnum.Driver);
  }
}
