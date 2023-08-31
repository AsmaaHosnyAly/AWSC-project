import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrModelComponent } from './str-model.component';

describe('StrModelComponent', () => {
  let component: StrModelComponent;
  let fixture: ComponentFixture<StrModelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StrModelComponent]
    });
    fixture = TestBed.createComponent(StrModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
