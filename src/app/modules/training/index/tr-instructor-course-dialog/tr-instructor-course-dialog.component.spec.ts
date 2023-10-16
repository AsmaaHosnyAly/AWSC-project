import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrInstructorCourseDialogComponent } from './tr-instructor-course-dialog.component';

describe('TrInstructorCourseDialogComponent', () => {
  let component: TrInstructorCourseDialogComponent;
  let fixture: ComponentFixture<TrInstructorCourseDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrInstructorCourseDialogComponent]
    });
    fixture = TestBed.createComponent(TrInstructorCourseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
