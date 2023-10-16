import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrCourseTypeDialogComponent } from './tr-course-type-dialog.component';

describe('TrCourseTypeDialogComponent', () => {
  let component: TrCourseTypeDialogComponent;
  let fixture: ComponentFixture<TrCourseTypeDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrCourseTypeDialogComponent]
    });
    fixture = TestBed.createComponent(TrCourseTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
