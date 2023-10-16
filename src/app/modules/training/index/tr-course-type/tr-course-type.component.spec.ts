import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrCourseTypeComponent } from './tr-course-type.component';

describe('TrCourseTypeComponent', () => {
  let component: TrCourseTypeComponent;
  let fixture: ComponentFixture<TrCourseTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrCourseTypeComponent]
    });
    fixture = TestBed.createComponent(TrCourseTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
