import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrPlanFinancierDetailsDialogComponent } from './tr-plan-financier-details-dialog.component';

describe('TrPlanFinancierDetailsDialogComponent', () => {
  let component: TrPlanFinancierDetailsDialogComponent;
  let fixture: ComponentFixture<TrPlanFinancierDetailsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrPlanFinancierDetailsDialogComponent]
    });
    fixture = TestBed.createComponent(TrPlanFinancierDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
