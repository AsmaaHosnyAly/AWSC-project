import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PyGroupDialogComponent } from './py-group-dialog.component';

describe('PyGroupDialogComponent', () => {
  let component: PyGroupDialogComponent;
  let fixture: ComponentFixture<PyGroupDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PyGroupDialogComponent]
    });
    fixture = TestBed.createComponent(PyGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
