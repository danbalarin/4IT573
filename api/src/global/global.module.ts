import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PersistanceModule } from '../persistance/persistance.module';

const modules = [
  PersistanceModule,
  ConfigModule.forRoot({ isGlobal: true }),
  JwtModule.registerAsync({
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '2h' },
    }),
    inject: [ConfigService],
  }),
];

@Global()
@Module({
  imports: modules,
  exports: modules,
})
export class GlobalModule {}
