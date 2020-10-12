import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {User} from '../../shared/model/user';
import {Error} from '../../shared/model/error';
import {AuthService} from '../../shared/service/auth/auth.service';
import {Router} from '@angular/router';
import {MatCheckbox} from '@angular/material/checkbox';


@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    form: FormGroup;
    loading = false;
    hide = true;
    requestError = {} as Error;
    user: User;

    constructor(
        private fb: FormBuilder,
        private createUserService: AuthService,
        private dialogRef: MatDialogRef<RegisterComponent>,
        private router: Router,
        @Inject(MAT_DIALOG_DATA) data) {

    }


    ngOnInit(): void {
        this.form = this.fb.group({
            email: ['', Validators.compose([Validators.required, Validators.email])],
            username: ['', Validators.required],
            password: ['', Validators.required],
        });
    }

    close() {
        this.dialogRef.close(false);
    }

    onKeyup(event) {
        console.log(event);
    }

    onSubmit(terms: MatCheckbox) {
        if (this.form.invalid) {
            return;
        }

        if (!terms.checked) {
            this.requestError.error = 'Please accept terms & Condition';
            return;
        }
        this.requestError.error = '';
        this.user = this.form.value;
        this.loading = true;
        this.createUserService.checkUser(this.form.value.username)
            .subscribe(
                (isOk) => {
                    if (isOk) {
                        this.requestError.error = 'User name already exist';
                        this.loading = false;
                    } else {
                        this.createUserService
                            .sendUserDetails(this.user)
                            .subscribe(
                                (data) => {
                                    this.dialogRef.close(true);
                                    this.loading = false;
                                    this.user = null;
                                    this.router.navigate(['']);
                                },
                                (error) => {
                                    this.loading = false;
                                    this.requestError = error.error;
                                },
                            );
                    }
                },
                (error) => {
                    this.loading = false;
                    this.requestError = error;
                },
            );
    }
}
