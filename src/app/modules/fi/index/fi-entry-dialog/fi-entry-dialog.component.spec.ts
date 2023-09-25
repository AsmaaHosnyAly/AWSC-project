import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiEntryDialogComponent } from './fi-entry-dialog.component';

describe('FiEntryDialogComponent', () => {
  let component: FiEntryDialogComponent;
  let fixture: ComponentFixture<FiEntryDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiEntryDialogComponent]
    });
    fixture = TestBed.createComponent(FiEntryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
