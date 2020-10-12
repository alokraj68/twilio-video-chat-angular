import {Component, Input, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {DialogInviteComponent} from '../dialog-invite/dialog-invite.component';
import {VideoChatService} from '../../shared/service/video/videochat.service';
import {TwilioToken} from '../../shared/model/twilio-token';
import {Router} from '@angular/router';
import {Rooms} from '../../shared/model/rooms';
import * as moment from 'moment';
import {User} from '../../shared/model/user';
import {LoginComponent} from '../../auth/login/login.component';
import {DialogScheduleComponent} from '../dialog-schedule/dialog-schedule.component';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
    @Input() currentUser: User;
    @Input() room: Rooms;
    showVideo = false;
    twilioToken: string;
    myroom: boolean;

    startTime: string;
    endTime: string;
    eventDate: string;
    duration: string;

    isJoin: boolean;
    isBook: boolean;
    isStart: boolean;
    isFull: boolean;
    loading: boolean;


    constructor(private dialog: MatDialog,
                private router: Router,
                private snackBar: MatSnackBar,
                private readonly videoChatService: VideoChatService) {
    }

    ngOnInit(): void {
        this.duration = moment.utc(moment.unix(this.room.endTime / 1000).diff(moment.unix(this.room.startTime / 1000))).format('H [h] mm [min]');
        this.startTime = moment.unix(this.room.startTime / 1000).format('LT');
        this.endTime = moment.unix(this.room.endTime / 1000).format('LT');
        this.eventDate = moment(this.room.eventDate).local().format('ll');
        this.isFull = this.room.maxNoPeople === this.room.subscribers.length;

        this.setActionButton();
        if (this.currentUser != null) {
            this.myroom = this.currentUser.sub === this.room.user.id;
        } else {
            this.myroom = false;
        }
    }

    private setActionButton() {
        if (this.currentUser == null) {
            this.isBook = true;
        } else if (this.room != null && this.room.user != null) {
            if (this.currentUser.sub === this.room.user.id) {
                this.isStart = true;
            } else {
                const subscribers = this.room.subscribers.filter(it => this.currentUser.sub === it.userId);
                if ( subscribers.length === 0 ) {
                    this.isBook = true;
                } else {
                    this.isJoin = true;
                }
            }
        }
    }

    shareRoom() {
        this.launchDialog(false);
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
                    this.twilioToken = data.twilioToken;
                    this.loading = false;
                    window.open(`${window.location.origin}/video/${data.twilioToken}/${this.room.id}`, '_blank');
                },
                (error) => {
                    this.loading = false;
                    this.toaster(error.message);
                },
            );
    }

    bookRoom() {
        if (this.room.price !== 0) {
            this.router.navigate([`/rooms/${this.room.id}`]);
        } else {
            if (this.currentUser != null){
                this.startRoom(this.room);
            } else {
                const config = new MatDialogConfig();
                config.disableClose = true;
                config.autoFocus = true;
                config.data = this.room;
                config.panelClass = 'custom-dialog-container';
                const dialogRef = this.dialog.open(LoginComponent, config);
                dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        this.router.navigate([`/rooms/${this.room.id}`]);
                        this.snackBar.open('Login Success', 'Ok', {
                            duration: 3000
                        });
                    }
                });
            }
        }
    }
    invite() {
        this.launchDialog(false);
    }

    launchDialog(isLogin) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        let dialogRef;
        dialogConfig.panelClass = 'custom-dialog-container';
        if (isLogin) {
            dialogConfig.disableClose = true;
            dialogRef = this.dialog.open(LoginComponent, dialogConfig);

        } else {
            dialogConfig.data = this.room;
            dialogConfig.disableClose = false;
            dialogRef = this.dialog.open(DialogInviteComponent, dialogConfig);
        }
    }

    toaster(message) {
        this.snackBar.open(message, 'Ok',
            {
                duration: 2000,
                verticalPosition: 'top',
                panelClass: ['my-snackbar']
            });
    }
    editRoom(room: Rooms) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = room;
        dialogConfig.panelClass = 'custom-dialog-container2';
        const dialogRef = this.dialog.open(DialogScheduleComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            data => {
                this.router.navigate(['/my-rooms']);
            }
        );
    }

    getPriceText(price): string {
        if (price !== 0) {
            return `Book $${price}`;
        } else  {
            return 'Free to Join';
        }
    }
}
