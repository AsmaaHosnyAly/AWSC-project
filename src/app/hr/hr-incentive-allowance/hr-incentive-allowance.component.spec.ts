import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrIncentiveAllowanceComponent } from './hr-incentive-allowance.component';

describe('HrIncentiveAllowanceComponent', () => {
  let component: HrIncentiveAllowanceComponent;
  let fixture: ComponentFixture<HrIncentiveAllowanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrIncentiveAllowanceComponent]
    });
    fixture = TestBed.createComponent(HrIncentiveAllowanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
