import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrModelDailogComponent } from './str-model-dailog.component';

describe('StrModelDailogComponent', () => {
  let component: StrModelDailogComponent;
  let fixture: ComponentFixture<StrModelDailogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StrModelDailogComponent]
    });
    fixture = TestBed.createComponent(StrModelDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
