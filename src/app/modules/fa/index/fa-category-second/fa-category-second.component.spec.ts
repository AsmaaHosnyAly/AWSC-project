import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaCategorySecondComponent } from './fa-category-second.component';

describe('FaCategorySecondComponent', () => {
  let component: FaCategorySecondComponent;
  let fixture: ComponentFixture<FaCategorySecondComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FaCategorySecondComponent]
    });
    fixture = TestBed.createComponent(FaCategorySecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
