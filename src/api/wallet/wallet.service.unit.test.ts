import * as AsyncLock from 'async-lock'

import { WalletService } from './wallet.service'
import { CustomLoggerService } from '../../common/logger/logger.service'
import { OperationResultCode } from '../../common/constant/operation.result.code'

describe('ApiOrdersService', () => {

    let asyncLock: AsyncLock = new AsyncLock();
    let walletService: WalletService = new WalletService(asyncLock, new CustomLoggerService());

    let invalidWalletId = '0000'
    let walletId1 = '8888'
    let walletId2 = '1234'
    let initalBalance1 = 1000
    let initalBalance2 = 200
    let amount1 = 50
    let amount2 = 500

    let result;

    describe('get balance', () => {
        it('should return faliure if wallet id is invalid', async () => {
            result = await walletService.getBalance(invalidWalletId)
            expect(result.code).toBe(OperationResultCode.WALLET_NOT_FOUND)
            expect(result.balance).toBeNaN()
        });

        it('should return correct balance', async () => {
            result = await walletService.getBalance(walletId1)
            expect(result.code).toBe(OperationResultCode.GET_BALANCE_SUCCESS)
            expect(result.balance).toBe(initalBalance1)
        });
    });

    describe('deposite', () => {
        it('should return faliure if wallet id is invalid', async () => {
            result = await walletService.deposite(invalidWalletId, amount1 * 100)
            expect(result.code).toBe(OperationResultCode.WALLET_NOT_FOUND)
            expect(result.balance).toBeNaN()
        });

        it('should successfully deposite and return correct balance', async () => {
            result = await walletService.deposite(walletId1, amount1 * 100)
            expect(result.code).toBe(OperationResultCode.DEPOSITE_SUCCESS)
            expect(result.balance).toBe(initalBalance1 + amount1)
            // reset the wallet balance
            await walletService.withdraw(walletId1, amount1 * 100)
        });
    });

    describe('withdraw', () => {
        it('should return faliure if wallet id is invalid', async () => {
            result = await walletService.withdraw(invalidWalletId, amount1 * 100)
            expect(result.code).toBe(OperationResultCode.WALLET_NOT_FOUND)
            expect(result.balance).toBeNaN()
        });

        it('should return faliure for insufficient balance', async () => {
            result = await walletService.withdraw(walletId2, amount2 * 100)
            expect(result.code).toBe(OperationResultCode.WITHDRAW_FAILED_INSUFFICIENT_BALANCE)
            expect(result.balance).toBe(initalBalance2)
        });

        it('should successfully withdraw and return correct balance', async () => {
            result = await walletService.withdraw(walletId1, amount1 * 100)
            expect(result.code).toBe(OperationResultCode.WITHDRAW_SUCCESS)
            expect(result.balance).toBe(initalBalance1 - amount1)
            // reset the wallet balance
            await walletService.deposite(walletId1, amount1 * 100)
        });
    });

    describe('transfer', () => {

        it('should return faliure if from wallet id is invalid', async () => {
            result = await walletService.transfer(invalidWalletId, walletId2, amount1 * 100)
            expect(result.code).toBe(OperationResultCode.WALLET_NOT_FOUND)
            expect(result.balance).toBeNaN()
        });

        it('should return faliure if to wallet id is invalid', async () => {
            result = await walletService.transfer(walletId1, invalidWalletId, amount1 * 100)
            expect(result.code).toBe(OperationResultCode.WALLET_NOT_FOUND)
            expect(result.balance).toBeNaN()
        });

        it('should return faliure for insufficient balance', async () => {
            result = await walletService.transfer(walletId2, walletId1, amount2 * 100)
            expect(result.code).toBe(OperationResultCode.TRANSFER_FALIURE_INSUFFICIENT_BALANCE)
            expect(result.balance).toBe(initalBalance2)
        });

        it('should successfully transfer and return correct balance', async () => {
            result = await walletService.transfer(walletId1, walletId2, amount2 * 100)
            expect(result.code).toBe(OperationResultCode.TRANSFER_SUCCESS)
            expect(result.balance).toBe(initalBalance1 - amount2)
            // reset the wallet balance
            await walletService.transfer(walletId2, walletId1, amount2 * 100)
        });
    });
})