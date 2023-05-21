import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { AuthGuard } from './auth.guard';

@Module({
  providers: [AuthService, UserService, AuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
