import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcCostCenterComponent } from './cc-cost-center.component';

describe('CcCostCenterComponent', () => {
  let component: CcCostCenterComponent;
  let fixture: ComponentFixture<CcCostCenterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CcCostCenterComponent]
    });
    fixture = TestBed.createComponent(CcCostCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
