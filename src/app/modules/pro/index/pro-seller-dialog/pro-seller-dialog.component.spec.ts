import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProSellerDialogComponent } from './pro-seller-dialog.component';

describe('ProSellerDialogComponent', () => {
  let component: ProSellerDialogComponent;
  let fixture: ComponentFixture<ProSellerDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProSellerDialogComponent]
    });
    fixture = TestBed.createComponent(ProSellerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
