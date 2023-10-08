import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrAttendanceMachineWorkPlaceDialogComponent } from './hr-attendance-machine-work-place-dialog.component';

describe('HrAttendanceMachineWorkPlaceDialogComponent', () => {
  let component: HrAttendanceMachineWorkPlaceDialogComponent;
  let fixture: ComponentFixture<HrAttendanceMachineWorkPlaceDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrAttendanceMachineWorkPlaceDialogComponent]
    });
    fixture = TestBed.createComponent(HrAttendanceMachineWorkPlaceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
