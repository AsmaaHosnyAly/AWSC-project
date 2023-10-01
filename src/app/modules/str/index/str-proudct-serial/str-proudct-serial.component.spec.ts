import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrProudctSerialComponent } from './str-proudct-serial.component';

describe('StrProudctSerialComponent', () => {
  let component: StrProudctSerialComponent;
  let fixture: ComponentFixture<StrProudctSerialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StrProudctSerialComponent]
    });
    fixture = TestBed.createComponent(StrProudctSerialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
