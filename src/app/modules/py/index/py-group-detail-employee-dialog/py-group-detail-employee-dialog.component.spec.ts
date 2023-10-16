import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PyGroupDetailEmployeeDialogComponent } from './py-group-detail-employee-dialog.component';

describe('PyGroupDetailEmployeeDialogComponent', () => {
  let component: PyGroupDetailEmployeeDialogComponent;
  let fixture: ComponentFixture<PyGroupDetailEmployeeDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PyGroupDetailEmployeeDialogComponent]
    });
    fixture = TestBed.createComponent(PyGroupDetailEmployeeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
