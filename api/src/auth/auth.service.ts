import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto): Promise<string> {
    const user = await this.userService.findUserByEmail(loginDto.email);

    if (!user) {
      throw new BadRequestException({ email: 'User not found' });
    }

    const passwordMatch = await this.comparePassword(
      loginDto.password,
      user.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException({ password: 'Password is incorrect' });
    }

    return this.getJwtPayload(user);
  }

  async signup(signupDto: SignUpDto): Promise<Omit<User, 'password'>> {
    const hashedPassword = await this.hashPassword(signupDto.password);

    const { password: _password, ...user } = await this.userService.createUser({
      ...signupDto,
      password: hashedPassword,
    });

    return user;
  }

  async getJwtPayload(user: Pick<User, 'email' | 'id'>) {
    return this.jwtService.signAsync({ email: user.email, sub: user.id });
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(
      `${password}${this.config.get<string>('HASH_SALT')}`,
      10,
    );
  }

  private async comparePassword(password: string, hash: string) {
    return bcrypt.compare(
      `${password}${this.config.get<string>('HASH_SALT')}`,
      hash,
    );
  }
}
