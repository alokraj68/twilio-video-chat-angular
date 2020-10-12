import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {AuthService} from '../../shared/service/auth/auth.service';
import {User} from '../../shared/model/user';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-password',
    templateUrl: './password.component.html',
    styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {
    form: FormGroup;
    hide = true;
    hide1 = true;
    loading: boolean;
    email: string;

    constructor(private fb: FormBuilder,
                private router: Router,
                private snackBar: MatSnackBar,
                private activatedRoute: ActivatedRoute,
                private authService: AuthService) {
    }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            this.email = params.email;
        });
        this.form = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirm: ['', [Validators.required]]
        }, {validator: passwordMatchValidator});
        console.log(this.email);
    }

    /* Shorthands for form controls (used from within template) */
    get password() {
        return this.form.get('password');
    }

    get password2() {
        return this.form.get('confirm');
    }

    /* Called on each input in either password field */
    onPasswordInput() {
        if (this.form.hasError('passwordMismatch')) {
            this.password2.setErrors([{passwordMismatch: true}]);
        } else {
            this.password2.setErrors(null);
        }
    }

    onSubmit() {
        if (this.form.invalid) {
            return;
        }
        const user: User = this.form.value;
        user.email = this.email;
        console.log(user);
        this.authService
            .resetPassword(user)
            .subscribe(
                (data) => {
                    if (data) {
                        this.showMessage('Password Change successfully', 'my-snackbar-success');
                        window.location.href = `${window.location.origin}`;
                    } else {
                        this.showMessage('Something happened or Link expired', 'my-snackbar-error');
                    }
                    this.loading = false;
                },
                (error) => {
                    this.loading = false;
                    this.showMessage(error.message, 'my-snackbar-error');
                },
            );
    }

    showMessage(message, panelClass) {
        this.snackBar.open(message, 'Ok',
            {
                duration: 2000,
                verticalPosition: 'top',
                panelClass: [panelClass]
            });
    }
}

export const passwordMatchValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
    if (formGroup.get('password').value === formGroup.get('confirm').value) {
        return null;
    } else {
        return {passwordMismatch: true};
    }
};
