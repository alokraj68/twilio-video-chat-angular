import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../shared/model/user';
import {FormGroup} from '@angular/forms';
import {PaymentService} from '../../shared/service/payment.service';
import {PayRequest} from '../../shared/model/pay-request';
import {Rooms} from '../../shared/model/rooms';
import {AuthService} from '../../shared/service/auth/auth.service';
import * as moment from 'moment';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {LoginComponent} from '../../auth/login/login.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {RoomService} from '../../shared/service/room/room.service';
import {TwilioToken} from '../../shared/model/twilio-token';
import {VideoChatService} from '../../shared/service/video/videochat.service';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

    currentUser: User;
    room: Rooms;
    form: FormGroup;
    userOrRoomEmpty: boolean;
    paid: boolean;
    roomPassed: boolean;

    loading = false;
    startTime: string;
    endTime: string;
    eventDate: string;


    constructor(
        private dialog: MatDialog,
        private sanckBar: MatSnackBar,
        private paymentService: PaymentService,
        private authService: AuthService,
        private roomService: RoomService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private snackBar: MatSnackBar,
        private readonly videoChatService: VideoChatService
    ) {
        this.getUser();

    }

    private getUser() {
        this.authService.currentUser$.subscribe((data) => {
            this.currentUser = data;
        });
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            this.activatedRoute = params.token;
            if (params.id != null) {
                this.userOrRoomEmpty = false;
                this.getRoom(params.id);
            } else {
                this.userOrRoomEmpty = true;
            }
        });
        if (this.currentUser !== null && this.room !== null) {
            this.checkIfRoomIPaid();
        }
    }

    private checkIfRoomIPaid() {
        this.loading = true;
        this.roomService
            .getAllRoomByUser()
            .subscribe(
                (data) => {
                    data.forEach( cat => {
                        const rooms = cat.events.filter(room => room.user.id === this.currentUser.sub);
                        this.paid = rooms.filter(room => room?.id === this.room?.id).length >= 1;
                    });
                    this.loading = false;
                },
                (error) => {
                    this.paid = false;
                    this.loading = false;
                },
            );

    }

    private setTime() {
        this.startTime = moment.unix(this.room.startTime / 1000).format('LT');
        this.endTime = moment.unix(this.room.endTime / 1000).format('LT');
        this.eventDate = moment(this.room.eventDate).format('ll');

        console.log(this.room.endTime / 1000, moment().unix());
        this.roomPassed = this.room.endTime / 1000 < moment().unix();
    }

    private getRoom(id: number) {
        this.loading = true;
        this.roomService.getRoomById(id)
            .subscribe(data => {
                    console.log(data);
                    this.loading = false;
                    this.room = data;
                    this.setTime();
                    this.userOrRoomEmpty = false;
                },
                (error) => {
                    this.loading = false;
                    this.userOrRoomEmpty = true;
                    console.log(error.message);
                },
            );
    }

    requestPayment() {
        if (this.currentUser == null) {
            this.showLoginDialog();
        } else if (this.paid){
           this.startRoom(this.room);
        } else {
            this.sendRequest();
        }

    }

    startRoom(room: Rooms) {
        const twilioTokenRequest = {} as TwilioToken;
        twilioTokenRequest.eventId = room.id;
        twilioTokenRequest.userId = this.currentUser.sub;
        this.loading = true;
        this.videoChatService
            .getAuthToken(twilioTokenRequest)
            .subscribe(
                (data) => {
                    this.loading = false;
                    window.open(`${window.location.origin}/video/${data.twilioToken}/${this.room.id}`, '_blank');
                },
                (error) => {
                    this.loading = false;
                    this.toaster(error.message);
                },
            );
    }
    toaster(message) {
        this.snackBar.open(message, 'Ok',
            {
                duration: 2000,
                verticalPosition: 'top',
                panelClass: ['my-snackbar']
            });
    }

    private sendRequest() {
        this.loading = true;
        const paymentRequest = {} as PayRequest;
        paymentRequest.provider = 'paypal';
        paymentRequest.eventId = this.room.id;
        paymentRequest.userEmail = this.currentUser.email;
        paymentRequest.amountToPay = this.room.price;
        console.log(paymentRequest);
        this.paymentService.paymentRequest(paymentRequest)
            .subscribe(
                (data) => {
                    console.log(data);
                    this.loading = false;
                    sessionStorage.setItem('OrderId', data.paypalOrderId);
                    window.location.href = data.approvalUrl;
                },
                (error) => {
                    this.loading = false;
                    console.log(error.message);
                },
            );
    }

    private showLoginDialog() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = this.room;
        dialogConfig.panelClass = 'custom-dialog-container';
        let dialogRef;
        dialogRef = this.dialog.open(LoginComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                window.location.href = `${window.location.origin}/rooms/${this.room.id}`;
                this.sanckBar.open('Login Success', 'Ok', {
                    duration: 3000
                });
            }
        });
    }

    goHome() {
        window.location.href = `${window.location.origin}/home#rooms`;
    }
}
