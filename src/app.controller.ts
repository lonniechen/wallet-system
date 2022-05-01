import {
    Controller,
    Get,
} from '@nestjs/common';

import { CustomLoggerService } from './common/logger/logger.service';

@Controller('')
export class AppController {

    constructor(
        private readonly logger: CustomLoggerService
    ) {
        this.logger.setContext(AppController.name)
    }

    @Get('ping')
    async test() {
        const message = 'pong!'
        this.logger.log(message)
        return {
            code: null,
            message: message,
            wallet: null,
            balance: null,
        }
    }

}