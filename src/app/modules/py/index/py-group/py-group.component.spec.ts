import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PyGroupComponent } from './py-group.component';

describe('PyGroupComponent', () => {
  let component: PyGroupComponent;
  let fixture: ComponentFixture<PyGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PyGroupComponent]
    });
    fixture = TestBed.createComponent(PyGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
