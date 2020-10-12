import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../shared/service/auth/auth.service';
import {User} from '../shared/model/user';
import {Rooms} from '../shared/model/rooms';
import {Router} from '@angular/router';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
    public currentUser: User;
    title = 'Join A Room';
    loading = false;

    constructor(private dialog: MatDialog,
                private authService: AuthService, private router: Router) {
         this.authService.currentUser$.subscribe((data) => {
             (this.currentUser = data);
         });
    }

    ngOnInit(): void {
        this.authService.initialize();
    }

    logout() {
        this.authService.logout();
    }

    goHome() {
        window.location.href = `${window.location.origin}/home#rooms`;
    }
}
