import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrTarckComponent } from './tr-tarck.component';

describe('TrTarckComponent', () => {
  let component: TrTarckComponent;
  let fixture: ComponentFixture<TrTarckComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrTarckComponent]
    });
    fixture = TestBed.createComponent(TrTarckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
