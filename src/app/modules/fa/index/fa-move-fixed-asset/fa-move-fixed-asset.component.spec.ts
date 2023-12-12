import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaMoveFixedAssetComponent } from './fa-move-fixed-asset.component';

describe('FaMoveFixedAssetComponent', () => {
  let component: FaMoveFixedAssetComponent;
  let fixture: ComponentFixture<FaMoveFixedAssetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FaMoveFixedAssetComponent]
    });
    fixture = TestBed.createComponent(FaMoveFixedAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
