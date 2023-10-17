import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrTrainingCenterCourseDialogComponent } from './tr-training-center-course-dialog.component';

describe('TrTrainingCenterCourseDialogComponent', () => {
  let component: TrTrainingCenterCourseDialogComponent;
  let fixture: ComponentFixture<TrTrainingCenterCourseDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrTrainingCenterCourseDialogComponent]
    });
    fixture = TestBed.createComponent(TrTrainingCenterCourseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
