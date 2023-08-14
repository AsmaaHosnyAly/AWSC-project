import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrOpeningStockTableComponent } from './str-opening-stock-table.component';

describe('StrOpeningStockTableComponent', () => {
  let component: StrOpeningStockTableComponent;
  let fixture: ComponentFixture<StrOpeningStockTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StrOpeningStockTableComponent]
    });
    fixture = TestBed.createComponent(StrOpeningStockTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});