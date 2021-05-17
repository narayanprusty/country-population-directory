import { Module } from '@nestjs/common';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { RedisModule } from '../../libs/redis/redis.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    RedisModule,
    AuthModule
  ],
  controllers: [CountriesController],
  providers: [CountriesService],
})

export class CountriesModule {}