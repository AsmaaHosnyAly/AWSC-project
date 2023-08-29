import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrEmployeeDisciplinaryDialogComponent } from './hr-employee-disciplinary-dialog.component';

describe('HrEmployeeDisciplinaryDialogComponent', () => {
  let component: HrEmployeeDisciplinaryDialogComponent;
  let fixture: ComponentFixture<HrEmployeeDisciplinaryDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrEmployeeDisciplinaryDialogComponent]
    });
    fixture = TestBed.createComponent(HrEmployeeDisciplinaryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
