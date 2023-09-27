import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrUserstoreComponent } from './str-userstore.component';

describe('StrUserstoreComponent', () => {
  let component: StrUserstoreComponent;
  let fixture: ComponentFixture<StrUserstoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StrUserstoreComponent]
    });
    fixture = TestBed.createComponent(StrUserstoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
