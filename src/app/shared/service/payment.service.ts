import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {PaypalRedirect} from '../model/paypal-redirect';
import {PayDetails} from '../model/pay-details';
import {MerchantInfo} from '../model/merchant-info';
import {Payout} from '../model/payout';
import {PayPalBalance} from '../model/pay-pal-balance';
import {Rooms} from '../model/rooms';
import {CashoutRequest} from '../model/cashout-request';

const url = environment.baseUrl;
const requestPayUrl = url + environment.requestPayment;
const confirmUrl = url + environment.confirmPayment;
const requestPayoutUrl = url + environment.requestPayout;
const confirmPayoutUrl = url + environment.confirmPayout;
const payDetailsUrl = url + environment.payDetails;
const getPayDetails = url + environment.getPayDetails;
const balanceUrl = url + environment.payPalBalance;
const merchantInfoUrl = url + environment.merchantInfo;
const merchantLinkUrl = url + environment.merchantLinks;
const cashOutUrl = url + environment.cashOutRequest;

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
  constructor(private http: HttpClient) {
  }

  private httpOptions: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });



  paymentRequest(paymentRequest): Observable<PaypalRedirect> {
    return this.http.post<PaypalRedirect>(requestPayUrl, paymentRequest, {headers: this.httpOptions});
  }

  confirmPayment(orderId): Observable<PaypalRedirect> {
    return this.http.get<PaypalRedirect>(`${confirmUrl}/${orderId}`);
  }

  getPayDetails(): Observable<PayDetails> {
    return this.http.get<PayDetails>(getPayDetails);
  }

  getPayPalBalance(): Observable<PayPalBalance> {
    return this.http.get<PayPalBalance>(balanceUrl);
  }

  savePayDetails(payDetails): Observable<PayDetails> {
    return this.http.post<PayDetails>(payDetailsUrl, payDetails, {headers: this.httpOptions});
  }

  requestPayout(payout): Observable<Payout> {
    return this.http.post<Payout>(requestPayoutUrl, payout, {headers: this.httpOptions});
  }

  confirmPayout(id): Observable<any> {
    return this.http.post<any>(`${confirmPayoutUrl}/${id}`, '');
  }

  saveMerchantInfo(info): Observable<MerchantInfo> {
    return this.http.post<MerchantInfo>(merchantInfoUrl, info, {headers: this.httpOptions});
  }

  getMerchantLinks(): Observable<any> {
    return this.http.post<any>(merchantLinkUrl, {});
  }

  getCashOutRequests(): Observable<CashoutRequest[]> {
    return this.http.get<CashoutRequest[]>(cashOutUrl);
  }
}
