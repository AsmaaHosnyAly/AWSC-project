import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrAttendanceMachineDialogComponent } from './hr-attendance-machine-dialog.component';

describe('HrAttendanceMachineDialogComponent', () => {
  let component: HrAttendanceMachineDialogComponent;
  let fixture: ComponentFixture<HrAttendanceMachineDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrAttendanceMachineDialogComponent]
    });
    fixture = TestBed.createComponent(HrAttendanceMachineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
