import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrEmployeeVacationComponent } from './hr-employee-vacation.component';

describe('HrEmployeeVacationComponent', () => {
  let component: HrEmployeeVacationComponent;
  let fixture: ComponentFixture<HrEmployeeVacationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrEmployeeVacationComponent]
    });
    fixture = TestBed.createComponent(HrEmployeeVacationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
