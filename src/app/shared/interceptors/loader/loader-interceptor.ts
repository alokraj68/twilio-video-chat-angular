import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {LoaderService} from '../../service/loader/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    constructor(private loaderService: LoaderService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loaderService.start();
        this.loaderService.startXhr();
        return next.handle(req).pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    // end loading if a response is received
                    this.loaderService.complete();
                    this.loaderService.completeXhr();
                    console.info(`${LoaderInterceptor.name}: URL: ${event.url}, STATUS: ${event.status}`);
                }
            }),
            catchError(err => {
                console.info(`${LoaderInterceptor.name}: END LOADING`);
                // end loading if an error occurs
                this.loaderService.complete();
                this.loaderService.completeXhr();

                return throwError(err);
            })
        );
    }
}
