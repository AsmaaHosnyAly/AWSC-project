import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrAttendancePermissionDialogComponent } from './hr-attendance-permission-dialog.component';

describe('HrAttendancePermissionDialogComponent', () => {
  let component: HrAttendancePermissionDialogComponent;
  let fixture: ComponentFixture<HrAttendancePermissionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrAttendancePermissionDialogComponent]
    });
    fixture = TestBed.createComponent(HrAttendancePermissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
