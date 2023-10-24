import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrExcutedPositionDetailsDialogComponent } from './tr-excuted-position-details-dialog.component';

describe('TrExcutedPositionDetailsDialogComponent', () => {
  let component: TrExcutedPositionDetailsDialogComponent;
  let fixture: ComponentFixture<TrExcutedPositionDetailsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrExcutedPositionDetailsDialogComponent]
    });
    fixture = TestBed.createComponent(TrExcutedPositionDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
