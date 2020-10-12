import {Component, OnInit} from '@angular/core';
import {PaymentService} from '../../shared/service/payment.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as moment from 'moment';
import {Biling} from '../../shared/model/biling';

@Component({
    selector: 'app-cashout-magement',
    templateUrl: './cashout-magement.component.html',
    styleUrls: ['./cashout-magement.component.css']
})
export class CashoutMagementComponent implements OnInit {

    displayedColumns: string[] = ['name', 'date', 'start', 'end', 'host', 'amount', 'action'];

    dataSource = new MatTableDataSource();
    loading: boolean;

    constructor(private paymentService: PaymentService,
                private snackBar: MatSnackBar) {
    }

    ngOnInit(): void {

        this.getData();
    }

    private getData() {
        this.loading = true;
        this.paymentService
            .getCashOutRequests()
            .subscribe(
                (data) => {
                    this.loading = false;
                    this.dataSource = new MatTableDataSource(data);
                    console.log(data);
                },
                (error) => {
                    this.loading = false;
                    this.showMessage(error.message, 'my-snackbar-error');
                    console.log(error.message);
                },
            );
    }

    applyFilter($event: KeyboardEvent) {
        const filterValue = ($event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    showMessage(message, classString) {
        this.snackBar.open(message, 'Ok',
            {
                duration: 2000,
                verticalPosition: 'top',
                panelClass: [classString]
            });
    }

    getTime(time): string {
        return moment.unix(time / 1000).format('LT');
    }

    getDate(eventDate): string {
        return moment(eventDate).local().format('ll');
    }
    authorize(id) {
        this.loading = true;
        this.paymentService
            .confirmPayout(id)
            .subscribe(
                (data) => {
                    this.loading = false;
                    this.showMessage('CAshOut was authorised successfully', 'my-snackbar-success');
                    this.getData();
                },
                (error) => {
                    this.loading = false;
                    this.showMessage(error.message, 'my-snackbar-error');
                    console.log(error.message);
                },
            );
    }
    decline(id) {

    }

    getAmount(billing: Biling) {
        if (billing.withdrwalRequest > 0) {
            return billing.withdrwalRequest;
        } else {
            return billing.previousWithdrwalRequest;
        }
    }
}

