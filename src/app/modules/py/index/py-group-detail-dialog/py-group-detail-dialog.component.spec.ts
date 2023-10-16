import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PyGroupDetailDialogComponent } from './py-group-detail-dialog.component';

describe('PyGroupDetailDialogComponent', () => {
  let component: PyGroupDetailDialogComponent;
  let fixture: ComponentFixture<PyGroupDetailDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PyGroupDetailDialogComponent]
    });
    fixture = TestBed.createComponent(PyGroupDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
