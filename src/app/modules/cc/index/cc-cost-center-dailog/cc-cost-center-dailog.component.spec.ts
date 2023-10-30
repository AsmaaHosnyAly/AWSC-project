import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcCostCenterDailogComponent } from './cc-cost-center-dailog.component';

describe('CcCostCenterDailogComponent', () => {
  let component: CcCostCenterDailogComponent;
  let fixture: ComponentFixture<CcCostCenterDailogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CcCostCenterDailogComponent]
    });
    fixture = TestBed.createComponent(CcCostCenterDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
