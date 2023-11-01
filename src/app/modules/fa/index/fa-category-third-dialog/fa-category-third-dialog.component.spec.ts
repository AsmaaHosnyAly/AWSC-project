import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaCategoryThirdDialogComponent } from './fa-category-third-dialog.component';

describe('FaCategoryThirdDialogComponent', () => {
  let component: FaCategoryThirdDialogComponent;
  let fixture: ComponentFixture<FaCategoryThirdDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FaCategoryThirdDialogComponent]
    });
    fixture = TestBed.createComponent(FaCategoryThirdDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
