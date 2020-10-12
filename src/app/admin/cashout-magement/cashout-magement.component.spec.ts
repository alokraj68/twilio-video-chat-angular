import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashoutMagementComponent } from './cashout-magement.component';

describe('CashoutMagementComponent', () => {
  let component: CashoutMagementComponent;
  let fixture: ComponentFixture<CashoutMagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashoutMagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashoutMagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
