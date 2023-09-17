import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawPrintDialogComponent } from './withdraw-print-dialog.component';

describe('WithdrawPrintDialogComponent', () => {
  let component: WithdrawPrintDialogComponent;
  let fixture: ComponentFixture<WithdrawPrintDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WithdrawPrintDialogComponent]
    });
    fixture = TestBed.createComponent(WithdrawPrintDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
