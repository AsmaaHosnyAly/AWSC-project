import { ComponentFixture, TestBed } from '@angular/core/testing';

import { STREmployeeOpeningCustodyTableComponent } from './str-employee-opening-custody-table.component';

describe('STREmployeeOpeningCustodyTableComponent', () => {
  let component: STREmployeeOpeningCustodyTableComponent;
  let fixture: ComponentFixture<STREmployeeOpeningCustodyTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [STREmployeeOpeningCustodyTableComponent]
    });
    fixture = TestBed.createComponent(STREmployeeOpeningCustodyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
