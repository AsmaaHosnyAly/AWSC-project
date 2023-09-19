import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrUsedrDetailsDialogComponent } from './pr-usedr-details-dialog.component';

describe('PrUsedrDetailsDialogComponent', () => {
  let component: PrUsedrDetailsDialogComponent;
  let fixture: ComponentFixture<PrUsedrDetailsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrUsedrDetailsDialogComponent]
    });
    fixture = TestBed.createComponent(PrUsedrDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
