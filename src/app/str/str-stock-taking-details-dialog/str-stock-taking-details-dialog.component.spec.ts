import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrStockTakingDetailsDialogComponent } from './str-stock-taking-details-dialog.component';

describe('StrStockTakingDetailsDialogComponent', () => {
  let component: StrStockTakingDetailsDialogComponent;
  let fixture: ComponentFixture<StrStockTakingDetailsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StrStockTakingDetailsDialogComponent]
    });
    fixture = TestBed.createComponent(StrStockTakingDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
