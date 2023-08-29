import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrEmployeeDisciplinaryComponent } from './hr-employee-disciplinary.component';

describe('HrEmployeeDisciplinaryComponent', () => {
  let component: HrEmployeeDisciplinaryComponent;
  let fixture: ComponentFixture<HrEmployeeDisciplinaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrEmployeeDisciplinaryComponent]
    });
    fixture = TestBed.createComponent(HrEmployeeDisciplinaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
