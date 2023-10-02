import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { UseGuards, UnauthorizedException } from '@nestjs/common';
import { Ride } from './model/ride.model';
import { RideService } from './ride.service';
import { RideRequestInput } from './input/ride-request.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserRoleEnum } from 'src/user/model/user-role.enum';

@Resolver(() => Ride)
export class RideResolver {
  constructor(private readonly rideService: RideService) {}

  @Mutation(() => Ride)
  @UseGuards(JwtAuthGuard)
  async rideRequest(
    @Args('input') input: RideRequestInput,
    @Context() context,
  ): Promise<Ride> {
    if (context.req.user.role !== UserRoleEnum.Rider)
      throw new UnauthorizedException('auth/wrong-role');
    const riderId = context.req.user._id;
    return await this.rideService.create(input, riderId);
  }

  @Mutation(() => Ride)
  @UseGuards(JwtAuthGuard)
  async acceptRideRequest(
    @Args('id', { type: () => ID }) id: string,
    @Context() context,
  ): Promise<Ride> {
    if (context.req.user.role !== UserRoleEnum.Driver)
      throw new UnauthorizedException('auth/wrong-role');
    const driverId = context.req.user._id;
    return await this.rideService.acceptRide(id, driverId);
  }

  @Query(() => [Ride])
  @UseGuards(JwtAuthGuard)
  async getRides(): Promise<Ride[]> {
    return await this.rideService.findAll();
  }

  @Query(() => Ride)
  @UseGuards(JwtAuthGuard)
  async getRideById(@Args('id', { type: () => ID }) id: string): Promise<Ride> {
    return await this.rideService.findOneById(id);
  }
}
