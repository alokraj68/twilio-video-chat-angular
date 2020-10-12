import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPayoutComponent } from './confirm-payout.component';

describe('ConfirmPayoutComponent', () => {
  let component: ConfirmPayoutComponent;
  let fixture: ComponentFixture<ConfirmPayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmPayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
