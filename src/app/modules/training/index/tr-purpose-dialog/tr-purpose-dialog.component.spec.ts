import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrPurposeDialogComponent } from './tr-purpose-dialog.component';

describe('TrPurposeDialogComponent', () => {
  let component: TrPurposeDialogComponent;
  let fixture: ComponentFixture<TrPurposeDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrPurposeDialogComponent]
    });
    fixture = TestBed.createComponent(TrPurposeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
