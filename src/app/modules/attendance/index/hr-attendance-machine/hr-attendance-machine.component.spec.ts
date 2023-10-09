import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrAttendanceMachineComponent } from './hr-attendance-machine.component';

describe('HrAttendanceMachineComponent', () => {
  let component: HrAttendanceMachineComponent;
  let fixture: ComponentFixture<HrAttendanceMachineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrAttendanceMachineComponent]
    });
    fixture = TestBed.createComponent(HrAttendanceMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
