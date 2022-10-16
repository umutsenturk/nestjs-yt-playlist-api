import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';

@Module({
  providers: [ListService],
  controllers: [ListController],
})
export class ListModule {}
