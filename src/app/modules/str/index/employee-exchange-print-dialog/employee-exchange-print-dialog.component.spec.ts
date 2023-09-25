import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeExchangePrintDialogComponent } from './employee-exchange-print-dialog.component';

describe('EmployeeExchangePrintDialogComponent', () => {
  let component: EmployeeExchangePrintDialogComponent;
  let fixture: ComponentFixture<EmployeeExchangePrintDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeExchangePrintDialogComponent]
    });
    fixture = TestBed.createComponent(EmployeeExchangePrintDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
