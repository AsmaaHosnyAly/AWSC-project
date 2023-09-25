import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrAddPrintDialogComponent } from './str-add-print-dialog.component';

describe('StrAddPrintDialogComponent', () => {
  let component: StrAddPrintDialogComponent;
  let fixture: ComponentFixture<StrAddPrintDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StrAddPrintDialogComponent]
    });
    fixture = TestBed.createComponent(StrAddPrintDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
