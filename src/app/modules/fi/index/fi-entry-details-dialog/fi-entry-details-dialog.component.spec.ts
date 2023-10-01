import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiEntryDetailsDialogComponent } from './fi-entry-details-dialog.component';

describe('FiEntryDetailsDialogComponent', () => {
  let component: FiEntryDetailsDialogComponent;
  let fixture: ComponentFixture<FiEntryDetailsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiEntryDetailsDialogComponent]
    });
    fixture = TestBed.createComponent(FiEntryDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
