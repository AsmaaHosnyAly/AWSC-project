import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrClassRoomComponent } from './tr-class-room.component';

describe('TrClassRoomComponent', () => {
  let component: TrClassRoomComponent;
  let fixture: ComponentFixture<TrClassRoomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrClassRoomComponent]
    });
    fixture = TestBed.createComponent(TrClassRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
