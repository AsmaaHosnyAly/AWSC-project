import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaCategoryFirstDialogComponent } from './fa-category-first-dialog.component';

describe('FaCategoryFirstDialogComponent', () => {
  let component: FaCategoryFirstDialogComponent;
  let fixture: ComponentFixture<FaCategoryFirstDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FaCategoryFirstDialogComponent]
    });
    fixture = TestBed.createComponent(FaCategoryFirstDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
