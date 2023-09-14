import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrOpeningStockDetailsDialogComponent } from './str-opening-stock-details-dialog.component';

describe('StrOpeningStockDetailsDialogComponent', () => {
  let component: StrOpeningStockDetailsDialogComponent;
  let fixture: ComponentFixture<StrOpeningStockDetailsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StrOpeningStockDetailsDialogComponent]
    });
    fixture = TestBed.createComponent(StrOpeningStockDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
