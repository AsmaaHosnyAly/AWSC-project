import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrStoreComponent } from './str-store.component';

describe('StrStoreComponent', () => {
  let component: StrStoreComponent;
  let fixture: ComponentFixture<StrStoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StrStoreComponent]
    });
    fixture = TestBed.createComponent(StrStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
