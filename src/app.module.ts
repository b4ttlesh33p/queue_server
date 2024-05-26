import { Module } from '@nestjs/common';
import { ApiController } from './api/api.controller';
import { QueueHandlerService } from './queue-handler/queue-handler.service';

@Module({
  imports: [],
  controllers: [ApiController],
  providers: [QueueHandlerService],
})
export class AppModule {}
