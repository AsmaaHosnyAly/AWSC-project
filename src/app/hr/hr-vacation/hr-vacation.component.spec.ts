import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrVacationComponent } from './hr-vacation.component';

describe('HrVacationComponent', () => {
  let component: HrVacationComponent;
  let fixture: ComponentFixture<HrVacationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrVacationComponent]
    });
    fixture = TestBed.createComponent(HrVacationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
