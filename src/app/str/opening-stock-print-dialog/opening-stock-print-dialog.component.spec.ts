import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningStockPrintDialogComponent } from './opening-stock-print-dialog.component';

describe('OpeningStockPrintDialogComponent', () => {
  let component: OpeningStockPrintDialogComponent;
  let fixture: ComponentFixture<OpeningStockPrintDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpeningStockPrintDialogComponent]
    });
    fixture = TestBed.createComponent(OpeningStockPrintDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
