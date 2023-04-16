import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { Response as Res } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Response({ passthrough: true }) res: Res,
  ) {
    const token = await this.authService.login(loginDto);
    res.cookie('Authorization', `Bearer ${token}`, { httpOnly: true });

    return token;
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(
    @Body() signupDto: SignUpDto,
    @Response({ passthrough: true }) res: Res,
  ) {
    const user = await this.authService.signup(signupDto);
    const token = await this.authService.getJwtPayload(user);
    res.cookie('Authorization', `Bearer ${token}`, { httpOnly: true });

    return user;
  }
}
