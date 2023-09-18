import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrMillitryStateComponent } from './hr-millitry-state.component';

describe('HrMillitryStateComponent', () => {
  let component: HrMillitryStateComponent;
  let fixture: ComponentFixture<HrMillitryStateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrMillitryStateComponent]
    });
    fixture = TestBed.createComponent(HrMillitryStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
