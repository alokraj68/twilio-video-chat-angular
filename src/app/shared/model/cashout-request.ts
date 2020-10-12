import {Rooms} from './rooms';

export interface CashoutRequest {
    event: Rooms;
    id: number;
    remark: string;
    status: string;
}
