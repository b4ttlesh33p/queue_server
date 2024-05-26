import { Injectable, OnModuleInit } from '@nestjs/common';
import { v4 } from 'uuid';
import { retryByTimeout } from './utils';

export type RawJobData = Record<string, any>

export type Job = {
    data: RawJobData,
    id: string
}

type PushProps = {
    queueName: string,
    data: RawJobData
}

type ShiftProps = {
    queueName: string,
    timeout?: number
}

type ShiftResponse = {
    isFailed: boolean,
    message?: string,
    job?: Job
}

@Injectable()
export class QueueHandlerService implements OnModuleInit{
    private requestedQueues = ['temp']
    private queueNames = []
    private queues: Record<string, Job[]> = {}

    private createJob(rawJobData: RawJobData) {
        return {
            id: v4(),
            data: rawJobData
        }
    }

    private getMainQueueName = (q: string) => `${q}-main`
    private getInProgressQueueName = (q: string) => `${q}-in-progress`
    
    onModuleInit() {
        this.requestedQueues.forEach(( q: string ) => {
            this.queueNames.push(this.getMainQueueName(q))
            this.queueNames.push(this.getInProgressQueueName(q))
        })
        
        this.queueNames.forEach((q) => this.queues[q] = [])
    }

    push({queueName, data}: PushProps){
        if (!this.requestedQueues.includes(queueName)) {
            return 'Queue not found'
        }
        const job = this.createJob(data)
        const mainQueue = this.getMainQueueName(queueName)
        this.queues[mainQueue].push(job)
        return job.id
    }

    async shift({queueName, timeout = 10}: ShiftProps): Promise<ShiftResponse>{

        if (!this.requestedQueues.includes(queueName)) {
            return {message: 'Queue not found', isFailed: true}
        }
        
        const mainQueue = this.getMainQueueName(queueName)
        const shiftFunction = () => {
            return this.queues[mainQueue].shift()
        }

        const shiftResponse = await retryByTimeout(shiftFunction, timeout)

        const response = await shiftResponse
        return response
    }

    getQueuesState(queueName?: string) {
        if (queueName) {
            return this.queues[queueName].length
        }
        const queuesState = {} 
        this.queueNames.map((q) => queuesState[q] = this.queues[q].length)
        return queuesState
    }
}
