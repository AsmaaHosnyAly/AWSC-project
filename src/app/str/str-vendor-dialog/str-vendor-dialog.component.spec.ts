import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrVendorDialogComponent } from './str-vendor-dialog.component';

describe('StrVendorDialogComponent', () => {
  let component: StrVendorDialogComponent;
  let fixture: ComponentFixture<StrVendorDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StrVendorDialogComponent]
    });
    fixture = TestBed.createComponent(StrVendorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
