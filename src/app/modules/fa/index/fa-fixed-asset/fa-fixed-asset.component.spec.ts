import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaFixedAssetComponent } from './fa-fixed-asset.component';

describe('FaFixedAssetComponent', () => {
  let component: FaFixedAssetComponent;
  let fixture: ComponentFixture<FaFixedAssetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FaFixedAssetComponent]
    });
    fixture = TestBed.createComponent(FaFixedAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
