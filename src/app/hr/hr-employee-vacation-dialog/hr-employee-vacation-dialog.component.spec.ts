import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrEmployeeVacationDialogComponent } from './hr-employee-vacation-dialog.component';

describe('HrEmployeeVacationDialogComponent', () => {
  let component: HrEmployeeVacationDialogComponent;
  let fixture: ComponentFixture<HrEmployeeVacationDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrEmployeeVacationDialogComponent]
    });
    fixture = TestBed.createComponent(HrEmployeeVacationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
