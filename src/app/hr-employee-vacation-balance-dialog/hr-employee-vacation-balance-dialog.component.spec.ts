import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrEmployeeVacationBalanceDialogComponent } from './hr-employee-vacation-balance-dialog.component';

describe('HrEmployeeVacationBalanceDialogComponent', () => {
  let component: HrEmployeeVacationBalanceDialogComponent;
  let fixture: ComponentFixture<HrEmployeeVacationBalanceDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrEmployeeVacationBalanceDialogComponent]
    });
    fixture = TestBed.createComponent(HrEmployeeVacationBalanceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
