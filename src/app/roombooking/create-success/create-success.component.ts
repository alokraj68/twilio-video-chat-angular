import {Component, Inject, Input, OnInit} from '@angular/core';
import {Rooms} from '../../shared/model/rooms';
import * as moment from 'moment';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {DialogScheduleComponent} from '../dialog-schedule/dialog-schedule.component';
import {LoginComponent} from '../../auth/login/login.component';
import {DialogInviteComponent} from '../dialog-invite/dialog-invite.component';

@Component({
    selector: 'app-create-success',
    templateUrl: './create-success.component.html',
    styleUrls: ['./create-success.component.css']
})
export class CreateSuccessComponent implements OnInit {
    startTime: string;
    endTime: string;
    eventDate: string;
    duration: string;

    constructor(private dialogRef: MatDialogRef<CreateSuccessComponent>,
                private router: Router,
                private dialog: MatDialog,
                @Inject(MAT_DIALOG_DATA) public room: Rooms) {
    }

    ngOnInit(): void {

        this.startTime = moment(this.room.startTime).format('LT');
        this.endTime = moment(this.room.endTime).format('LT');
        this.eventDate = moment(this.room.eventDate).format('LL');
    }

    inviteFriend(room: Rooms) {
        this.dialogRef.close();
        // start share dialog
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        let dialogRef;
        dialogConfig.panelClass = 'custom-dialog-container';
        dialogConfig.data = room;
        dialogConfig.disableClose = false;
        dialogRef = this.dialog.open(DialogInviteComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            data => {
            }
        );
    }

    showEvents() {
        this.dialogRef.close();
    }

    edit(room: Rooms) {
        this.dialogRef.close();
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = room;
        dialogConfig.panelClass = 'custom-dialog-container2';
        const dialogRef = this.dialog.open(DialogScheduleComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            data => {
            }
        );

    }
}
