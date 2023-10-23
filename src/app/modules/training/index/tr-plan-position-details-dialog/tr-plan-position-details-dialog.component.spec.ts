import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrPlanPositionDetailsDialogComponent } from './tr-plan-position-details-dialog.component';

describe('TrPlanPositionDetailsDialogComponent', () => {
  let component: TrPlanPositionDetailsDialogComponent;
  let fixture: ComponentFixture<TrPlanPositionDetailsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrPlanPositionDetailsDialogComponent]
    });
    fixture = TestBed.createComponent(TrPlanPositionDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
