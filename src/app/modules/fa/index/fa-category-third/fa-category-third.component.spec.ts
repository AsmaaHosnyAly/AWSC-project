import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaCategoryThirdComponent } from './fa-category-third.component';

describe('FaCategoryThirdComponent', () => {
  let component: FaCategoryThirdComponent;
  let fixture: ComponentFixture<FaCategoryThirdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FaCategoryThirdComponent]
    });
    fixture = TestBed.createComponent(FaCategoryThirdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
