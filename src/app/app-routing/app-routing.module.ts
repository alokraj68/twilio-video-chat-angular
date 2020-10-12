import {NgModule, OnInit} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountComponent} from '../roombooking/account/account.component';
import {RoomsComponent} from '../roombooking/rooms/rooms.component';
import {MyroomsComponent} from '../roombooking/myrooms/myrooms.component';
import {VideoComponent} from '../video/video.component';
import {PaymentRedirectComponent} from '../roombooking/payment-redirect/payment-redirect.component';
import {MainComponent} from '../main/main.component';
import {HomeComponent} from '../home/home.component';
import {SetupComponent} from '../roombooking/setup/setup.component';
import {PasswordComponent} from '../auth/password/password.component';
import {AuthActivateGuard} from '../auth-activate.guard';
import { PartnerCallbackComponent } from '../roombooking/partner-callback/partner-callback.component';
import {CashoutMagementComponent} from '../admin/cashout-magement/cashout-magement.component';

const routes: Routes = [
    {path: '*', redirectTo: 'home'},
    {path: 'home', component: HomeComponent},
    {path: 'contacts', component: HomeComponent},
    {path: 'video/:token/:id', component: VideoComponent},
    {
        path: '', component: MainComponent, children: [
            {path: '', pathMatch: 'full', redirectTo: 'my-rooms'},
            {path: 'my-rooms', component: MyroomsComponent, canActivate: [AuthActivateGuard]},
            {path: 'account', component: SetupComponent, canActivate: [AuthActivateGuard]},
            {path: 'all-rooms', component: RoomsComponent, canActivate: [AuthActivateGuard]},
            {path: 'rooms/:id', component: AccountComponent},
            {path: 'payment', component: PaymentRedirectComponent, canActivate: [AuthActivateGuard]},
            {path: 'password-reset', component: PasswordComponent},
            {path: 'partner-callback', component: PartnerCallbackComponent},
            {path: 'admin', component: CashoutMagementComponent}
        ]
    }
];


@NgModule({
    imports: [RouterModule.forRoot(routes, {anchorScrolling: 'enabled', onSameUrlNavigation: 'reload'})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}


