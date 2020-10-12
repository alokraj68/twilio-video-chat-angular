import {Component, OnInit} from '@angular/core';
import {AuthService} from './shared/service/auth/auth.service';
import {User} from './shared/model/user';
import {Router} from '@angular/router';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    title = 'Join A Room';
    constructor(private router: Router) {
    }

    ngOnInit(): void {

    }




}
