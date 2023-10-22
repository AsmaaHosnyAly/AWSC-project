import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrPurposeComponent } from './tr-purpose.component';

describe('TrPurposeComponent', () => {
  let component: TrPurposeComponent;
  let fixture: ComponentFixture<TrPurposeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrPurposeComponent]
    });
    fixture = TestBed.createComponent(TrPurposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
