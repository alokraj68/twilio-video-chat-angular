import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {AuthService} from '../../shared/service/auth/auth.service';
import {RoomService} from '../../shared/service/room/room.service';
import {User} from '../../shared/model/user';
import {Rooms} from '../../shared/model/rooms';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PaymentService} from '../../shared/service/payment.service';
import {PayDetails} from '../../shared/model/pay-details';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Payout} from '../../shared/model/payout';
import {LoginComponent} from '../../auth/login/login.component';
import {RegisterComponent} from '../../auth/register/register.component';
import {ConfirmPayoutComponent} from '../confirm-payout/confirm-payout.component';
import {PayPalBalance} from '../../shared/model/pay-pal-balance';
import {CashOutComponent} from '../cash-out/cash-out.component';

@Component({
    selector: 'app-setup',
    templateUrl: './setup.component.html',
    styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {
    currentUser: User;
    rooms: Rooms[] = [];
    loading: boolean;
    total = 0;
    form: FormGroup;
    changePayEmail: boolean;
    cashOut: boolean;
    payDetails: PayDetails;
    payPalBalance: PayPalBalance;
    email: string;
    currency: number;

    constructor(private dialog: MatDialog,
                private fb: FormBuilder,
                private snackBar: MatSnackBar,
                private authService: AuthService,
                private roomService: RoomService,
                private paymentService: PaymentService) {
        this.authService.currentUser$.subscribe((data) => (this.currentUser = data));
    }

    ngOnInit(): void {
        this.loading = true;
        this.getRooms();
        this.getPayDetails();
        this.getBalance();
        this.loading = false;
        this.form = this.fb.group({
            paymentEmail: [this.email, Validators.compose([Validators.required, Validators.email])],
        });
        this.changePayEmail = false;
        this.cashOut = false;
    }
    private getRooms() {
        this.loading = true;
        this.roomService
            .getAllRoomByUser()
            .subscribe(
                (data) => {
                    data.forEach( cat => {
                        const rooms = cat.events.filter(room => room.user.id === this.currentUser.sub);
                        rooms.forEach( userRoom => {
                            this.rooms.push(userRoom);
                        });
                    });
                    this.calculateTotal(this.rooms);
                    this.loading = false;
                },
                (error) => {
                    this.loading = false;
                    this.showMessage(error.message);
                },
            );
    }
    private getPayDetails() {
        this.loading = true;
        this.paymentService
            .getPayDetails()
            .subscribe(
                (data) => {
                    this.setPaymentDetails(data);
                },
                (error) => {
                    this.loading = false;
                    this.showMessage(error.message);
                },
            );
    }

    private setPaymentDetails(data: PayDetails) {
        if (data !== null) {
            this.payDetails = data;
            this.loading = false;
            this.email = this.payDetails?.paymentEmail;
            this.currency = this.payDetails?.currency;
        }
    }

    private calculateTotal(data: Rooms[]) {
        data.forEach(room => {
            const total = room.price * room.subscribers.length;
            this.total += total;
        });

    }

    private getBalance() {
        this.loading = true;
        this.paymentService
            .getPayPalBalance()
            .subscribe(
                (data) => {
                    this.payPalBalance = data;
                    this.loading = false;
                },
                (error) => {
                    this.loading = false;
                    this.showMessage(error.message);
                },
            );
    }
    savePayPalEmail() {
        if (this.form.invalid) {
            return;
        }
        const  payDetails: PayDetails = this.form.value;
        payDetails.currency = 1;
        this.loading = true;
        this.paymentService
            .savePayDetails(payDetails)
            .subscribe(
                (data) => {
                    this.payDetails = data;
                    this.loading = false;
                    this.changePayEmail = false;
                },
                (error) => {
                    this.loading = false;
                    this.showMessage(error.message);
                },
            );
    }

    showLoginDialog() {

    }

    showMessage(message) {
        this.snackBar.open(message, 'Ok',
            {
                duration: 2000,
                verticalPosition: 'top',
                panelClass: ['my-snackbar-error']
            });
    }

    showCashOutDialog(room) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.panelClass = 'custom-dialog-container2';
        dialogConfig.data = room;
        dialogConfig.width = '300px';
        const dialogRef = this.dialog.open(CashOutComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            this.cashOut = false;
            this.total = 0;
            this.getBalance();
            this.rooms = [];
            this.getRooms();
        });
    }
}
