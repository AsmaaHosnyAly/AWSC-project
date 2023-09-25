import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrEmployeeExchangeDetailsDialogComponent } from './str-employee-exchange-details-dialog.component';

describe('StrEmployeeExchangeDetailsDialogComponent', () => {
  let component: StrEmployeeExchangeDetailsDialogComponent;
  let fixture: ComponentFixture<StrEmployeeExchangeDetailsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StrEmployeeExchangeDetailsDialogComponent]
    });
    fixture = TestBed.createComponent(StrEmployeeExchangeDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
