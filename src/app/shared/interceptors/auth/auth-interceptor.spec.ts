import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthInterceptor } from './auth-interceptor';
import { HTTP_INTERCEPTORS, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';

describe('AuthInterceptorService', () => {
	const service: AuthInterceptor = TestBed.get(AuthInterceptor);
	let httpMock: HttpTestingController;

	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				{ provide: AuthInterceptor },
				{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
			],
		}),
	);

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
