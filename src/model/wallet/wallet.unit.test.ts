import { Wallet } from "./wallet";

describe('Wallet', () => {

    let wallet;
    let walletId = '8888'
    let description = 'testing account'
    let initialBalance = 10000

    beforeEach(() => {
        wallet = new Wallet(walletId, description, initialBalance)
    });

    describe('get wallet id', () => {
        it('should return wallet id', async () => {
            expect(wallet.getAccountId()).toBe(walletId);
        });
    });

    describe('get wallet description', () => {
        it('should return wallet description', async () => {
            expect(wallet.getDescription()).toBe(description);
        });
    });

    describe('get wallet balance', () => {
        it('should return wallet balance', async () => {
            expect(wallet.getBalance()).toBe(initialBalance);
        });
    });

    describe('check if given amount can be deducted from wallet ', () => {
        it('should return true if given amount is no greater than current balance', async () => {
            expect(wallet.isDeductible(initialBalance)).toBe(true);
        });
        it('should return false if given amount is less tham current balance', async () => {
            expect(wallet.isDeductible(initialBalance + 1)).toBe(false);
        });
    });

    describe('add amount to wallet ', () => {
        it('should return wallet balance', async () => {
            expect(wallet.add(1)).toBe(initialBalance + 1);
        });
    });

    describe('deduct amount from wallet ', () => {
        it('should return wallet balance', async () => {
            expect(wallet.deduct(1)).toBe(initialBalance - 1);
        });
    });
});