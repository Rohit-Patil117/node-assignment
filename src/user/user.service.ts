import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './model/user.model';
import { UpdateUserInput } from './input/update-user.input';
import { RegisterUserInput } from './input/register-user.input';
import * as bcrypt from 'bcrypt';
import { UserRoleEnum } from './model/user-role.enum';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: RegisterUserInput, role: UserRoleEnum): Promise<User> {
    try {
      const newUser = new this.userModel({
        ...user,
        password: bcrypt.hashSync(user.password, 10),
        role: role,
      });
      return await newUser.save();
    } catch (error) {
      if (
        error.name === 'MongoServerError' &&
        error.message.includes('email_1')
      ) {
        throw new ConflictException('auth/duplicate-email');
      }
    }
  }

  async update(id: string, user: UpdateUserInput): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, user, { new: true })
      .exec();
    if (!updatedUser)
      throw new NotFoundException(`No user found for this ID : ${id}`);
    return updatedUser;
  }

  async delete(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) throw new NotFoundException(`No user found for this ID : ${id}`);
    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException(`No user found for this ID : ${id}`);
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email }).exec();
  }
}
