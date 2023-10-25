import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrUserChangePasswordDialogComponent } from './pr-user-change-password-dialog.component';

describe('PrUserChangePasswordDialogComponent', () => {
  let component: PrUserChangePasswordDialogComponent;
  let fixture: ComponentFixture<PrUserChangePasswordDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrUserChangePasswordDialogComponent]
    });
    fixture = TestBed.createComponent(PrUserChangePasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
