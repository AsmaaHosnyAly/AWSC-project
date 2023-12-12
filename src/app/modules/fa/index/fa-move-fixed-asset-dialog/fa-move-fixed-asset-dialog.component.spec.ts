import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaMoveFixedAssetDialogComponent } from './fa-move-fixed-asset-dialog.component';

describe('FaMoveFixedAssetDialogComponent', () => {
  let component: FaMoveFixedAssetDialogComponent;
  let fixture: ComponentFixture<FaMoveFixedAssetDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FaMoveFixedAssetDialogComponent]
    });
    fixture = TestBed.createComponent(FaMoveFixedAssetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
