import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrProudctSerialDialogComponent } from './str-proudct-serial-dialog.component';

describe('StrProudctSerialDialogComponent', () => {
  let component: StrProudctSerialDialogComponent;
  let fixture: ComponentFixture<StrProudctSerialDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StrProudctSerialDialogComponent]
    });
    fixture = TestBed.createComponent(StrProudctSerialDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
