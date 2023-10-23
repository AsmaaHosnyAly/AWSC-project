import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrPlanDialogComponent } from './tr-plan-dialog.component';

describe('TrPlanDialogComponent', () => {
  let component: TrPlanDialogComponent;
  let fixture: ComponentFixture<TrPlanDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrPlanDialogComponent]
    });
    fixture = TestBed.createComponent(TrPlanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
