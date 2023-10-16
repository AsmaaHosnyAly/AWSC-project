import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PyTaxBracketDialogComponent } from './py-tax-bracket-dialog.component';

describe('PyTaxBracketDialogComponent', () => {
  let component: PyTaxBracketDialogComponent;
  let fixture: ComponentFixture<PyTaxBracketDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PyTaxBracketDialogComponent]
    });
    fixture = TestBed.createComponent(PyTaxBracketDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
