import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../shared/model/user';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../../shared/service/auth/auth.service';
import {PaymentService} from '../../shared/service/payment.service';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-partner-callback',
  templateUrl: './partner-callback.component.html',
  styleUrls: ['./partner-callback.component.css']
})

export class PartnerCallbackComponent implements OnInit {  
  currentUser: User;
  merchantId: string;
  merchantIdInPayPal: string;
  permissionsGranted: boolean;
  accountStatus: string;
  consentStatus: boolean;
  productIntentID: string;
  isEmailConfirmed: boolean;
  returnMessage: string;
  loading: boolean;
  error: boolean;
  reload: number;

  constructor(private snackBar: MatSnackBar, 
              private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private paymentService: PaymentService
  ) {
    this.authService.currentUser$.subscribe((data) => (this.currentUser = data));
  }

  ngOnInit(): void {
    this.reload = 5;
    this.error = false;
    if (this.route.snapshot.queryParams) {
      this.merchantId = this.route.snapshot.queryParams['merchantId'];
      this.merchantIdInPayPal = this.route.snapshot.queryParams['merchantIdInPayPal'];
      this.permissionsGranted = this.route.snapshot.queryParams['permissionsGranted'];
      this.accountStatus = this.route.snapshot.queryParams['accountStatus'];
      this.consentStatus = this.route.snapshot.queryParams['consentStatus'];
      this.productIntentID = this.route.snapshot.queryParams['productIntentID'];
      this.isEmailConfirmed = this.route.snapshot.queryParams['isEmailConfirmed'];
      this.returnMessage = this.route.snapshot.queryParams['returnMessage'];
    }
    if (this.merchantId) {
      this.saveMerchantInfo();
    } else {
      this.redirectToSetup();
    }
  }

  showMessage(message) {
    this.snackBar.open(message, 'Ok',
        {
            duration: 5000,
            verticalPosition: 'top',
            panelClass: ['my-snackbar-error']
        });
}

  private saveMerchantInfo() {
    this.loading = true;
    const info = {
      merchantId: this.merchantId,
      merchantIdInPayPal: this.merchantIdInPayPal,
      permissionsGranted: this.permissionsGranted,
      accountStatus: this.accountStatus,
      consentStatus: this.consentStatus,
      productIntentID: this.productIntentID,
      isEmailConfirmed: this.isEmailConfirmed
    };
    this.paymentService
            .saveMerchantInfo(info)
            .subscribe(
                (data) => {
                    this.loading = false;
                    this.authService.updateUserInfo()
                    .pipe(first())
                    .subscribe(() => {this.startReloadTimeout()});
                },
                (error) => {
                    this.loading = false;
                    this.error = true;
                    this.showMessage(error.message);
                    this.startReloadTimeout();
                },
            );
  }

  private startReloadTimeout(){
    let interval = setInterval(() => {
      if (this.reload === 0) {
        clearInterval(interval);
        return this.redirectToSetup();
      }
      this.reload--;
    }, 1000)
  }

  private redirectToSetup() {
    this.router.navigate(['/main/account'])
  }
}