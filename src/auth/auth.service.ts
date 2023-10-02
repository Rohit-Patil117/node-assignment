import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload, LoginInput } from './input/login.input';
import * as bcrypt from 'bcrypt';
import { UserRoleEnum } from 'src/user/model/user-role.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(
    input: LoginInput,
    role: UserRoleEnum,
  ): Promise<AuthPayload> {
    const { email, password } = input;
    const user = await this.userService.findOneByEmail(email);

    if (!user) throw new UnauthorizedException('auth/wrong-email');

    if (user.role !== role) throw new UnauthorizedException('auth/wrong-role');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('auth/wrong-password');

    const payload = { _id: user._id, name: user.name, email: user.email };

    return {
      success: true,
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '1d',
      }),
    };
  }

  async getUserFromAuthenticationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      const userId = payload._id;

      if (userId) {
        return await this.userService.findOneById(userId);
      }
    } catch (error) {
      return;
    }
  }
}
