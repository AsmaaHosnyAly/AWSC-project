import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrStoreDialogComponent } from './str-store-dialog.component';

describe('StrStoreDialogComponent', () => {
  let component: StrStoreDialogComponent;
  let fixture: ComponentFixture<StrStoreDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StrStoreDialogComponent]
    });
    fixture = TestBed.createComponent(StrStoreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
