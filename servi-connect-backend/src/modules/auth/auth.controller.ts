import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { StandardApiResponse } from 'src/common/interfaces';
import { User } from 'src/core/domain/entities';
import { LoginDto, SignupDto } from './dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  async signup(
    @Body() signupDto: SignupDto,
  ): Promise<
    StandardApiResponse<{ user: Omit<User, 'password'>; access_token: string }>
  > {
    return await this.authService.signup(signupDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login and get a JWT token' })
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<
    StandardApiResponse<{ user: Omit<User, 'password'>; access_token: string }>
  > {
    return await this.authService.login(loginDto);
  }
}
