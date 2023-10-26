import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrExcutedFinancierDetailsDialogComponent } from './tr-excuted-financier-details-dialog.component';

describe('TrExcutedFinancierDetailsDialogComponent', () => {
  let component: TrExcutedFinancierDetailsDialogComponent;
  let fixture: ComponentFixture<TrExcutedFinancierDetailsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrExcutedFinancierDetailsDialogComponent]
    });
    fixture = TestBed.createComponent(TrExcutedFinancierDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
