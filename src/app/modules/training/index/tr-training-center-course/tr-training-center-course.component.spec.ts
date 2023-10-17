import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrTrainingCenterCourseComponent } from './tr-training-center-course.component';

describe('TrTrainingCenterCourseComponent', () => {
  let component: TrTrainingCenterCourseComponent;
  let fixture: ComponentFixture<TrTrainingCenterCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrTrainingCenterCourseComponent]
    });
    fixture = TestBed.createComponent(TrTrainingCenterCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
