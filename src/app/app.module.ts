import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {ResetComponent} from './auth/reset/reset.component';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {RoomsComponent} from './roombooking/rooms/rooms.component';
import {MyroomsComponent} from './roombooking/myrooms/myrooms.component';
import {AccountComponent} from './roombooking/account/account.component';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatIconModule} from '@angular/material/icon';
import {RoomComponent} from './roombooking/room/room.component';
import {AppRoutingModule} from './app-routing/app-routing.module';
import {DialogScheduleComponent} from './roombooking/dialog-schedule/dialog-schedule.component';
import {DialogInviteComponent} from './roombooking/dialog-invite/dialog-invite.component';
import {CreateSuccessComponent} from './roombooking/create-success/create-success.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {PortalModule} from '@angular/cdk/portal';
import {WindowComponent} from './window.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatMenuModule} from '@angular/material/menu';
import {MatListModule} from '@angular/material/list';
import {MatRadioModule} from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';
import {DeviceService} from './shared/service/video/device.service';
import {StorageService} from './shared/service/video/storage.service';
import {VideoChatService} from './shared/service/video/videochat.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {DropFileDirective} from './roombooking/dialog-schedule/drop-file.directive';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFireStorageModule} from '@angular/fire/storage';
import { PaymentRedirectComponent } from './roombooking/payment-redirect/payment-redirect.component';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import {AuthInterceptor} from './shared/interceptors/auth/auth-interceptor';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {AuthActivateGuard} from './auth-activate.guard';
import { SetupComponent } from './roombooking/setup/setup.component';
import {MatBadgeModule} from '@angular/material/badge';
import { ConfirmPayoutComponent } from './roombooking/confirm-payout/confirm-payout.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { PasswordComponent } from './auth/password/password.component';
import { PartnerCallbackComponent } from './roombooking/partner-callback/partner-callback.component';
import {VideoComponent} from './video/video.component';
import { CashoutMagementComponent } from './admin/cashout-magement/cashout-magement.component';
import {MatTableModule} from '@angular/material/table';
import { CashOutComponent } from './roombooking/cash-out/cash-out.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { PreviewComponent } from './video/preview/preview.component';
import { SpeakerViewComponent } from './video/speaker-view/speaker-view.component';
@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        ResetComponent,
        RoomsComponent,
        MyroomsComponent,
        AccountComponent,
        RoomComponent,
        RoomComponent,
        DialogScheduleComponent,
        DialogInviteComponent,
        CreateSuccessComponent,
        WindowComponent,
        DropFileDirective,
        PaymentRedirectComponent,
        HomeComponent,
        MainComponent,
        SetupComponent,
        ConfirmPayoutComponent,
        PasswordComponent,
        PartnerCallbackComponent,
        VideoComponent,
        CashoutMagementComponent,
        CashOutComponent,
        PreviewComponent,
        SpeakerViewComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        MatSelectModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatProgressBarModule,
        MatIconModule,
        FlexLayoutModule,
        MatSlideToggleModule,
        PortalModule,
        MatToolbarModule,
        MatSidenavModule,
        MatMenuModule,
        MatListModule,
        MatRadioModule,
        MatCardModule,
        MatSnackBarModule,
        MatDatepickerModule,
        MatMomentDateModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireStorageModule,
        MatProgressSpinnerModule,
        MatBadgeModule,
        NgxMaterialTimepickerModule,
        ClipboardModule,
        MatTableModule,
        MatCheckboxModule
    ],
    providers: [DeviceService, VideoChatService, StorageService, AuthActivateGuard,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
    bootstrap: [AppComponent]
})
export class AppModule {
}
