import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrExcutedComponent } from './tr-excuted.component';

describe('TrExcutedComponent', () => {
  let component: TrExcutedComponent;
  let fixture: ComponentFixture<TrExcutedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrExcutedComponent]
    });
    fixture = TestBed.createComponent(TrExcutedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
