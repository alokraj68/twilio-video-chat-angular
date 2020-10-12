export interface PayRequest {
    eventId: number;
    userEmail: string;
    amountToPay: number;
    provider: string;
}
