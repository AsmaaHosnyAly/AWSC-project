import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrClassRoomDialogComponent } from './tr-class-room-dialog.component';

describe('TrClassRoomDialogComponent', () => {
  let component: TrClassRoomDialogComponent;
  let fixture: ComponentFixture<TrClassRoomDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrClassRoomDialogComponent]
    });
    fixture = TestBed.createComponent(TrClassRoomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
