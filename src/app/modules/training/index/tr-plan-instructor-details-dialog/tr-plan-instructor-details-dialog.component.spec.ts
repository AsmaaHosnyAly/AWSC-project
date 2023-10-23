import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrPlanInstructorDetailsDialogComponent } from './tr-plan-instructor-details-dialog.component';

describe('TrPlanInstructorDetailsDialogComponent', () => {
  let component: TrPlanInstructorDetailsDialogComponent;
  let fixture: ComponentFixture<TrPlanInstructorDetailsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrPlanInstructorDetailsDialogComponent]
    });
    fixture = TestBed.createComponent(TrPlanInstructorDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
