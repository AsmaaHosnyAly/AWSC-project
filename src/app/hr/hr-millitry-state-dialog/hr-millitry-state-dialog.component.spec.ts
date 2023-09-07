import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrMillitryStateDialogComponent } from './hr-millitry-state-dialog.component';

describe('HrMillitryStateDialogComponent', () => {
  let component: HrMillitryStateDialogComponent;
  let fixture: ComponentFixture<HrMillitryStateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrMillitryStateDialogComponent]
    });
    fixture = TestBed.createComponent(HrMillitryStateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
