import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrVacationDailogComponent } from './hr-vacation-dailog.component';

describe('HrVacationDailogComponent', () => {
  let component: HrVacationDailogComponent;
  let fixture: ComponentFixture<HrVacationDailogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrVacationDailogComponent]
    });
    fixture = TestBed.createComponent(HrVacationDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
