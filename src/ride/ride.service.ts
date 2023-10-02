import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ride, RideDocument } from './model/ride.model';
import { RideRequestInput } from './input/ride-request.input';
import { RideStatusEnum } from './model/ride-status.enum';
import { SocketGateway } from 'src/socket/socket.gateway';

@Injectable()
export class RideService {
  constructor(
    @InjectModel(Ride.name) private rideModel: Model<RideDocument>,
    private socketGateway: SocketGateway,
  ) {}

  async create(ride: RideRequestInput, riderId: string): Promise<Ride> {
    const newRide = new this.rideModel({ ...ride, rider: riderId });
    this.socketGateway.handleMessageToRoom(
      `New ride request from ${newRide.pickupLocation} to ${newRide.droppingLocation}, tap to accept.`,
    );
    return await newRide.save();
  }

  async acceptRide(id: string, driverId: string): Promise<Ride> {
    const acceptRide = await this.rideModel
      .findByIdAndUpdate(
        id,
        { driver: driverId, status: RideStatusEnum.Accepted },
        { new: true },
      )
      .populate('driver')
      .populate('rider')
      .exec();

    if (!acceptRide)
      throw new NotFoundException(`No ride found for this ID : ${id}`);

    this.socketGateway.handleMessageToRoom(
      `Ride ${id} has been accepted by ${acceptRide.driver['name']}`,
    );

    return acceptRide;
  }

  async findAll(): Promise<Ride[]> {
    return await this.rideModel
      .find()
      .populate('rider')
      .populate('driver')
      .exec();
  }

  async findOneById(id: string): Promise<Ride> {
    const ride = await this.rideModel
      .findById(id)
      .populate('rider')
      .populate('driver')
      .exec();

    if (!ride) throw new NotFoundException(`No ride found for this ID : ${id}`);

    return ride;
  }
}
