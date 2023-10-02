import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { User } from './model/user.model';
import { RegisterUserInput } from './input/register-user.input';
import { UpdateUserInput } from './input/update-user.input';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserRoleEnum } from './model/user-role.enum';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async registerRider(@Args('input') input: RegisterUserInput): Promise<User> {
    return await this.userService.create(input, UserRoleEnum.Rider);
  }

  @Mutation(() => User)
  async registerDriver(@Args('input') input: RegisterUserInput): Promise<User> {
    return await this.userService.create(input, UserRoleEnum.Driver);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateUserInput,
  ): Promise<User> {
    return await this.userService.update(id, input);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return await this.userService.delete(id);
  }

  @Query(() => [User])
  @UseGuards(JwtAuthGuard)
  async getUsers(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async getUserById(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return await this.userService.findOneById(id);
  }
}
