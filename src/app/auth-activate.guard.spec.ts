import { TestBed } from '@angular/core/testing';

import { AuthActivateGuard } from './auth-activate.guard';

describe('AuthActivateGuard', () => {
  let guard: AuthActivateGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthActivateGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
