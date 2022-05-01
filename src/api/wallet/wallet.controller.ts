import {
    Body,
    Controller,
    Get,
    Param,
    Post,
} from '@nestjs/common';


import { CustomLoggerService } from '../../common/logger/logger.service';
import { TransactionTypeCode } from '../../common/constant/transaction.type.code';
import { WalletService } from './wallet.service'

@Controller('/wallet')
export class WalletController {
    constructor(
        private readonly walletService: WalletService,
        private readonly logger: CustomLoggerService
    ) {
        this.logger.setContext(WalletController.name)
    }

    // for debugging purpose
    @Get('/:walletId/balance')
    async getBalance(
        @Param('walletId') walletId: string,
    ) {
        return await this.walletService.getBalance(walletId);
    }

    @Post('/transaction')
    async makeTransaction(
        @Body('type') type: string,
        @Body('fromWalletId') fromWalletId: string,
        @Body('toWalletId') toWalletId: string,
        @Body('amount') amount: number,
    ) {
        let response;
        switch (type) {
            case TransactionTypeCode.DEPOSITE:
                response = await this.walletService.deposite(fromWalletId, amount * 100);
                break;
            case TransactionTypeCode.WITHDRAW:
                response = await this.walletService.withdraw(fromWalletId, amount * 100);
                break;
            case TransactionTypeCode.TRANSFER:
                response = await this.walletService.transfer(fromWalletId, toWalletId, amount * 100);
                break;
        }
        return response
    }

}
