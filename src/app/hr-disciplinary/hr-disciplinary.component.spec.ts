import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrDisciplinaryComponent } from './hr-disciplinary.component';

describe('HrDisciplinaryComponent', () => {
  let component: HrDisciplinaryComponent;
  let fixture: ComponentFixture<HrDisciplinaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrDisciplinaryComponent]
    });
    fixture = TestBed.createComponent(HrDisciplinaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
