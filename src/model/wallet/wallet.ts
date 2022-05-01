export class Wallet {

    private readonly walletId: string;
    private readonly description: string;
    private balanceInCent: number;

    constructor(walletId: string, description: string = '', balance: number = 0) {
        this.walletId = walletId;
        this.description = description;
        this.balanceInCent = balance;
    }

    getAccountId() {
        return this.walletId;
    }

    getDescription() {
        return this.description;
    }

    getBalance() {
        return this.balanceInCent;
    }

    isDeductible(amountInCent: number) {
        return this.balanceInCent >= amountInCent;
    }

    add(amountInCent: number) {
        this.balanceInCent += amountInCent;
        return this.balanceInCent;
    }

    deduct(amountInCent: number) {
        this.balanceInCent -= amountInCent;
        return this.balanceInCent;
    }


}