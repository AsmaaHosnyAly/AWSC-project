import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCustodyPrintDialogComponent } from './employee-custody-print-dialog.component';

describe('EmployeeCustodyPrintDialogComponent', () => {
  let component: EmployeeCustodyPrintDialogComponent;
  let fixture: ComponentFixture<EmployeeCustodyPrintDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeCustodyPrintDialogComponent]
    });
    fixture = TestBed.createComponent(EmployeeCustodyPrintDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
