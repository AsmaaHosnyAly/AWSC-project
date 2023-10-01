import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrGroupDialogComponent } from './pr-group-dialog.component';

describe('PrGroupDialogComponent', () => {
  let component: PrGroupDialogComponent;
  let fixture: ComponentFixture<PrGroupDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrGroupDialogComponent]
    });
    fixture = TestBed.createComponent(PrGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
