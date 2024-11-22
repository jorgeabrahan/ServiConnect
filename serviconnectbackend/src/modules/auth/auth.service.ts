import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from 'src/core/domain/entities';
import { StandardApiResponse } from 'src/common/interfaces';
import { LoginDto, SignupDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async signup(
    user: SignupDto,
  ): Promise<
    StandardApiResponse<{ user: Omit<User, 'password'>; access_token: string }>
  > {
    try {
      if (user.password !== user.passwordConfirmation) {
        throw new BadRequestException(
          'Password and password confirmation do not match',
        );
      }
      const existingUser = await this.usersService.findByEmail(user.email);
      if (existingUser) {
        throw new BadRequestException('Email is already in use');
      }
      const { passwordConfirmation, ...userRest } = user;
      const res = await this.usersService.createUser({
        ...userRest,
        role: 'user',
      });
      if (!res.isSuccess) {
        throw new BadRequestException(res.error);
      }
      const { password, ...userWithoutPassword } = res.data;
      const accessToken = this.jwtService.sign({
        email: userWithoutPassword.email,
        sub: userWithoutPassword.id,
        role: userWithoutPassword.role,
      });
      return {
        isSuccess: true,
        data: { user: userWithoutPassword, access_token: accessToken },
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = 'Failed to sign up user';
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async login(
    loginDto: LoginDto,
  ): Promise<
    StandardApiResponse<{ user: Omit<User, 'password'>; access_token: string }>
  > {
    try {
      const userWithoutPassword = await this.validateUser(
        loginDto.email,
        loginDto.password,
      );
      const payload = {
        email: userWithoutPassword.email,
        sub: userWithoutPassword.id,
        role: userWithoutPassword.role,
      };
      return {
        isSuccess: true,
        data: {
          user: userWithoutPassword,
          access_token: this.jwtService.sign(payload),
        },
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = 'Failed to login user';
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }
}
