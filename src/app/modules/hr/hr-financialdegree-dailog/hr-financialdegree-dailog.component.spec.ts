import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrFinancialdegreeDailogComponent } from './hr-financialdegree-dailog.component';

describe('HrFinancialdegreeDailogComponent', () => {
  let component: HrFinancialdegreeDailogComponent;
  let fixture: ComponentFixture<HrFinancialdegreeDailogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrFinancialdegreeDailogComponent]
    });
    fixture = TestBed.createComponent(HrFinancialdegreeDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
