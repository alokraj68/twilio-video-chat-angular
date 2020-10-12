export interface PaypalRedirect {
    eventId: number;
    userEmail: string;
    amountToPay: number;
    paypalOrderId: string;
    provider: string;
    approvalUrl: string;
    id: number;
    status: string;
    amountPaid: number;
    balance: number;
}
