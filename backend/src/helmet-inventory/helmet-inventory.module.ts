import { Module } from '@nestjs/common';
import { HelmetInventoryController } from './helmet-inventory.controller';
import { HelmetInventoryService } from './helmet-inventory.service';

@Module({
  controllers: [HelmetInventoryController],
  providers: [HelmetInventoryService],
})
export class HelmetInventoryModule {}
