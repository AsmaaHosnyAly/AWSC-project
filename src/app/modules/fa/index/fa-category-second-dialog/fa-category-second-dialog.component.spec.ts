import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaCategorySecondDialogComponent } from './fa-category-second-dialog.component';

describe('FaCategorySecondDialogComponent', () => {
  let component: FaCategorySecondDialogComponent;
  let fixture: ComponentFixture<FaCategorySecondDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FaCategorySecondDialogComponent]
    });
    fixture = TestBed.createComponent(FaCategorySecondDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
