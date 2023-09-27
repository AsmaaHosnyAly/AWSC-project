import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrUserDialogComponent } from './pr-user-dialog.component';

describe('PrUserDialogComponent', () => {
  let component: PrUserDialogComponent;
  let fixture: ComponentFixture<PrUserDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrUserDialogComponent]
    });
    fixture = TestBed.createComponent(PrUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
