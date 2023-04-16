import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PersistanceModule } from '../persistance/persistance.module';
import { UserService } from '../user/user.service';

@Module({
  providers: [AuthService, UserService],
  controllers: [AuthController],
  imports: [
    PersistanceModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '2h' },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
