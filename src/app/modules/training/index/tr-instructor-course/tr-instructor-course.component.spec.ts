import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrInstructorCourseComponent } from './tr-instructor-course.component';

describe('TrInstructorCourseComponent', () => {
  let component: TrInstructorCourseComponent;
  let fixture: ComponentFixture<TrInstructorCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrInstructorCourseComponent]
    });
    fixture = TestBed.createComponent(TrInstructorCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
