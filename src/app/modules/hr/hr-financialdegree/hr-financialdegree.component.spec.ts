import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrFinancialdegreeComponent } from './hr-financialdegree.component';

describe('HrFinancialdegreeComponent', () => {
  let component: HrFinancialdegreeComponent;
  let fixture: ComponentFixture<HrFinancialdegreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrFinancialdegreeComponent]
    });
    fixture = TestBed.createComponent(HrFinancialdegreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
