import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {LoginComponent} from '../auth/login/login.component';
import {RoomService} from '../shared/service/room/room.service';
import {ActivatedRoute, Router} from '@angular/router';
import {RegisterComponent} from '../auth/register/register.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {RoomData} from '../shared/model/room-data';
import * as moment from 'moment';
import {ViewportScroller} from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewChecked {

  title = 'Join A Room';
  roomData: RoomData[] = [];
  loading: boolean;
  fragment;


  constructor(private dialog: MatDialog,
              private sanckBar: MatSnackBar,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private roomService: RoomService) {
  }

  ngOnInit(): void {
    this.activatedRoute.fragment.subscribe(fragment => { this.fragment = fragment; });
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

  ngAfterViewChecked(): void {
    try {
      if (this.fragment) {
        document.querySelector('#' + this.fragment).scrollIntoView();
      }
    } catch (e) { }
  }


  showRegister() {
    this.openDialog(false);
  }

  showLoginDialog() {
    this.openDialog(true);
  }

  openDialog(isLogin) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'custom-dialog-container';
    let dialogRef;
    if (isLogin) {
      dialogRef = this.dialog.open(LoginComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.router.navigate(['']);
          this.sanckBar.open('Login Success', 'Ok', {
            duration: 3000
          });
        }
      });
    } else {
      dialogRef = this.dialog.open(RegisterComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.router.navigate(['']);
          this.sanckBar.open('Your registration was successful', 'Ok', {
            duration: 3000
          });
        }
      });
    }
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
