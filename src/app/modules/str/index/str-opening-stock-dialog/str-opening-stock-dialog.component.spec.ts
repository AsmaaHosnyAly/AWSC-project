import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrOpeningStockDialogComponent } from './str-opening-stock-dialog.component';

describe('StrOpeningStockDialogComponent', () => {
  let component: StrOpeningStockDialogComponent;
  let fixture: ComponentFixture<StrOpeningStockDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StrOpeningStockDialogComponent]
    });
    fixture = TestBed.createComponent(StrOpeningStockDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
