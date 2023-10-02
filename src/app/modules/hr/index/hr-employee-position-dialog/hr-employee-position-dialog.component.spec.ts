import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrEmployeePositionDialogComponent } from './hr-employee-position-dialog.component';

describe('HrEmployeePositionDialogComponent', () => {
  let component: HrEmployeePositionDialogComponent;
  let fixture: ComponentFixture<HrEmployeePositionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrEmployeePositionDialogComponent]
    });
    fixture = TestBed.createComponent(HrEmployeePositionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
