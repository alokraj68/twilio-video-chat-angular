import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../model/user';
import { HttpBackend, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

const url = environment.baseUrl;
const infoUrl = url + environment.userInfo;
const authUrl = url + environment.login;
const registerUrl = url + environment.register;
const checkUserUrl = url + environment.checkUser;
const resetUrl = url + environment.reset;
const forgotUrl = url + environment.forgot;

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private currentUserSubject: BehaviorSubject<User>;
    public currentUser$: Observable<User>;

    constructor(private http: HttpClient,
                private handler: HttpBackend,
                private router: Router) {
        this.http = new HttpClient(handler);
        this.currentUserSubject = new BehaviorSubject<User>(
            this.getDecodedAccessToken(sessionStorage.getItem('access_token')));
        this.currentUser$ = this.currentUserSubject.asObservable();
    }
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization:
                'Basic ' + btoa(''),
        }),
    };

    private httpOptionsRegister: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });


    initialize() {
        const currentToken = sessionStorage.getItem('access_token');
        if (currentToken) {
            this.currentUserSubject.next(this.getDecodedAccessToken(currentToken));
        }
    }

    public isAuthenticated(): boolean {
        const token = sessionStorage.getItem('access_token');
        return token !== null;
    }

    getDecodedAccessToken(token: string): any {
        try {
            return jwt_decode(token.toString());
        } catch (Error) {
            return null;
        }
    }

    login(email: string, password: string) {
        const userRequest = {} as User;
        userRequest.email = email;
        userRequest.password = password;

        return this.http.post<User>(authUrl, userRequest, this.httpOptions).pipe(
            map((user) => {
                // store user details and jwt token in session storage and keep user logged
                sessionStorage.setItem('access_token', user.access_token);
                this.currentUserSubject.next(user);
                // return user;
            }),
        );
    }

    updateUserInfo() {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')
        });
        return this.http.post<User>(infoUrl, {}, {headers: headers}).pipe(
            map((user) => {
                // store user details and jwt token in session storage and keep user logged
                this.currentUserSubject.next(jwt_decode(user.access_token));
                sessionStorage.setItem('access_token', user.access_token);
                // return user;
            }),
        );
    }

    /*send user details to server*/
    sendUserDetails(user) {
        return this.http.post<User>(registerUrl, user, { headers: this.httpOptionsRegister }).pipe(
            map((userResponse) => {
                // store user details and jwt token in session storage and keep user logged
                this.currentUserSubject.next(userResponse);
                sessionStorage.setItem('access_token', userResponse.access_token);
                // return user;
            }),
        );
    }

    checkUser(userName): Observable<boolean> {
        return this.http.get<boolean>(checkUserUrl + '/' + userName, { headers: this.httpOptionsRegister });
    }

    resetPassword(user): Observable<boolean> {
        return this.http.post<boolean>(resetUrl, user, { headers: this.httpOptionsRegister });
    }

    forgotPassword(email): Observable<boolean> {
        let params = new HttpParams();
        params = params.append('email', email);
        return this.http.get<boolean>(forgotUrl, {params, headers: this.httpOptionsRegister });
    }

    logout() {
        // remove token from session storage
        sessionStorage.removeItem('access_token');
        this.currentUserSubject.next(null);
        window.location.href = `${window.location.origin}`;
    }
}
