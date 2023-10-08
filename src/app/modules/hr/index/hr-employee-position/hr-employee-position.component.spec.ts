import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrEmployeePositionComponent } from './hr-employee-position.component';

describe('HrEmployeePositionComponent', () => {
  let component: HrEmployeePositionComponent;
  let fixture: ComponentFixture<HrEmployeePositionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrEmployeePositionComponent]
    });
    fixture = TestBed.createComponent(HrEmployeePositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
