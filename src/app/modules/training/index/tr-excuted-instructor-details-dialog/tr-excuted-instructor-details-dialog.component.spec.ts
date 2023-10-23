import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrExcutedInstructorDetailsDialogComponent } from './tr-excuted-instructor-details-dialog.component';

describe('TrExcutedInstructorDetailsDialogComponent', () => {
  let component: TrExcutedInstructorDetailsDialogComponent;
  let fixture: ComponentFixture<TrExcutedInstructorDetailsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrExcutedInstructorDetailsDialogComponent]
    });
    fixture = TestBed.createComponent(TrExcutedInstructorDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
