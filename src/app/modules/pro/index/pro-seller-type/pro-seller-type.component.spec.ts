import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProSellerTypeComponent } from './pro-seller-type.component';

describe('ProSellerTypeComponent', () => {
  let component: ProSellerTypeComponent;
  let fixture: ComponentFixture<ProSellerTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProSellerTypeComponent]
    });
    fixture = TestBed.createComponent(ProSellerTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
