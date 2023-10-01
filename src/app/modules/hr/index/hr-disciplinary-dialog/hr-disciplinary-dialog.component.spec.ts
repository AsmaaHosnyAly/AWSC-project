import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrDisciplinaryDialogComponent } from './hr-disciplinary-dialog.component';

describe('HrDisciplinaryDialogComponent', () => {
  let component: HrDisciplinaryDialogComponent;
  let fixture: ComponentFixture<HrDisciplinaryDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrDisciplinaryDialogComponent]
    });
    fixture = TestBed.createComponent(HrDisciplinaryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
