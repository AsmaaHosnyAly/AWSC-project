import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrVendorComponent } from './str-vendor.component';

describe('StrVendorComponent', () => {
  let component: StrVendorComponent;
  let fixture: ComponentFixture<StrVendorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StrVendorComponent]
    });
    fixture = TestBed.createComponent(StrVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
