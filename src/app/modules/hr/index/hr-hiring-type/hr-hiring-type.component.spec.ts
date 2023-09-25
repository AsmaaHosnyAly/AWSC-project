import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrHiringTypeComponent } from './hr-hiring-type.component';

describe('HrHiringTypeComponent', () => {
  let component: HrHiringTypeComponent;
  let fixture: ComponentFixture<HrHiringTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrHiringTypeComponent]
    });
    fixture = TestBed.createComponent(HrHiringTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
