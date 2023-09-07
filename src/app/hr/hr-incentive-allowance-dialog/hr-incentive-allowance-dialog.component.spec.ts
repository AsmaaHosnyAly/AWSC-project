import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrIncentiveAllowanceDialogComponent } from './hr-incentive-allowance-dialog.component';

describe('HrIncentiveAllowanceDialogComponent', () => {
  let component: HrIncentiveAllowanceDialogComponent;
  let fixture: ComponentFixture<HrIncentiveAllowanceDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrIncentiveAllowanceDialogComponent]
    });
    fixture = TestBed.createComponent(HrIncentiveAllowanceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
