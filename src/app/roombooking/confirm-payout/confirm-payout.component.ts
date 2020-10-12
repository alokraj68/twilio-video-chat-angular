import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PayPalBalance} from '../../shared/model/pay-pal-balance';
import {PaymentService} from '../../shared/service/payment.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Payout} from '../../shared/model/payout';

@Component({
    selector: 'app-confirm-payout',
    templateUrl: './confirm-payout.component.html',
    styleUrls: ['./confirm-payout.component.css']
})
export class ConfirmPayoutComponent implements OnInit {

    loading: boolean;

    constructor(
        private snackBar: MatSnackBar,
        private paymentService: PaymentService,
        private dialogRef: MatDialogRef<ConfirmPayoutComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Payout
    ) {
    }

    ngOnInit(): void {

    }

    cancel() {
        this.dialogRef.close();
    }

    confirmCashOut() {
        this.dialogRef.close(true);
    }
}
