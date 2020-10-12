import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import {MatSnackBarModule} from '@angular/material/snack-bar';
import {HttpClientModule} from '@angular/common/http';
import {ErrorInterceptor} from './error.interceptor';
import {RouterTestingModule} from '@angular/router/testing';

describe('ErrorInterceptor', () => {
    beforeEach(() =>
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), MatSnackBarModule],
        }),
    );

    it('should be created', () => {
        const service: ErrorInterceptor = TestBed.get(ErrorInterceptor);
        expect(service).toBeTruthy();
    });
});
