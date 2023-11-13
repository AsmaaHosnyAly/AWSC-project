import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProSellerTypeDialogComponent } from './pro-seller-type-dialog.component';

describe('ProSellerTypeDialogComponent', () => {
  let component: ProSellerTypeDialogComponent;
  let fixture: ComponentFixture<ProSellerTypeDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProSellerTypeDialogComponent]
    });
    fixture = TestBed.createComponent(ProSellerTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
