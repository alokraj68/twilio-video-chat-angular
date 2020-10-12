import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../shared/model/user';
import {AuthService} from '../../shared/service/auth/auth.service';
import {RoomService} from '../../shared/service/room/room.service';
import {RoomData} from '../../shared/model/room-data';
import * as moment from 'moment';

@Component({
    selector: 'app-rooms',
    templateUrl: './rooms.component.html',
    styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

    currentUser: User;
    roomData: RoomData[] = [];
    loading = false;

    constructor( private authService: AuthService,
                 private roomService: RoomService) {
        this.authService.currentUser$.subscribe((data) => (this.currentUser = data));
    }

    ngOnInit(): void {
        this.loading = true;
        this.roomService
            .getRooms()
            .subscribe(
                (data) => {
                    this.roomData = data;
                    this.loading = false;
                },
                (error) => {
                    this.loading = false;
                },
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
