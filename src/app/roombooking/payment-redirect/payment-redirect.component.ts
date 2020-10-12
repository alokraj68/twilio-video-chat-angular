import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PaymentService} from '../../shared/service/payment.service';

@Component({
    selector: 'app-payment-redirect',
    templateUrl: './payment-redirect.component.html',
    styleUrls: ['./payment-redirect.component.css']
})
export class PaymentRedirectComponent implements OnInit {
    token: string;
    PayerID: string;

    loading: boolean;
    success: boolean;
    orderIdEmpty: boolean;

    constructor(
        private activatedRoute: ActivatedRoute,
        private paymentService: PaymentService
    ) {
    }

    ngOnInit(): void {

        this.activatedRoute.queryParams.subscribe(params => {
            this.token = params.token;
            this.PayerID = params.PayerID;
            console.log(this.token, this.PayerID);
            if (this.token != null && this.PayerID != null) {
                if (sessionStorage.getItem('OrderId') !== undefined) {
                    this.loading = true;
                    this.orderIdEmpty = false;
                    this.paymentService
                        .confirmPayment(sessionStorage.getItem('OrderId'))
                        .subscribe(data => {
                            this.success = true;
                            this.loading = false;
                            sessionStorage.removeItem('OrderId');
                        }, (error) => {
                            this.success = false;
                            this.loading = false;
                            console.log(error.message);
                            sessionStorage.removeItem('OrderId');
                        });
                } else {
                    this.orderIdEmpty = true;
                }
            }
        });
    }

}
