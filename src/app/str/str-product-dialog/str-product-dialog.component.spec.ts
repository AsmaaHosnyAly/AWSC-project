import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrProductDialogComponent } from './str-product-dialog.component';

describe('StrProductDialogComponent', () => {
  let component: StrProductDialogComponent;
  let fixture: ComponentFixture<StrProductDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StrProductDialogComponent]
    });
    fixture = TestBed.createComponent(StrProductDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
