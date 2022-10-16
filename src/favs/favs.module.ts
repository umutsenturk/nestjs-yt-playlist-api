import { Module } from '@nestjs/common';
import { FavsService } from './favs.service';
import { FavsController } from './favs.controller';

@Module({
  providers: [FavsService],
  controllers: [FavsController],
})
export class FavsModule {}
