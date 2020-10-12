import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../shared/model/user';
import {Rooms} from '../../shared/model/rooms';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {DialogScheduleComponent} from '../dialog-schedule/dialog-schedule.component';
import {AuthService} from '../../shared/service/auth/auth.service';
import {RoomService} from '../../shared/service/room/room.service';
import {CreateSuccessComponent} from '../create-success/create-success.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {RoomData} from '../../shared/model/room-data';
import * as moment from 'moment';
import {first, last} from 'rxjs/operators';

@Component({
    selector: 'app-myrooms',
    templateUrl: './myrooms.component.html',
    styleUrls: ['./myrooms.component.css']
})
export class MyroomsComponent implements OnInit {
    currentUser: User;
    roomData: RoomData[] = [];
    loading = false;


    constructor(private dialog: MatDialog,
                private authService: AuthService,
                private snackBar: MatSnackBar,
                private roomService: RoomService) {
        this.authService.currentUser$.subscribe((data) => (this.currentUser = data));
    }

    ngOnInit(): void {
        this.getRooms();
    }

    private getRooms() {
        this.loading = true;
        this.roomService
            .getRoomByUser()
            .subscribe(
                (data) => {
                    this.roomData = data;
                    this.loading = false;
                },
                (error) => {
                    this.loading = false;
                    console.log(error.message);
                },
            );
    }

    launchScheduleDialog() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        // dialogConfig.position = top;
        dialogConfig.panelClass = 'custom-dialog-container2';
        const dialogRef = this.dialog.open(DialogScheduleComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            data => {
                if (data) {
                    this.getRooms();
                    this.showSuccess(data);
                }
            }
        );
    }

    private showSuccess(room: Rooms) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.autoFocus = true;
        dialogConfig.data = room;
        // dialogConfig.position = top;
        const dialogRef = this.dialog.open(CreateSuccessComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(
            data => {
                this.getRooms();
            }
        );
    }

    getWeekStart(weekNo): string{
        return moment().day('Monday').week(weekNo).format('ll');
    }
    getWeekEnd(weekNo): string{
        return moment().day('Sunday').week(weekNo).format('ll');
    }

    setWeekValue(week): string {
        // this week
        if (moment().week() === week) {
            return 'This Week';

            // next wek
        } else if (moment().week() + 1 === week) {
            return 'Next Week';
        } else {
            return `${this.getWeekStart(week)} - ${this.getWeekEnd(week + 1)}`;
        }
    }

}
