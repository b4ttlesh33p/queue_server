import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { QueueHandlerService, RawJobData } from 'src/queue-handler/queue-handler.service';

@Controller('api')
export class ApiController {
    constructor(private readonly queueService: QueueHandlerService){}

    @Post(':queueName')
    pushToQueue(
        @Param('queueName') queueName: string,
        @Body() data: RawJobData
    ): string {
        return this.queueService.push({queueName, data})
    }


    @Get(':queueName')
    async shiftFromQueue(
        @Param('queueName') queueName: string,
        @Query('timeout') timeout: string,
        @Res() res: Response
    ) {
        console.log(`received shift request with ${timeout} timeout`)
        const formattedTimeout = isNaN(Number(timeout)) ? 10 : Number(timeout)

        const response = await this.queueService.shift({queueName, timeout: formattedTimeout})
        if (response.isFailed && response.message === 'timeout reached') {
            res.status(204).send(response.message)
        } else {
            res.send(response)
        }
    }

    @Get()
    getQueuesState() {
        return this.queueService.getQueuesState()
    }
}
