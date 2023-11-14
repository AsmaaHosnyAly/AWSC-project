import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProPlanTypeComponent } from './pro-plan-type.component';

describe('ProPlanTypeComponent', () => {
  let component: ProPlanTypeComponent;
  let fixture: ComponentFixture<ProPlanTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProPlanTypeComponent]
    });
    fixture = TestBed.createComponent(ProPlanTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
