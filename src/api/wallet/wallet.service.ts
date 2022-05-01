import * as AsyncLock from 'async-lock'
import { Injectable } from '@nestjs/common'

import { CustomLoggerService } from '../../common/logger/logger.service'

import { Wallet } from '../../model/wallet/wallet';
import { OperationResultCode } from '../../common/constant/operation.result.code';

@Injectable()
export class WalletService {

    /**
     * 
     * use in-memory storage as a short cut to represent the wallets entity in database
     * 
     * should use typeorm in real application, and seperate a WalletRepositoy to isolate business logic and DAO
     * 
     * */
    public static walletMap: Map<string, Wallet>;

    constructor(
        /**
         * 
         * use async-lock to represent database level lock to avoid concurrent issue;
         * 
         * however, in-memory lock is not preferred in real application as it is not working well for multiple instances;
         * 
         * shuold consider database / middleware (like redis) to implement the lock, but this would impact performance;
         * 
         * also can introduce message queue to improve the performance while using lock, however it may cause delay wallet balance which leads to negative balance
         * 
         * */
        private readonly asyncLock: AsyncLock,
        private readonly logger: CustomLoggerService
    ) {
        if (WalletService.walletMap == null) {
            WalletService.walletMap = new Map<string, Wallet>();
            WalletService.walletMap.set('8888', new Wallet('8888', 'testing wallet A', 100000));
            WalletService.walletMap.set('1234', new Wallet('1234', 'testing wallet B', 20000));
        }
        this.logger.setContext(WalletService.name)
    }

    public async getBalance(
        walletId: string,
    ) {
        let code, message, balance;
        if (!WalletService.walletMap.has(walletId)) {
            code = OperationResultCode.WALLET_NOT_FOUND;
            message = `wallet not found`
        } else {
            code = OperationResultCode.GET_BALANCE_SUCCESS
            balance = await WalletService.walletMap.get(walletId).getBalance();
            message = `the balance of wallet [${walletId}] is: ${balance / 100}`
        }
        return this.createResult(
            code,
            message,
            walletId,
            balance,
        )
    }

    public async deposite(
        walletId: string,
        amountInCent: number,
    ) {
        let code, message, balance;
        if (!WalletService.walletMap.has(walletId)) {
            code = OperationResultCode.WALLET_NOT_FOUND;
            message = `wallet not found`
        } else {
            code = OperationResultCode.DEPOSITE_SUCCESS
            await this.asyncLock.acquire(walletId, async () => {
                // lock to prevent concurrent issues which may lead to incorrect wallet balance
                balance = await WalletService.walletMap.get(walletId).add(amountInCent);
                return;
            })
            message = `deposite ${amountInCent / 100} to wallet [${walletId}] successfully, current balance is: ${balance / 100}`
        }
        return this.createResult(
            code,
            message,
            walletId,
            balance,
        )
    }

    public async withdraw(
        walletId: string,
        amountInCent: number,
    ) {
        let code, message, balance;
        if (!WalletService.walletMap.has(walletId)) {
            code = OperationResultCode.WALLET_NOT_FOUND;
            message = `wallet not found`
        } else {
            await this.asyncLock.acquire(walletId, async () => {
                // lock from checking if wallet is deductible, otherwise wallet balance may be changed right after returning result for isDeductible()
                const wallet = WalletService.walletMap.get(walletId)
                if (wallet.isDeductible(amountInCent)) {
                    code = OperationResultCode.WITHDRAW_SUCCESS
                    balance = await wallet.deduct(amountInCent);
                    message = `withdraw ${amountInCent / 100} from wallet [${walletId}] successfully, current balance is: ${balance / 100}`
                } else {
                    code = OperationResultCode.WITHDRAW_FAILED_INSUFFICIENT_BALANCE
                    balance = await wallet.getBalance()
                    message = `failed to withdraw ${amountInCent / 100} from wallet [${walletId}], insufficient balance: ${balance / 100}`
                }
                return
            })
        }
        return this.createResult(
            code,
            message,
            walletId,
            balance,
        )
    }

    public async transfer(
        fromWalletId: string,
        toWalletId: string,
        amountInCent: number
    ) {
        let code, message, balance;
        if (!WalletService.walletMap.has(fromWalletId)) {
            code = OperationResultCode.WALLET_NOT_FOUND;
            message = `wallet not found`
        } else if (!WalletService.walletMap.has(toWalletId)) {
            code = OperationResultCode.WALLET_NOT_FOUND;
            message = `wallet not found`
        } else {
            const fromWallet = WalletService.walletMap.get(fromWalletId)
            // need to lock both fromWallet and toWallet; to avoid deadlock, the sequence of acquiring lock should be well defined
            let [firstLockKey, secondLockKey] = this.getLockKeyInSequence(fromWalletId, toWalletId)
            await this.asyncLock.acquire(firstLockKey, async () => {
                await this.asyncLock.acquire(secondLockKey, async () => {
                    if (fromWallet.isDeductible(amountInCent)) {
                        code = OperationResultCode.TRANSFER_SUCCESS
                        balance = await fromWallet.deduct(amountInCent)
                        await WalletService.walletMap.get(toWalletId).add(amountInCent);
                        message = `transfer ${amountInCent / 100} from wallet [${fromWalletId}] to wallet [${toWalletId}] successfully, current balance is: ${balance / 100}`
                    } else {
                        code = OperationResultCode.TRANSFER_FALIURE_INSUFFICIENT_BALANCE
                        balance = await fromWallet.getBalance()
                        message = `failed to transfer ${amountInCent / 100} from wallet [${fromWalletId}], insufficient balance: ${balance / 100}`
                    }
                    return
                })
                return
            })
        }
        return this.createResult(
            code,
            message,
            fromWalletId,
            balance,
        )
    }

    private createResult(
        code: number,
        message: string,
        walletId: string,
        balance: number,
    ) {
        this.logger.log(message)
        return {
            code: code,
            message: message,
            wallet: walletId,
            // convert amountInCent to actual amount
            balance: balance / 100,
        }
    }

    private getLockKeyInSequence(
        fromWalletId: string,
        toWalletId: string,
    ) {
        const result = [fromWalletId, toWalletId];
        return result.sort()
    }

}