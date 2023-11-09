import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProPlanTypeDailogComponent } from './pro-plan-type-dailog.component';

describe('ProPlanTypeDailogComponent', () => {
  let component: ProPlanTypeDailogComponent;
  let fixture: ComponentFixture<ProPlanTypeDailogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProPlanTypeDailogComponent]
    });
    fixture = TestBed.createComponent(ProPlanTypeDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
