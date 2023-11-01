import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaCategoryFirstComponent } from './fa-category-first.component';

describe('FaCategoryFirstComponent', () => {
  let component: FaCategoryFirstComponent;
  let fixture: ComponentFixture<FaCategoryFirstComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FaCategoryFirstComponent]
    });
    fixture = TestBed.createComponent(FaCategoryFirstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
