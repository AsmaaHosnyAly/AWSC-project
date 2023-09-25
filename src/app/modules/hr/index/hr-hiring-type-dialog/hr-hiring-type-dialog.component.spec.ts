import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrHiringTypeDialogComponent } from './hr-hiring-type-dialog.component';

describe('HrHiringTypeDialogComponent', () => {
  let component: HrHiringTypeDialogComponent;
  let fixture: ComponentFixture<HrHiringTypeDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrHiringTypeDialogComponent]
    });
    fixture = TestBed.createComponent(HrHiringTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
