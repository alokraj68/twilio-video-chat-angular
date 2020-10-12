import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {AuthService} from '../../shared/service/auth/auth.service';
import {first} from 'rxjs/operators';
import {Error} from '../../shared/model/error';
import {RegisterComponent} from '../register/register.component';
import {ResetComponent} from '../reset/reset.component';
import {Router} from '@angular/router';
import {Rooms} from '../../shared/model/rooms';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

    form: FormGroup;
    loading = false;
    hide = true;
    requestError = {} as Error;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private dialog: MatDialog,
        private router: Router,
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<LoginComponent>,
        @Inject(MAT_DIALOG_DATA) public room: Rooms) {

    }

    ngOnInit() {
        this.form = this.fb.group({
            email: ['', Validators.compose([Validators.required, Validators.email])],
            password: ['', Validators.required],
        });

    }

    close() {
        this.dialogRef.close(false);
    }

    onSubmit() {
        if (this.form.invalid) {
            return;
        }

        const email = this.form.value.email;
        const password = this.form.value.password;

        this.loading = true;
        this.authService
            .login(email, password)
            .pipe(first())
            .subscribe(
                (data) => {
                    this.dialogRef.close(true);
                    this.loading = false;
                },
                (error) => {
                    this.requestError = error.error;
                    console.log(this.requestError, this.requestError.error);
                    this.loading = false;
                },
            );
    }

    joinNow() {
        this.showDialog(true);
    }

    reset() {

        this.showDialog(false);
    }

    showDialog(isRegister: boolean) {
        this.dialogRef.close();
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.panelClass = 'custom-dialog-container';
        if (isRegister) {
            const matDialogRef = this.dialog.open(RegisterComponent, dialogConfig);

            matDialogRef.afterClosed().subscribe(result => {
                if (result) {
                    if (this.room != null) {
                        this.router.navigate([`/rooms/${this.room.id}`]);
                    } else {
                        this.router.navigate(['']);
                    }
                    this.snackBar.open('Your registration was successful', 'Ok', {
                        duration: 3000
                    });
                }
            });
        } else  {
            this.dialog.open(ResetComponent, dialogConfig);
        }
    }
}
