import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaFixedAssetDialogComponent } from './fa-fixed-asset-dialog.component';

describe('FaFixedAssetDialogComponent', () => {
  let component: FaFixedAssetDialogComponent;
  let fixture: ComponentFixture<FaFixedAssetDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FaFixedAssetDialogComponent]
    });
    fixture = TestBed.createComponent(FaFixedAssetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
