import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProSellerComponent } from './pro-seller.component';

describe('ProSellerComponent', () => {
  let component: ProSellerComponent;
  let fixture: ComponentFixture<ProSellerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProSellerComponent]
    });
    fixture = TestBed.createComponent(ProSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
