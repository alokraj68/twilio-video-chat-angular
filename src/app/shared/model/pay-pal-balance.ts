export interface PayPalBalance {
    balance: number;
    creditOrDebit: string;
    grossAmount: number;
    id: number;
    joinARoomFee: number;
    netAmount: number;
    payPalFee: number;
    paymentEmail: string;
    preferredProvider: string;
    totalPaid: number;
    userId: number;
}
