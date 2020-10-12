import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Error} from '../../shared/model/error';
import {User} from '../../shared/model/user';
import {AuthService} from '../../shared/service/auth/auth.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {first} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

  form: FormGroup;
  loading = false;
  requestError: Error = {} as Error;
  constructor(
      private fb: FormBuilder,
      private snackBar: MatSnackBar,
      private createUserService: AuthService,
      private dialogRef: MatDialogRef<ResetComponent>,
      @Inject(MAT_DIALOG_DATA) data) {

  }



  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
    });
  }

  close() {
    this.dialogRef.close();
  }

  reset() {
    this.dialogRef.close(this.form.value);
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.requestError = {} as Error;
    const email = this.form.value.email;
    this.loading = true;
    this.createUserService
        .forgotPassword(email)
        .subscribe(
            (data) => {
              if (data){
                this.dialogRef.close();
                this.showMessage('Email sent successfully', 'my-snackbar-success');
              } else  {
                this.showMessage('Account with email provided does not exist', 'my-snackbar-error');
              }
              this.loading = false;
            },
            (error) => {
              this.loading = false;
              this.requestError = error;
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
