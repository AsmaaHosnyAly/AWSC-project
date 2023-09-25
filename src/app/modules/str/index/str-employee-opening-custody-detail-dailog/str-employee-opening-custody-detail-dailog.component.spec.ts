import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrEmployeeOpeningCustodyDetailDailogComponent } from './str-employee-opening-custody-detail-dailog.component';

describe('StrEmployeeOpeningCustodyDetailDailogComponent', () => {
  let component: StrEmployeeOpeningCustodyDetailDailogComponent;
  let fixture: ComponentFixture<StrEmployeeOpeningCustodyDetailDailogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StrEmployeeOpeningCustodyDetailDailogComponent]
    });
    fixture = TestBed.createComponent(StrEmployeeOpeningCustodyDetailDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
