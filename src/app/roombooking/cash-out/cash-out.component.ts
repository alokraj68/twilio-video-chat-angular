import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {PaymentService} from '../../shared/service/payment.service';
import {Payout} from '../../shared/model/payout';
import {ConfirmPayoutComponent} from '../confirm-payout/confirm-payout.component';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-cash-out',
    templateUrl: './cash-out.component.html',
    styleUrls: ['./cash-out.component.css']
})
export class CashOutComponent implements OnInit {

    formPayout: FormGroup;
    loading: boolean;
    room: any;

    constructor(private fb: FormBuilder,
                private dialogRef: MatDialogRef<CashOutComponent>,
                private paymentService: PaymentService,
                private dialog: MatDialog,
                private snackBar: MatSnackBar,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.room = data;
    }

    ngOnInit(): void {
        this.formPayout = this.fb.group({
            amount: ['', [Validators.required, Validators.min(1), Validators.max(this.room.billing.balance)]],
        });
    }

    payout() {
        if (this.formPayout.invalid) {
            return;
        }
        const payout = this.formPayout.value;
        payout.currency = 20;
        payout.eventId = this.room.id;
        this.loading = true;
        this.paymentService
            .requestPayout(payout)
            .subscribe(
                (data) => {
                    this.loading = false;
                    this.close();
                    this.showConfirmDialog(data);
                },
                (error) => {
                    this.loading = false;
                    this.close();
                    this.showMessage(error.message);
                },
            );
    }

    close() {
        this.dialogRef.close();
    }

    private showConfirmDialog(data: Payout) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.panelClass = 'custom-dialog-container';
        dialogConfig.data = this.formPayout.value;
        const dialogRef = this.dialog.open(ConfirmPayoutComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
            }
        });
    }


    showMessage(message) {
        this.snackBar.open(message, 'Ok',
            {
                duration: 2000,
                verticalPosition: 'top',
                panelClass: ['my-snackbar-error']
            });
    }

}
