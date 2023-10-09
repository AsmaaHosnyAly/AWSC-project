import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrAttendanceMachineWorkPlaceComponent } from './hr-attendance-machine-work-place.component';

describe('HrAttendanceMachineWorkPlaceComponent', () => {
  let component: HrAttendanceMachineWorkPlaceComponent;
  let fixture: ComponentFixture<HrAttendanceMachineWorkPlaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrAttendanceMachineWorkPlaceComponent]
    });
    fixture = TestBed.createComponent(HrAttendanceMachineWorkPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
