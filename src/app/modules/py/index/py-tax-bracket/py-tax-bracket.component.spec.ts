import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PyTaxBracketComponent } from './py-tax-bracket.component';

describe('PyTaxBracketComponent', () => {
  let component: PyTaxBracketComponent;
  let fixture: ComponentFixture<PyTaxBracketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PyTaxBracketComponent]
    });
    fixture = TestBed.createComponent(PyTaxBracketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
