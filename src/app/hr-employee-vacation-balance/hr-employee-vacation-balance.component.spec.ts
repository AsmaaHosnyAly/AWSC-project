import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrEmployeeVacationBalanceComponent } from './hr-employee-vacation-balance.component';

describe('HrEmployeeVacationBalanceComponent', () => {
  let component: HrEmployeeVacationBalanceComponent;
  let fixture: ComponentFixture<HrEmployeeVacationBalanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrEmployeeVacationBalanceComponent]
    });
    fixture = TestBed.createComponent(HrEmployeeVacationBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
