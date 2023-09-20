import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrStockTakingTableComponent } from './str-stock-taking-table.component';

describe('StrStockTakingTableComponent', () => {
  let component: StrStockTakingTableComponent;
  let fixture: ComponentFixture<StrStockTakingTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StrStockTakingTableComponent]
    });
    fixture = TestBed.createComponent(StrStockTakingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
