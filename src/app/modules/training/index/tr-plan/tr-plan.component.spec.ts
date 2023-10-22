import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrPlanComponent } from './tr-plan.component';

describe('TrPlanComponent', () => {
  let component: TrPlanComponent;
  let fixture: ComponentFixture<TrPlanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrPlanComponent]
    });
    fixture = TestBed.createComponent(TrPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
