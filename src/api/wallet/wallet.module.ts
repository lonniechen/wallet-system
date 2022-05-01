import * as AsyncLock from 'async-lock'
import { Module } from '@nestjs/common';

import { CustomLoggerService } from '../../common/logger/logger.service';
import { WalletController } from './wallet.controller'
import { WalletService } from './wallet.service'

@Module({
    controllers: [
        WalletController
    ],
    providers: [
        WalletService,
        AsyncLock,
        CustomLoggerService
    ],
})
export class WalletModule { }